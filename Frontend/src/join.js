import React, { Component } from 'react';
import { Header, Container, Label} from 'semantic-ui-react';
import {ajaxGet, ajaxPost} from './Helper.js';
// import lover from '../ethereum/lover';
// import web3 from '../ethereum/web3';


class Join extends Component {
  state = {
      numberofLovers: 12450
  }


 componentWillMount() {
    ajaxGet(BACKEND_RESTAPI_GET_PAY_AND_ETHEREUM_STATUS+this.state.uuid, (res) => {
      if(res.code == 0){
        this.setState({
         openPayModal : false,
        })
    })
  }

  render() {
    const { value } = this.state
    return (
      <div>
        <Container>
          <Header as='h3' textAlign='center' inverted>
            现在加入， 成为第
            <span style={{color: 'teal', fontSize: '1.5em', fontStyle: 'italic'}}>
              <u>
                {this.state.allLovers}
              </u>
            </span>
            个把爱写入区块链的人
          </Header>
        </Container>
      </div>
    )
  }
}

export default Join
