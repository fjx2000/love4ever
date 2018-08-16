pragma solidity ^0.4.23;
import "./manifestoStorage.sol";

contract Love4ever {

    ManifestoStorage manifestoStorage;
    address contractCreator;

    constructor(address _contractOfManifestoStorage) public {
        contractCreator = msg.sender;
        manifestoStorage = ManifestoStorage(_contractOfManifestoStorage);
    }

    modifier owned() {
        require(msg.sender == contractCreator);
        _;
    }
    
    function createLoveManifestor(bytes32 _from, bytes32 _to, bytes32 _hash, bytes32 _uuid, uint8 _type) owned public returns(bool) {

        return manifestoStorage.addLoveManifestoToList(_from, _to, _hash, _uuid, _type);
    }
    
    function deleteLoveManifestor(bytes32 _uuid) owned public returns(bool){
        
        return manifestoStorage.delLoveManifestoFromList(_uuid);
    }
 
    function findLoveManifestoByUuid(bytes32 _uuid) public view returns (bytes32 _from, bytes32 _to, bytes32 _hash, uint8 _type, uint32 _index){
        
        return  manifestoStorage.getLoveManifestoById(_uuid);
    }
    
    function getAmountOfManifestos() public view returns (uint32){
        
        return  manifestoStorage.getAmountOfLoveManifestos();
    }    
    
    function kill() owned() public {
        selfdestruct(contractCreator);
    }
}
