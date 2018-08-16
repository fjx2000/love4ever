import React from 'react';
import { Parallax } from 'react-spring';
import { Header, Icon, Grid, Segment, Card, Image, Container, Button, Divider } from 'semantic-ui-react';
import Form from './Form';
import DragBall, {mouseClickOnTarget, resetMouseClickFlag} from './DragBall.js';
import Tree from './Tree.js';
import Data from './Data.js';
import LogoDesign from './LogoDesign.js';
import {ajaxGet, ajaxPost, isMobile} from './Helper.js';
const Logo_EtherLine = require('./blackline.png');
const Logo_EtherGreen = require('./ethergreen.svg');
const Logo_EtherBlue = require('./etherblue.png');
const Logo_HeartChain = require('./heartchain.png');
const Logo_HeartColor = require('./heartcolor.jpg');
//const Back_Image = require('./star.svg');

//import { Router, Link } from '../routes';

// Little helpers ...

// const Pink = ({ children }) => <span style={{ color: '#FF6AC1' }}>{children}</span>
// const Yellow = ({ children }) => <span style={{ color: '#EFF59B' }}>{children}</span>
// const Lightblue = ({ children }) => <span style={{ color: '#9AEDFE' }}>{children}</span>
// const Green = ({ children }) => <span style={{ color: '#57EE89' }}>{children}</span>
// const Blue = ({ children }) => <span style={{ color: '#57C7FF' }}>{children}</span>
// const Gray = ({ children }) => <span style={{ color: '#909090' }}>{children}</span>

const DragBallParallax = () =>(
  <div style={{ marginTop: -300 }}>
    <DragBall page='0' count='70' />
  </div>
)

const DragBallParallaxMobile = () =>(
  <div style={{ marginTop: -200 }}>
    <DragBall page='0' count='70' />
  </div>
)

export default class Paralax extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfBalls: 0,
      contentOfBalls: {},
      pages: 3.3
    }
    this.handleScroll = this.handleScroll.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  handleScroll = (e) =>  {
    console.log('the scroll things', e)
  };

  handleMouseUp = (e) =>  {
    console.log('the mouse up', e)
  };

  componentDidMount() {
    //window.addEventListener('scroll', this.handleScroll);
    //window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener("orientationchange", this.handleOrientationEvent);
  };

  handleOrientationEvent = () =>{
    if(window.orientation == 90 || window.orientation == -90){
      this.setState({
        pages: 3.8
      });
    }else{
      this.setState({
        pages: 3.3
      });
    }
  }

  componentWillUnmount() {
      //window.removeEventListener('scroll', this.handleScroll);
      //window.removeEventListener('mouseup', this.handleMouseUp);
    };

  getSearchedBalls(searchedBalls){
    this.setState({
      numberOfBalls: searchedBalls.numberOfBalls,
      contentOfBalls: searchedBalls.contentOfBalls
    })
  }

  showSearchedBalls(){
    if(this.state.numberOfBalls > 0){
      return(
        <DragBall page='2' count= {this.state.numberOfBalls} contentOfBalls = {this.state.contentOfBalls} />
      )
    }
  }

  render() {
    return (
      <Parallax ref={ref => (this.parallax = ref)} pages={this.state.pages}>

      <Parallax.Layer offset={1} speed={1} style={{ backgroundColor: '#000000' }} />
      <Parallax.Layer offset={2} speed={1} style={{ backgroundColor: '#000000' }} />

      <Parallax.Layer offset={0} speed={0} factor={this.state.pages} style={{backgroundImage: 'url(https://awv3node-homepage.surge.sh/build/assets/stars.svg)', backgroundSize: 'cover' }} />
        <Parallax.Layer
          offset={0}
          speed={0.3}
          onClick={() => {console.log(mouseClickOnTarget); if(mouseClickOnTarget) {resetMouseClickFlag()} else {this.parallax.scrollTo(1)}}}
          style={{ }}>
          <div>
            <LogoDesign/>
            {isMobile() ? DragBallParallaxMobile() : DragBallParallax()}
          </div>
        </Parallax.Layer>

        <Parallax.Layer
          offset={1}
          speed={0.3}
          onClick={() => {console.log(mouseClickOnTarget); if(mouseClickOnTarget) {resetMouseClickFlag()} else {this.parallax.scrollTo(2)}}}
          style={{ display: 'flex' }}>
          <div>
          <DragBall page='1' count='70'/>
          {this.showSearchedBalls()}
          {(() =>{
            if(this.state.numberOfBalls > 0){
              this.parallax.scrollTo(1)
              }
            })()
          }
          </div>
        </Parallax.Layer>

       //onClick={() => {this.parallax.scrollTo(2.3)}}
       <Parallax.Layer
          offset={2}
          speed={0.3}

          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <Form getSearchedBalls = {this.getSearchedBalls.bind(this)}/>
          </div>
        </Parallax.Layer>
      </Parallax>
    )
  }
}
