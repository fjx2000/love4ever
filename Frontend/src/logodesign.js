import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import { Header, Divider, Icon } from 'semantic-ui-react';
import {ajaxGet, ajaxPost, isMobile, isLandscape} from './Helper.js';
import './App.css';
const Logo_BlockChain = require('./ethergreen.svg');
const Logo_BlackHeart = require('./redheartdouble.svg');

let marginTop = 300;
let mobileMarginTop = 200;

const LogoHeader = () => (
        <Header as='h1' textAlign='center' style={{fontFamily: 'Arail, "Hiragino Sans GB", "Microsoft Yahei", sans-serif', color: 'white'}}>
          区块链是永恒的，你的爱情也一样
          <Divider hidden />
        <Header.Subheader style={{fontSize: 22, fontStyle: 'bold', fontFamily: 'Arail, "Hiragino Sans GB", "Microsoft Yahei", sans-serif', color: 'white', color: 'white'}}>
            把你的爱情永久刻在区块里
          </Header.Subheader>
        </Header>
);

const LogoHeader_Mobile = () => (
        <Header as='h3' textAlign='center' style={{fontFamily: 'Arail, "Hiragino Sans GB", "Microsoft Yahei", sans-serif', color: 'white'}}>
          区块链是永恒的，你的爱情也一样
          <Divider hidden />
        <Header.Subheader style={{borderStyle: 'solid', borderColor: 'white',fontSize: 18, fontStyle: 'bold', fontFamily: 'Arail, "Hiragino Sans GB", "Microsoft Yahei", sans-serif', color: 'white', color: 'white'}}>
            把你的爱情永久刻在区块里
          </Header.Subheader>
        </Header>
);

const fadeHeader = () =>(
  <div class="text-container" style={{marginTop: marginTop}}>
    <span id="span_1" class="reg-text" >区块链是永恒的 </span>
    <span id="span_2" class="reg-text">你</span>
    <span id="span_3" class="reg-text">的</span>
    <span id="span_4" class="reg-text">爱</span>
    <span id="span_5" class="reg-text">情</span>
    <span id="span_6" class="reg-text">也</span>
    <span id="span_7" class="reg-text">一</span>
    <span id="span_8" class="reg-text">样</span>
  </div>);

  const fadeSubHeader = () =>(
    <div class="text-container-sub" >
      <span id="span_9" class="reg-text" >
        将你的爱永久刻在区块上, 在以太的星空里永恒闪烁
      </span>
    </div>);


  const fadeHeaderMobile = () =>(
    <div class="text-container-mobile" style={{marginTop: mobileMarginTop}}>
      <span id="span_1" class="reg-text" >区块链是永恒的 </span>
      <span id="span_2" class="reg-text">你</span>
      <span id="span_3" class="reg-text">的</span>
      <span id="span_4" class="reg-text">爱</span>
      <span id="span_5" class="reg-text">情</span>
      <span id="span_6" class="reg-text">也</span>
      <span id="span_7" class="reg-text">一</span>
      <span id="span_8" class="reg-text">样</span>
    </div>);

    const fadeSubHeaderMobile = () =>(
      <div class="text-container-sub-mobile">
        <span id="span_9" class="reg-text" >
          把你的爱永久刻在区块里, 在以太的星空里永恒闪烁
        </span>
      </div>);

  const loopTimer = (spanIndex, delayTime) => {
    setTimeout(function () {
      let spanElement;
      let classArray;
      spanElement = document.getElementById("span_" + spanIndex);
      classArray = spanElement.className.split(" ");
      if (classArray.indexOf("loaded") == -1) {
        spanElement.className += " " + "loaded";
      }
      if(spanIndex < 8){
         loopTimer(++spanIndex, spanIndex==2 ? 1500 : 300);
      }
      //show sub header
      if(spanIndex == 8){
         loopTimer(++spanIndex, 1000);
      }
    }, delayTime);
  }

  const startTimer = () => {
    let spanIndex = 1;
    loopTimer(spanIndex, 1000);
  }


//          <img src={Logo_BlackHeart}  style={{ opacity: 0.0, marginTop: 100 }} width = '5%' />

class LogoDesign extends Component {

  constructor(props) {
    super(props);
    this.handleOrientationEvent = this.handleOrientationEvent.bind(this);
  }

  componentWillMount(){
    window.addEventListener("orientationchange", this.handleOrientationEvent);
  }

  handleOrientationEvent = () =>{
    if(isLandscape()){
      mobileMarginTop = 120;
      this.forceUpdate();
    }else{
      mobileMarginTop = 200;
      this.forceUpdate();
    }
  }

  render(){
    return (
      <div textAlign='center'>
        <div>
          <img src={Logo_BlockChain}  className="App-logo" style={{ marginLeft: 20, marginTop: 10, opacity: 1.0 }} />
        </div>
        <div className="App">

          {isMobile() ? fadeHeaderMobile() : fadeHeader()}
          {isMobile() ? fadeSubHeaderMobile() : fadeSubHeader()}
          {startTimer()}
        </div>
      </div>
     )
  }
}

export default LogoDesign;
