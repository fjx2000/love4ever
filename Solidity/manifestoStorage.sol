pragma solidity ^0.4.23;

contract ManifestoStorage {

    struct LoveManifesto {
        bytes32 loveFrom;
        bytes32 loveTo;
        bytes32 hashOfLove;
        bytes32 uuidOfManifesto; //hash of eamil address to identify a unique manifesto
        uint8   typeOfContract;
        uint32  indexOfManifesto;
    }
    
    address contractCreator;
    uint32 amountOfLoveManifestos = 0;
    
    mapping(bytes32 => LoveManifesto) loveManifestoList;
    mapping(address => bool) accessAllowed;

    constructor() public {
        contractCreator = msg.sender;
        accessAllowed[msg.sender] = true;
    }
    
    modifier owned() {
        require(msg.sender == contractCreator);
        _;
    }
    
    modifier hasAccess() {
        require(accessAllowed[msg.sender] == true);
        _;
    }
    
    //only contract creater can grant access for other addresses
    function allowAccess(address _address) owned public {
        accessAllowed[_address] = true;
    }
    
    function denyAccess(address _address) public {
        require(contractCreator == msg.sender);
        accessAllowed[_address] = false;
    }
    
    function getAmountOfLoveManifestos() hasAccess view public returns(uint32){
        return amountOfLoveManifestos;
    }
    
    
    function getLoveManifestoById(bytes32 _uuid) hasAccess view public returns (bytes32 _from, bytes32 _to, bytes32 _hash, uint8 _type, uint32 _index){
        LoveManifesto memory loveManifesto = loveManifestoList[_uuid];
        return (loveManifesto.loveFrom, loveManifesto.loveTo, loveManifesto.hashOfLove, loveManifesto.typeOfContract,loveManifesto.indexOfManifesto);
    }

    
    function addLoveManifestoToList(bytes32 _from, bytes32 _to, bytes32 _hash, bytes32 _uuid, uint8 _type) hasAccess public returns(bool) {
        amountOfLoveManifestos++;
        
        LoveManifesto memory loveManifesto = LoveManifesto ({
            loveFrom: _from,
            loveTo: _to,
            hashOfLove: _hash,
            uuidOfManifesto: _uuid,
            typeOfContract: _type,
            indexOfManifesto: amountOfLoveManifestos
        });
        loveManifestoList[_uuid] = loveManifesto;
        return true;
    }
    
    function delLoveManifestoFromList(bytes32 _uuid) hasAccess public returns(bool) {
       //do not change the value of amountOfLoveManifestos, love manifesto rleated to the uuid is still there just set it as zero
        
        delete loveManifestoList[_uuid];
        return true;
    }
    
    function kill() owned() public {
        selfdestruct(contractCreator);
    }

}
