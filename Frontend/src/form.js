import React, { Component } from 'react';
import { Button, Label, Form, Input, TextArea, Message, Divider, Icon, Header, Container,  Checkbox, Modal, Image, Confirm} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Slider, { Range } from 'rc-slider';
import Dialog from 'material-ui/Dialog';
import {ajaxGet, ajaxPost, isMobile, colorLinks, isLandscape, getArgumentFromAddressBar} from './Helper.js';
// import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'rc-slider/assets/index.css';
import 'semantic-ui-css/semantic.min.css';
const PAY_QRCODE = require('./testpay1.png');
const LOGO_WECHAT_PAY = require('./wechatpaylogo2.jpg');
const LOGO_LOADING = require('./loading2.gif');

const MAXIMUM_LENGTH_OF_NAME = 12;
const MAXIMUM_LENGTH_OF_EMAIL = 40;
const MAXIMUM_LENGTH_OF_MANIFESTO = 180;
const MAXIMUM_TIMES_OF_PAYMENT_CHECK = 300;
const MAXIMUM_TIMES_OF_ETHEREUM_CHECK = 300;

const COLOR_OF_FORM = 'teal';
const TERM1_OF_MANIFESTO = '我理解我的信息一旦被写入区块链，将永久存在且不能修改';
const TERM2_OF_MANIFESTO = '我同意将我的信息写入区块链，并公开在Ethereum区块链和Love4ever.io网站上';
const WECHAT_PAY_SUCCESS = ' 支付完成';
const ETHEREUM_WRITE_SUCCESS = ' 写入成功';
const ETHEREUM_WRITE_OVERTIME = '写入超时';

const payStatus = {
  STATUS_PAY_SUCCESS: 2,
  STATUS_PAY_FAILED: 3,
  STATUS_PAY_TIMEOUT: 4
};
const ethereumStatus = {
  STATUS_ETH_WRITE_ONGOING: 1,
  STATUS_ETH_WRITE_DONE: 2,
  STATUS_ETH_WRITE_FAILED: 3,
  STATUS_ETH_WRITE_TIMEOUT: 4
};

const BACKEND_RESTAPI_PREFIX = 'http://www.love4ever.io/api/';
const BACKEND_RESTAPI_CREATE_LOVE_MANIFESTO = BACKEND_RESTAPI_PREFIX + 'lovemanif';
const BACKEND_RESTAPI_PAY_QR_CODE_UUID = BACKEND_RESTAPI_PREFIX + 'qrcode_image?uuid=';
const BACKEND_RESTAPI_GET_PAY_AND_ETHEREUM_STATUS = BACKEND_RESTAPI_PREFIX + 'lovemanif?uuid=';
const BACKEND_RESTAPI_GET_NUMBER_OF_MANIFESTO = BACKEND_RESTAPI_PREFIX + 'eth/lovemanif_num';
const BACKEND_RESTAPI_GET_MANIFESTO_BY_EMAIL = BACKEND_RESTAPI_PREFIX + 'lovemanif_byemail?email_address='

class FormLovers extends Component {
  constructor(props) {
    super(props);
    this.state = {
        yourName: '',
        partnerName: '',
        emailAddress: '',
        searchEmailAddress: '',
        loveManifesto: '',
        isLoading: false,
        loadingIcon: '',
        loadingHeader: '',
        loadingMessage: '',
        loadingFlag: true,
        error: false,
        errorHeader: '',
        errorMessage: '',
        lovePrice: 21314,
        openConfirmation: false,
        openEmailAlert: false,
        openPayModal: false,
        checkPaymentTimes: 0,
        checkEthereum: 0,
        uuid: '',
        blockID: '',
        transactionID: '',
        numberofLovers: 12488
    }

    this.handleChangeYourName = this.handleChangeYourName.bind(this);
    this.handleChangePartnerName = this.handleChangePartnerName.bind(this);
    this.handleChangeLoveManifesto = this.handleChangeLoveManifesto.bind(this);
    this.handleChangeEmailAddress = this.handleChangeEmailAddress.bind(this);
    this.handleChangeSearchEmailAddress = this.handleChangeSearchEmailAddress.bind(this);
  }

 componentWillMount() {
    ajaxGet(BACKEND_RESTAPI_GET_NUMBER_OF_MANIFESTO, (res) => {
      if(res.code == 0){
        this.setState({
         numberofLovers : this.state.numberofLovers + res.num
        })
      }
    })
  }

  componentDidMount(){
    colorLinks('white');
    if(this.state.searchEmailAddress = getArgumentFromAddressBar('uuid')){
      this.onSearch()
    }
  }

  handleChangeYourName(event) {
    this.resetFormStatus();
    let validName = this.checkNameValidity(event.target.value)
    this.setState({yourName: validName});
  }

  handleChangePartnerName(event) {
    this.resetFormStatus();
    let validName = this.checkNameValidity(event.target.value)
    this.setState({partnerName: validName});
  }

  handleChangeLoveManifesto(event) {
    if(event.target.value.length > MAXIMUM_LENGTH_OF_MANIFESTO){
      if(this.state.error == false){
        setTimeout(() => {
          this.setState({
            error: false,
            errorHeader: '',
            errorMessage: ''
          })
        }, 1500);
      }

      this.setState({
        error: true,
        errorHeader: '提示!',
        errorMessage: '内容长度不能超过' + MAXIMUM_LENGTH_OF_MANIFESTO + '个字或字符.'
      })
    }

    this.setState({
      loveManifesto: event.target.value.substring(0, MAXIMUM_LENGTH_OF_MANIFESTO)
    });
  }

  handleChangeEmailAddress(event) {
    this.setState({
      error: false,
      emailAddress: event.target.value.substring(0, MAXIMUM_LENGTH_OF_EMAIL)
    });
  }

  handleChangeSearchEmailAddress(event) {
    this.setState({
      searchEmailAddress: event.target.value.substring(0, MAXIMUM_LENGTH_OF_EMAIL)
    });
  }

  checkNameValidity(name){
    //let InvalidString = new RegExp(/[`~!#$^&*()=|{}':;'",\\.<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？… ………&¥@% €]/);
    //let validName = name.replace(InvalidString, "");
    if(name.length > MAXIMUM_LENGTH_OF_NAME){
      name = name.substring(0, MAXIMUM_LENGTH_OF_NAME);

      if(this.state.error == false){
        setTimeout(() => {
          this.setState({
            error: false,
            errorHeader: '',
            errorMessage: ''
          })
        }, 1500);
      }

      this.setState({
        error: true,
        errorHeader: '提示!',
        errorMessage: '名字长度不能超过' + MAXIMUM_LENGTH_OF_NAME + '个字或字符.'
      })
    }

    return name;
  }

  checkEmailValidity(emailAddress) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailAddress);
  }

  checkPayment(){
    ajaxGet(BACKEND_RESTAPI_GET_PAY_AND_ETHEREUM_STATUS+this.state.uuid, (res) => {
      if(res.code == 0){
        if(res.data.pay_status == payStatus.STATUS_PAY_SUCCESS){
          clearInterval(this.loopTimer);
          this.setState({
            openPayModal : false,
            isLoading : true,
            loadingIcon: 'circle notched',
            loadingHeader: WECHAT_PAY_SUCCESS,
            loadingMessage : '系统正在努力地把你的爱写入Ethereum区块链，整个过程大约需要1-2分钟，请耐心等待......',
          })

          this.loopTimer = setInterval(() => {
            this.checkEthereum()
          }, 1500);

        }
        else if(res.data.pay_status == payStatus.STATUS_PAY_FAILED) {
          //TBD
        }
        else if(res.data.pay_status == payStatus.STATUS_PAY_TIMEOUT) {
          //TBD
        }
      }
    })

    if(this.state.checkPaymentTimes++ > MAXIMUM_TIMES_OF_PAYMENT_CHECK){
      clearInterval(this.loopTimer);
      this.setState({
        openPayModal : false,
        error : true,
        errorHeader: '支付超时',
        errorMessage : '未能在指定时间内完成支付，请重新提交并尽快完成支付'
      })
    }
  }

  checkEthereum(){
    ajaxGet(BACKEND_RESTAPI_GET_PAY_AND_ETHEREUM_STATUS+this.state.uuid, (res) => {
      if(res.code == 0){
        if(res.data.eth_status == ethereumStatus.STATUS_ETH_WRITE_DONE){
          clearInterval(this.loopTimer);
          this.setState({
            isLoading : true,
            loadingFlag: false,
            loadingIcon: 'hand peace',
            loadingHeader: ETHEREUM_WRITE_SUCCESS,
            loadingMessage : '噢耶, 你的爱已成功写入Ethereum区块链!',
            yourName: '',
            partnerName: '',
            emailAddress: '',
            loveManifesto: '',
            blockID: res.data.eth_block_nr,
            transactionID: res.data.eth_tx_hash
          })
        }
        else if(res.data.eth_status == ethereumStatus.STATUS_ETH_WRITE_FAILED) {
          //TBD
        }
        else if(res.data.eth_status == ethereumStatus.STATUS_ETH_WRITE_TIMEOUT) {
          //TBD
        }
      }
    })
    if(this.state.checkEthereum++ > MAXIMUM_TIMES_OF_ETHEREUM_CHECK){
      clearInterval(this.loopTimer);
      this.setState({
        isLoading : true,
        loadingFlag: false,
        loadingIcon: 'hand peace',
        loadingHeader: ETHEREUM_WRITE_OVERTIME,
        loadingMessage : '由于当前区块链事务较多，系统未能在指定时间内完成写入。我们会继续尝试，稍后会通过邮件的方式通知到你！',
      })
    }
  }

  onSubmit = async (event) => {
    if(!this.checkEmailValidity(this.state.emailAddress)){
      this.setState({
        error: true,
        errorHeader: '出错了!',
        errorMessage: '邮箱地址格式错误，请重新输入'
      })
      return
    }

    this.setState({ openConfirmation: true })
  }

  onSliderChange = (value) => {
    this.setState({
      lovePrice : value
    });
  }

  handleCancel = () => {
    this.setState({openConfirmation: false});
  };

  handleConfirm = () => {

    let jsonBody = {
      your_name: this.state.yourName,
      partner_name: this.state.partnerName,
      love_manifesto: this.state.loveManifesto,
      email_address: this.state.emailAddress,
      love_price: this.state.lovePrice
    }

    this.setState({
      openConfirmation: false,
      openPayModal: true,
    });

    ajaxPost(BACKEND_RESTAPI_CREATE_LOVE_MANIFESTO, jsonBody, (res) =>{
      if(res.code == 0){
        this.setState({
          uuid: res.uuid
        });

        this.loopTimer = setInterval(() => {
          this.checkPayment()
        }, 1500);
      }
      else{
        //TBD, failed case
      }
    })
  };

  onSearch = () =>{
     if(this.state.searchEmailAddress.length == 0){
       return;
     }
     if(!this.checkEmailValidity(this.state.searchEmailAddress)){
       this.setState({
         searchIndication: '邮箱地址格式错误，请重新输入',
         openEmailAlert: true
       })
     }
     else{
       ajaxGet(BACKEND_RESTAPI_GET_MANIFESTO_BY_EMAIL + this.state.searchEmailAddress, (res) => {
         if(res.code == 0){
           if(res.data.length == 0){
             this.setState({
               searchIndication: '未查询到相应记录，请检查邮箱地址是否正确',
               openEmailAlert: true
             })
             return;
           }

           let searchedBalls = {
             'numberOfBalls': 0,
             'contentOfBalls': []
           }
           res.data.map((item) =>{
             if(item.eth_block_nr != null){
               searchedBalls.contentOfBalls.push({
                 'from': item.from,
                 'to': item.to,
                 'value': item.value,
                 'blockID': item.eth_block_nr,
                 'loveManifesto': item.cont,
               });
               searchedBalls.numberOfBalls++;
             }
           })
           this.props.getSearchedBalls(searchedBalls)
         }
         else{
           this.setState({
             searchIndication: '未查询到相应记录，请检查邮箱地址是否正确',
             openEmailAlert: true
           })
         }
       })
     }
  }

//价值¥{(this.state.lovePrice/100).toFixed(2)}</Header>}

  confirmHeader = () =>{
    return (
      <Header as='h2'>
          <Icon name='heart' color='red' size='large' />
        支付提示
      </Header>
    );
  }

  confirmContent = () =>{
    return (
      <Header.Subheader style={{fontSize: 14}}>
        每颗
        <Icon.Group>
          <Icon name='heart' color='red' size='small' />
        </Icon.Group>
        价值一分钱,  {' '}你在爱中放入了{this.state.lovePrice}颗
        <Icon.Group>
          <Icon name='heart' color='red' size='small' />
        </Icon.Group>
        ,  {' '}价值 ¥{(this.state.lovePrice/100).toFixed(2)}
      </Header.Subheader>
    );
  }

  showConfirmation = () =>{
    return (
      <Confirm
        open={this.state.openConfirmation}
        cancelButton='返回修改'
        confirmButton='确定提交'
        header={this.confirmHeader()}
        content={this.confirmContent()}
        onCancel={this.handleCancel}
        onConfirm={this.handleConfirm}
     />
    )
  }

  testOnly = () => {
    this.setState({
      isLoading : true,
      loadingFlag: false,
      loadingIcon: 'hand peace',
      loadingHeader: WECHAT_PAY_SUCCESS,
      loadingMessage : '噢耶, 你的爱已成功写入Ethereum区块链!.........',
      blockID: '887665555',
      transactionID: '0x97e1669f312026f511b236fafed35f0467ca48b820037a628ef405a933413369',
      yourName: '',
      partnerName: '',
      emailAddress: '',
      loveManifesto: ''
    })
  }

  showEmailAlert = () =>{
    return (
     <Modal
        open={this.state.openEmailAlert}
        header='提示!'
        content={this.state.searchIndication}
        actions={[{ key: 'done', content: '确定', positive: false }]}
        onClose={() => this.setState({openEmailAlert: false})}
      />
    )
  }

  showPayModal = () =>{
    console.log('showPayModal', this.state.openPayModal)
    return(
      <Modal open={this.state.openPayModal}>
        <Modal.Header image><Image size='small' src={LOGO_WECHAT_PAY} /></Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src={this.state.uuid == '' ? LOGO_LOADING : (BACKEND_RESTAPI_PAY_QR_CODE_UUID + this.state.uuid)} />
          <Modal.Description>
            <Divider hidden />
            <Header>请使用微信扫一扫，扫描左侧二维码支付</Header>
          <Header.Subheader>需要支付 ¥{(this.state.lovePrice/100).toFixed(2)}</Header.Subheader>
          <Divider hidden />
          <Header.Subheader>*请尽快完成支付，二维码将在十分钟后失效</Header.Subheader>
          <Divider hidden />
          <Header.Subheader>*支付完成以后，请不要关闭窗口，耐心等待页面自动跳转</Header.Subheader>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }

  showNumberOfLovers = () =>{
      return (
        <div>
          <Container>
            <Header as='h3' textAlign='center' inverted   style={{fontFamily: "Microsoft Yahei"}}>
              现在加入， 成为第
              <span style={{color: COLOR_OF_FORM, fontSize: '1.5em', fontStyle: 'italic'}}>
                <u>
                  {this.state.numberofLovers}
                </u>
              </span>
              个把爱写入区块链的人
            </Header>
          </Container>
        </div>
      )
  }

  elementAddClass = (elementId, className) =>{
    let element;
    let classArray;
    element = document.getElementById(elementId);
    classArray = element.className.split(" ");
    if (classArray.indexOf(className) == -1) {
      element.className += " " + className;
    }
  }

  showSearchBox = () =>{
    return(
      <Input
      onFocus = {(event) => {event.preventDefault()}}
      onChange = {(event) => this.handleChangeSearchEmailAddress(event)}
      value={this.state.searchEmailAddress}
      icon={<Icon name='search' onClick={this.onSearch} inverted circular link  color='teal'/>}
      placeholder='输入邮箱地址查询...'
       />
    )
  }

  showContact = () =>{
    return(
      <Header as='h5' textAlign='center' style={{fontFamily: 'Arail, "Hiragino Sans GB", "Microsoft Yahei", sans-serif', color: 'white'}}>
        <a href="mailto:love4ever@aityuan.com?subject=意见反馈">
          <u>love4ever@aityuan.com</u>
        </a>
      </Header>
    )
  }

  showLoadingMessage = () =>{
    if(this.state.loadingHeader == ETHEREUM_WRITE_OVERTIME || this.state.loadingHeader == WECHAT_PAY_SUCCESS){
      if(isMobile()){
        return (
          <Header.Subheader style={{fontSize: 12}}> { this.state.loadingMessage }</Header.Subheader>
        )
      }else{
        return (
          <Header.Subheader style={{fontSize: 13}}> { this.state.loadingMessage }</Header.Subheader>
        )
      }

    }else if(this.state.loadingHeader == ETHEREUM_WRITE_SUCCESS){
      if(isMobile()){
        if(isLandscape()){
          return(
            <div>
              <Header.Subheader style={{fontSize: 12}}> { this.state.loadingMessage }</Header.Subheader>
              <Header.Subheader style={{fontSize: 12}}> BlockID : { this.state.blockID }</Header.Subheader>
              <Header.Subheader style={{fontSize: 12}}> TransactionID : { this.state.transactionID }</Header.Subheader>
              <Header.Subheader style={{fontSize: 12}}> 更多信息请查询Email或</Header.Subheader>
              <Header.Subheader style={{fontSize: 12}}> https://etherscan.io/tx/{this.state.transactionID} </Header.Subheader>
            </div>
          )
        }else{
          return(
            <div>
              <Header.Subheader style={{fontSize: 12}}> { this.state.loadingMessage }</Header.Subheader>
              <Header.Subheader style={{fontSize: 12}}> BlockID : { this.state.blockID }</Header.Subheader>
              <Header.Subheader style={{fontSize: 12}}> 更多信息请查询Email或</Header.Subheader>
              <Header.Subheader style={{fontSize: 12}}> https://etherscan.io/ </Header.Subheader>
            </div>
          )
        }
      }else{
        return(
          <div>
            <Header.Subheader style={{fontSize: 13}}> { this.state.loadingMessage }</Header.Subheader>
            <Header.Subheader style={{fontSize: 13}}> BlockID : { this.state.blockID }</Header.Subheader>
            <Header.Subheader style={{fontSize: 13}}> TransactionID : { this.state.transactionID }</Header.Subheader>
            <Header.Subheader style={{fontSize: 13}}> 更多信息请查询Email或</Header.Subheader>
            <Header.Subheader style={{fontSize: 13}}> https://etherscan.io/tx/{this.state.transactionID} </Header.Subheader>
          </div>
        )
      }
    }
  }

  resetFormStatus = () =>{
    if(this.state.loadingHeader == ETHEREUM_WRITE_SUCCESS || this.state.loadingHeader == ETHEREUM_WRITE_OVERTIME){
      this.setState({
        isLoading: false
      })
    }
  }

  render() {
    const { value } = this.state
    return (
        <div>
        <Divider hidden/>
        {this.showNumberOfLovers()}
        <Divider hidden/>
        <div>
        <Container>
      <Form onSubmit={this.onSubmit} inverted size='auto' style={{fontFamily: "Microsoft Yahei"}}>
        <Form.Group widths='equal' >
          <Form.Field>
              <Input required
                label={<Label icon='user' content="你的名字*"  color={COLOR_OF_FORM} style={{fontFamily: "Microsoft Yahei"}} />}
                actionPosition='left'
                placeholder='请输入你的名字'
                onChange = {event => this.handleChangeYourName(event)}
                value={this.state.yourName}
              />
          </Form.Field>
          <Form.Field>
              <Input required
                label={<Label icon='user' content="对方名字*"  color={COLOR_OF_FORM} style={{fontFamily: "Microsoft Yahei"}} />}
                actionPosition='left'
                placeholder='请输入对方名字'
                onChange = {event => this.handleChangePartnerName(event)}
                value={this.state.partnerName}
              />
          </Form.Field>
          <Form.Field>
              <Input required
                label={<Label icon='mail' content="你的邮箱*"  color={COLOR_OF_FORM} style={{fontFamily: "Microsoft Yahei"}} />}
                actionPosition='left'
                placeholder='请输入你的邮箱'
                onChange = {event => this.handleChangeEmailAddress(event)}
                value={this.state.emailAddress}
              />
          </Form.Field>
        </Form.Group>
        <Divider hidden/>

        <Form.Field>
          <Label as='a' color={COLOR_OF_FORM} size='large' style={{fontFamily: "Microsoft Yahei"}} icon>
            <Icon name='heart' color='white' size='small'/>
            爱, 勇敢说出来*
            <Label.Detail></Label.Detail>
          </Label>
          <TextArea required
            style={{marginTop:8}}
            autoHeight='true'
            placeholder='把想和对方说的话写在这里，你的爱将被永久的记录在区块链里'
            onChange = {event => this.handleChangeLoveManifesto(event)}
            value={this.state.loveManifesto}
          />
        </Form.Field>
        <Divider hidden/>
      <Header as='h4' inverted textAlign='left' style={{marginTop: '1px', fontFamily: 'Arail, "Hiragino Sans GB", "Microsoft Yahei", "SimHei", sans-serif'}}>
          <p>
            为你的爱放入
            <span style={{color: COLOR_OF_FORM, fontSize: '1.5em', fontStyle: 'italic'}}>
              <u>
                {this.state.lovePrice.toFixed(0)}
              </u>
            </span>
            颗爱心{' '}
            <span id='flashHeart' class="flash-heart">
              <Icon name='heart' color='red' size='large'/>
            </span>
          </p>
          </Header>
          <Divider hidden/>
          <Slider
              trackStyle={{ backgroundColor: COLOR_OF_FORM}}
              handleStyle={{ borderColor: 'white'}}
              step={1}
              defaultValue={21314}
              min={1314}
              max={131400}
              value={this.state.lovePrice}
              onChange={this.onSliderChange}
            />
         <Divider hidden/>
       <Form.Field checked control={Checkbox} labelPositio='left' label={TERM1_OF_MANIFESTO}/>
       <Form.Field checked control={Checkbox} labelPositio='left' label={TERM2_OF_MANIFESTO}/>
               <Divider hidden/>
               <Message hidden={!this.state.isLoading} positive={this.state.isLoading} icon>
                  {this.state.loadingFlag ? <Icon name= {this.state.loadingIcon} loading/> : <Icon name= {this.state.loadingIcon}/>}
                  <Message.Content>
                    <Message.Header><Header as='h3'> {this.state.loadingHeader} </Header></Message.Header>
                    <p></p>
                    {this.showLoadingMessage()}
                  </Message.Content>
                </Message>
                <Message hidden={!this.state.error} negative={this.state.error} icon>
                    <Icon name= 'warning circle'/>
                    <Message.Content>
                        <Message.Header>{this.state.errorHeader}</Message.Header>
                        {this.state.errorMessage}
                    </Message.Content>
                </Message>
            <Divider hidden />
          <Container textAlign='center'>
            <Form.Field  inverted control={Button} icon color='white'>
                <Icon name='heart' color='red'/> 提交&写入
            </Form.Field>
          </Container>
       </Form>
        </Container>
        <Container textAlign='center'>
          <Divider hidden />
          <Divider hidden />
          {this.showSearchBox()}
          {this.showConfirmation()}
          {this.showPayModal()}
          {this.showEmailAlert()}
          {this.showContact()}
        </Container>
      </div>
      </div>
    )
  }
}

export default FormLovers
