import React from 'react';
import {Motion, spring} from 'react-motion';
import range from 'lodash.range';
import { Popup, Header, Icon, Divider } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const springSetting1 = {stiffness: 180, damping: 10};
const springSetting2 = {stiffness: 120, damping: 17};
function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const allColors = [
  '#EF767A', '#456990', '#49BEAA', '#49DCB1', '#EEB868', '#EF767A', '#456990',
  '#49BEAA', '#49DCB1', '#EEB868', '#EF767A',
];

const allHearts = [
  2920, 52021, 5420, 5920, 131400, 21314, 13142, 91314, 51314, 52099, 94120,
  52013, 52014, 1314, 9999, 999, 9412, 59412,
];

export let mouseClickOnTarget = false;

export function resetMouseClickFlag() {
   mouseClickOnTarget = false;
}

const styledPopUp = (from, to, content, key) =>(
  <div>
    <div style={{ padding: 10, borderStyle: 'dashed', borderWidth: 1}}>
      <Header.Subheader style={{fontSize: 14, fontStyle: 'bold', fontFamily: 'SimHei, "Microsoft Yahei", STXihei'}} >
        {from}
        <Icon.Group>
        <Icon name='gratipay' size= 'small' color='red'/>
        </Icon.Group>
       {to}
     </Header.Subheader>
     <Header.Subheader style={{fontSize: 12, fontStyle: 'bold',fontFamily: 'SimHei, "Microsoft Yahei", STXihei'}} >
      {allHearts[key%18] + '  '}
      <Icon.Group>
        <Icon name='heart' color='red' size='small' />
      </Icon.Group>
    </Header.Subheader>
    <Header.Subheader style={{fontSize: 12, fontStyle: 'bold', fontFamily: 'SimHei, "Microsoft Yahei", STXihei'}}>
        {5100000 + key*key*key + '  '}
      <Icon.Group>
        <Icon name='cube' color='yellow' size='small' />
      </Icon.Group>
    </Header.Subheader>
  </div>
    <p></p>
  <p style={{fontSize: 10, fontStyle: '', fontFamily: 'SimHei, "Microsoft Yahei", STXihei'}}> {content} </p>
  </div>
)

export default class DragBall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseXY: [0, 0],
      mouseCircleDelta: [0, 0], // difference between mouse and circle pos for x + y coords, for dragging
      lastPress: null, // key of the last pressed component
      isPressed: false,
      order: range(this.props.count), // index: visual position. value: component key/id
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      layout: null
    };

    //this.getPopupHeader = this.getPopupHeader.bind(this);
    //this.getPopupContent = this.getPopupContent.bind(this);
    // indexed by visual position
    this.state.layout = range(this.props.count).map(n => {
        return [Math.random() * this.state.width, Math.random() * this.state.height];
    });

    if (this.props.page == 2) {
      this.props.contentOfBalls.map((item) =>{
         Lovers.push({
           'from': item.from,
           'to': item.to,
           'content': item.loveManifesto
         });
       })
     }
  };

  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('resize', this.handleWindowResize);

    if(this.props.page == 0){
      this.loopTimer = setInterval(
        () =>{
          let index = Math.floor(Math.random()*this.props.count);
          let elementId = 'dragball-' +  index;
          mouseClickOnTarget = true;
          document.getElementById(elementId).click();
        },
        4000
      );
    }else if (this.props.page == 2) {
      let index = 0;
      this.loopTimerByEmail = setInterval(
        () =>{
          let innerIndex = 140 + (index++ % this.props.count)
          let elementId = 'dragball-' +  innerIndex;
          mouseClickOnTarget = true;
          document.getElementById(elementId).click();
        },
        1000
      );
    }
  };

  componentWillUnmount(){
    if(this.loopTimer){
      clearInterval(this.loopTimer);
    }
    if(this.loopTimerByEmail){
      clearInterval(this.loopTimerByEmail);
    }
  }

  handleTouchStart = (key, pressLocation, e) => {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  };

  handleTouchMove = (e) => {
    //e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  };

  handleMouseMove = ({pageX, pageY}) => {
    const {order, lastPress, isPressed, mouseCircleDelta: [dx, dy]} = this.state;
    if (isPressed) {
      const mouseXY = [pageX - dx, pageY - dy];
      const col = clamp(Math.floor(mouseXY[0] / this.state.width), 0, 2);
      const row = clamp(Math.floor(mouseXY[1] / this.state.height), 0, Math.floor(this.props.count / 3));
      const index = row * 3 + col;
      const newOrder = reinsert(order, order.indexOf(lastPress), index);
      this.setState({mouseXY, order: newOrder});
    }
  };

  handleMouseDown = (key, [pressX, pressY], {pageX, pageY}) => {
    mouseClickOnTarget = true;

    // cease the loopTimer once mouse clicked
    if(this.loopTimer){
      clearInterval(this.loopTimer)
    }

    if(this.loopTimerByEmail){
      clearInterval(this.loopTimerByEmail)
    }

    this.setState({
      lastPress: key,
      isPressed: true,
      mouseCircleDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY],
    });
  };

  handleMouseOver = (key, [pressX, pressY], {pageX, pageY}) => {

    // cease the loopTimer once mouse over a dot
    if(this.loopTimer){
      clearInterval(this.loopTimer)
    }

    if(this.loopTimerByEmail){
      clearInterval(this.loopTimerByEmail)
    }
  };

  handleMouseUp = () => {
    // cease the loopTimer once mouse clicked
    if(this.loopTimer){
      clearInterval(this.loopTimer)
    }

    if(this.loopTimerByEmail){
      clearInterval(this.loopTimerByEmail)
    }

    this.setState({isPressed: false, mouseCircleDelta: [0, 0]});
  };

  handleWindowResize = (e) => {
    //e.preventDefault();

    let newWidth = window.innerWidth || document.documentElement.clientWidth;
    let newHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let newLayout = range(this.props.count).map(n => {
      return [Math.random() * newWidth, Math.random() * newHeight];
    });

    this.setState({
      width: newWidth,
      height: newHeight,
      layout: newLayout
    });
  };

  getPopupHeader = (key) => {
     console.log(key);
  };

  getPopupContent = (key) => {

  };

  render() {
    let that = this;
    const {order, lastPress, isPressed, mouseXY} = this.state;
    return (
      <div>
        {order.map((_, key) => {
          let style;
          let x;
          let y;
          const visualPosition = order.indexOf(key);
          if (key === lastPress && isPressed) {
            [x, y] = mouseXY;
            style = {
              translateX: x,
              translateY: y,
              scale: spring(1.2, springSetting1),
              boxShadow: spring((x - (3 * this.state.width - 50) / 2) / 15, springSetting1),
            };
          } else {
            [x, y] = this.state.layout[visualPosition];
            style = {
              translateX: spring(x, springSetting2),
              translateY: spring(y, springSetting2),
              scale: spring(1, springSetting1),
              boxShadow: spring((x - (3 * this.state.width - 50) / 2) / 15, springSetting1),
            };
          }

          return (
            <Motion key={key} style={style}>
              {({translateX, translateY, scale, boxShadow}) =>
              <Popup
                inverted='true'
                hideOnScroll='true'
                trigger={
                  <div id={"dragball-" + (that.props.page * 70 + key)}
                    onMouseDown={this.handleMouseDown.bind(null, key, [x, y])}
                    onTouchStart={this.handleTouchStart.bind(null, key, [x, y])}
                    onMouseOver={this.handleMouseOver.bind(null, key, [x, y])}
                    className={"demo2-ball-" + key%21}
                    style={{
                      backgroundColor: allColors[key%11],
                      WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                      transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                      zIndex: key === lastPress ? 99 : visualPosition,
                      boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                    }}
                  />}
              >
              {styledPopUp(Lovers[key+(that.props.page * 70)].from, Lovers[key+(that.props.page * 70)].to, Lovers[key+(that.props.page * 70)].content, key)}
              </Popup>
              }
            </Motion>
          );
        })}
      </div>
    );
  };
}

let Lovers = [{"from": "小正太", "to": "小仙女", "content": "我要的只是，一声叮嘱、一声关爱，一句问候。吃饭了么？饿了么？累了么？其实，对我都是珍贵的、暖暖的。一句我们在一起，什么困难我都能抗下去。我不要温柔的甜言蜜语，不要海枯石烂的誓言。我只要你。" },
                {"from": "张天乐", "to": "李洁 ", "content": "爱你，在一缕风里，漾出思念的泪落在雨里。爱你，在一抹秋阳中，写下的眷恋放在秋水里。爱你，躲开了寂寞，却没有绕开幽怨。爱你，一半温水，一半凉水，幸福和伤害无法割舍。于是我在我的城里焚满香火，你可听见，轻轻的经声，念的全是你。" },
                {"from": "小伟", "to": "娜娜", "content": "谢谢你陪了我这么久，虽然因为一些原因我们不能继续在一起了，我依然爱你，祝福你，亲爱的娜娜！"},
                {"from": "陈勇", "to": "叶佳慧", "content": "如果有来世的话，我依然希望能够与你相遇相爱，在这个繁华的年代中，牵着你的手度过我们浪漫而平淡的一生。当岁月不在，我们还能依偎在彼此身旁。"},
                {"from": "朱杰顺", "to": "王敏", "content": "用你来衡量时间，有你的都是白天，失去你就来临黑夜;用你来区分地点，有你的就是天堂，没有你就坠身地狱。亲爱的，愿我们相守永远，真情不变。"},
                {"from": "依然", "to": "沫沫", "content": "人生中，总有令人执着的东西，或者是一个梦，或者是一段情，或者是一个悄然触动了自己灵魂的人。人生有你，何其美丽，无论再有多少优秀的心灵从我的面前走过，我的眼中，我的心底将只留下一个唯一的你。"},
                {"from": "郭家佳", "to": "万娟", "content": "你听好了，我不想和你猫捉老鼠，绕来绕去了，咱们俩那些哑谜也别打了，我喜欢你，非常非常喜欢你，如果你喜欢我，你就跟我在一起，如果你不喜欢我那我就追你，反正女追男隔层纱，咱们俩肯定会在一起的。"},
                {"from": "刘俊", "to": "陶子", "content": " 我知道我不完美，但我的爱最纯粹，我不怕苦不怕累，一生爱你是我最灿烂的陶醉，努力营造生活的明媚，爱你我真的无悔。"},
                {"from": "刘有", "to": "徐璐", "content": "他说他结婚了，说是因为家里人的催促，她说她结婚了，因为说他有房有车，她说她结婚了，说年纪大了，他说他结婚了，因为家人介绍的，如果有一天，我们结婚了，我只希望，那是因为爱情。因为，我们还相信爱情。"},
                {"from": "孟子潇", "to": "何瑶", "content": "世界很粗糙，岁月也不温柔，我们曾是两个淋透了雨的人，都没有伞，慌慌张张躲进了同一个屋檐。碰巧发现彼此有同样的目的地，于是有勇气并肩一起，散步淋雨。那一路多开心，因为舍不得再见，所以宁愿人间的风雨别停，天别晴。"},
                {"from": "张天一", "to": "李萧然", "content": "一日不见如隔三秋，是因为思念；长夜漫漫无心睡眠，是因为想念；日不思食夜不能寐，是因为惦念；辗转反侧孤枕难眠，只想与你相见。"},
                {"from": "陈梦琪", "to": "杨子桐", "content": "三十年后，如果世界上还有坚持这个词，我希望它属于我;三十年后，如果世界上还有感动这个词，我希望它属于你。"},
                {"from": "抖音控", "to": "瑶瑶瑶瑶", "content": "你爱不爱我我不管，反正我爱你，我今天爱你，明天爱你，永远都爱你！"},
                {"from": "小倩倩", "to": "许磊", "content": "我不喜欢异地恋，但是我喜欢你，所以即使一个在青岛，一个在太原，相距853公里，千里姻缘一线牵，我们结婚吧！爱的你倩倩"},
                {"from": "萌萌小奶狗", "to": "酷酷小仙女", "content": "你的肚子一天比一天大，可在我心中你的容颜却一天比一天美丽。不能天天陪你，感谢你的理解，老婆你辛苦了。爱你的康剑。"},
                {"from": "杜予吉", "to": "柳瑶", "content": "确认过眼神，我遇见对的人。所以我不愿让你一个人，一个人在人海浮沉。我不愿你独自走过，风雨的时分。我想要带你去浪漫的土耳其，然后一起去东京和巴黎。"},
                {"from": "c j", "to": "f f", "content": " I love you not because of who you are, but because of who I am when I am with you."},
                {"from": "曹子豪", "to": "曹太太", "content": " 春天散步夏天看海秋天数落叶，一直没有烦恼，一直没有争吵，让每天像糖一样甜，冬天飘雪我是棉被温暖你的夜，一直在你身边，一直爱到永远，你就负责靠着我的肩"},
                {"from": "陈杰", "to": "封菲", "content": "有时和你开玩笑，宁愿先离开人世的是我，那么我就放心把一切交给你打理，我的身后事，我们的孩子，我们的父母。其实我是想最后一眼里满满的还是你；其实我是不敢想，你先我离去后独自一人的生活；其实我是要在另一个世界依旧给你准备好一切，让你不会不习惯。"},
                {"from": "金牛男", "to": "天蝎女", "content": "可爱的你偷走我的情.盗走我的心，我决定告你上法庭，该判你什么罪呢？法官翻遍所有的犯罪记录和案例，最后陪审团一致通过：判你终生归我。"},
                {"from": "张扬", "to": "王双双", "content": "我对神许愿：愿你永远快乐。神说不行，只能四天，我说春天夏天秋天冬天；神愣了：两天。我笑：黑天白天；神惊：一天！我笑：生命中的每一天！"},
                {"from": "席梦莹", "to": "张毅", "content": "开一付爱情灵药：真心一片，温柔二钱，尊重三分，体贴四味，谅解五两。以健康为药引，以似水柔情送服之，剂量不限，多多益善。长期服用可白头偕老。"},
                {"from": "阿男", "to": "可可", "content": "感谢你成为我生命中的挚爱，成为我的唯一，分享我所有的梦想、渴望、蓝图、冒险，以及更多的一切，感谢你成为我今后生命中的伴侣，只要跟你一起活着，我就觉得自己是世界上最快乐的人，永远!永远!"},
                {"from": "吴昊", "to": "陈娟", "content": "在我们交往的十年中感谢你的陪伴，对你的爱持续在增加中，感谢上帝让我遇见你，今天我要正式把你娶回家!我十年来都作着同一个梦，就是希望把你娶回家。我会爱你到天堂，一辈子爱你。"},
                {"from": "费宇哲", "to": "龙语菲", "content": "我们终于走到这一步，中间经过弯弯曲曲的路，最后都可以顺利到达，将来这条路或者有沙石、荆棘，但不用怕，怎样都有我在这陪着你，我爱以前（那个）你认为有好多缺点的你，我爱现在体贴的你，以后的你我都很爱"},
                {"from": "秦天", "to": "雨儿", "content": "我用一生一世的心等待一生一世的情，也许是宿命，也许是注定我真的希望多点好运，我用一生一世的心换你一生一世的情，牵你的手……"},
                {"from": "菜心", "to": "张哲", "content": "有一天，你问我，成家需要多少钱，100万够吗？那时我就祈祷，天呵，保佑这个男人快点赚到100万吧！"},
                {"from": "小莫", "to": "落落", "content": "喜欢被你看着，感受你的温柔，就算是短短的一秒钟，也能够永久；喜欢被你抱着，像一种承诺，不管世界如何，也不为所动，我知道，只有你"},
                {"from": "Morier", "to": "Jae", "content": "我想和你从放荡不羁的青春，伴你到安安稳稳做我的枕边人。我瞧那些侠士一个个拂袖打马走天涯，于是我披好了衣买好了马，却转身瞧见了你，完了，我心里哪还有什么天涯。"},
                {"from": "奔四大叔", "to": "青青青青草", "content": "夜静谧，想你的心在夜空迷离；风呼吸，惦念间心有灵犀；思绪掠过发迹，传递着想你的讯息；晨露清亮如许，那是我的心跌落在草地。来吧，我会好好待你！"},
                {"from": "阿杰", "to": "小萱", "content": "娇艳的玫瑰总会凋零，年轻的面容也会苍老。然而，我的心就是不变，任年华飞逝，即使是破了、碎了，它片片都是忠诚。"},
                {"from": "子楠", "to": "小猪猪", "content": "我感谢缘分，造就了这一场相遇。别人只看得见莲开的美艳，而你却看见美艳背后的莲的心事，拨动了我尘封已久的心扉，所以我也感谢你，给了我你的世界，宁舍天下以得美人心。然我不要这世间的繁华，你就是我的天下。此生有你，世间再无他。"},
                {"from": "Honey", "to": "Darlin", "content": "总想有一天，能与你不见不散，牵着你的手一起去海边，迎日出，赏夕阳，听潮涨潮落，看云舒云卷。依偎在你的身边，让朵朵浪花，都绽放成幸福的笑靥，这就是我想要的爱情，简简单单，但此生不变。"},
                {"from": "东京男", "to": "纽约女", "content": "你我约定：就算忙碌，就算焦虑，也要在空闲之余说一声我想你；就算疲惫，就算郁闷，也要在临睡的时候道一声晚安；就算生气，就算吵架，也要在第二天阳光依稀的早晨眯眼微笑；就算无趣，就算平淡，也要在黄昏的街道上坚定地握着彼此的手。我们约定，一辈子就已足够！"},
                {"from": "日出日落", "to": "花谢花开", "content": "从我们相识相知，到我的一颗心暗许于你，每一天都是最美的诗篇。想陪你看日出日落，想陪你等花开花谢，一生一世一辈子，你可愿意？"},
                {"from": "胡劲勇", "to": "杨洋", "content": "新衣会慢慢变旧，人会慢慢变老。时光流逝，斗转星移，但我对你的爱将历久弥新。我们的誓言也永不更改。"},
                {"from": "任馨", "to": "子君", "content": "那一刻，与你执手相握，凝眸对视的瞬间；那一夜，与你月下漫步，相依相伴的浪漫；那一天，与你湖上泛舟，山清水秀的欢乐；这一次，向你倾情诉说，刻骨铭心的爱恋。1314，爱你一生一世，大胆说爱你，今生愿与你执手白头！"},
                {"from": "天", "to": "萱", "content": "炊烟起了，我在门口等你。夕阳下了，我在山边等你。叶子黄了，我在树下等你。我们老了，我在来生等你。能厮守到老的，不只是爱情，还有责任和习惯。"},
                {"from": "景昊", "to": "谭心诗", "content": "一周，我有7天在想你，有168小时在念你，有10080分钟在祝福你，有604800秒在爱着你。不是因为到周末才爱你，而是爱你才盼望周末。"},
                {"from": "知之爸爸", "to": "知之妈妈", "content": "第一次见面在ktv唱歌，第一次吃饭在沙县小吃，第一次出去玩是在南师大随园校区，你的生日，初见的日子，确定交往的日子，领证的日子，结婚的日子，往事历历在目，每一个日子都很重要。"},
                {"from": "帅帅", "to": "落鱼", "content": "你愿意陪我演一部电视剧吗？男主角是我，女主角是你，剧情是两个人从相识，相知，相恋，相爱的生活故事，结局是白头偕老，儿孙满堂！集数是一辈子，现在你我早已相恋，剧情已经开始了……"},
                {"from": "小陈陈", "to": "大霏霏", "content": "谢谢你在我没房没车的时候还愿意陪在我身边，谢谢你在父母对我们感情说不的时候没有放弃，谢谢你在我做的不好，不成熟的时候包容我，依旧对我好。如今我们的生活很好，我也为你变得更好，谢谢你为我们做的一切。"},
                {"from": "Yonas", "to": "Jessica", "content": "如果世界只剩十分钟，我会和你一同回忆走过的风雨，如果只剩三分钟，我会吻你，如果只剩一分钟，我会说次我爱你，如果只剩五秒，我会紧紧把你搂在怀里。"},
                {"from": "Irvin", "to": "Nicole", "content": "有一种默契叫做心照不宣；有一种感觉叫做妙不可言；有一种幸福叫做有你相伴；有一种思念叫做望眼欲穿。愿天上的每一个流星，都为你而闪耀天际……"},
                {"from": "一只程序猿", "to": "小公主", "content": "月光如水， 云绕水间，西窗画出横斜枝，那枝头花瓣纷纷，漫天的花瓣飞舞，在一瞬间飘零，像流泻了一地的雨水，缤纷，绝美，花香四溢。生活有你而精美！"},
                {"from": "胡小闹", "to": "张小宝", "content": "美好的是你突如其来给我一个拥抱，是人潮拥挤你自然而然牵紧我的手，是你给我起的特别小名，是你早晨的早安和夜里的晚安，是你记得我的生日给我惊喜，是你在我身边的安心和随意，是你听到我没照顾好自己时气急败坏的表情，是你对我无话不说的信任，是你心里有我常常想念我，是你爱我，包括我的臭脾气。"},
                {"from": "张宏才", "to": "刘丽", "content": "好希望每天不止二十四小时，每小时不止六十分钟，每分钟不止六十秒，那我便会爱你不止每一天了，示爱日到了，请记住今生有我，想加倍地爱你!"},
                {"from": "月光下的彩虹", "to": "离开依然爱", "content": "第一次听到你对我说我爱你，我的世界一瞬间鲜花绽放，我将永远铭记那一幸福时刻。"},
                {"from": "王劲", "to": "柳青", "content": "十年，我们从情窦初开的青涩走到情投意合的甜蜜，从排名表上的第一第二名走到结婚证上的夫妻。不得不感叹命运和缘分的奇妙，也许这十年里任何一天任何一个人一件事的细微改变，都会让这个故事换一个结局。"},
                {"from": "黄波", "to": "龚慧慧", "content": "婚姻不是恋爱的终结，而是一段崭新的幸福的开始。在以后朝夕相处的日子里，我们难免遇到柴米油盐的纷纷扰扰，锅碗瓢盆的磕磕碰碰，我们还需要更多的磨合去成就一个美满幸福的家庭，但不管怎么样，请相信我们的爱会一直生长蔓延。"},
                {"from": "卡布奇诺", "to": "摩卡", "content": "回头看看，最庆幸的是我们在彼此都是白纸的时候遇见并相爱，尽管因为我们的笨拙幼稚鲁莽做过许多让对方伤心的事，我们都不能算是一个完美的恋人，然而我们骄傲的是我们在恋爱中的点点滴滴里一起成长成熟，渐渐学会体贴宽容为对方着想，这份共同经历的价值不是一个完美成熟却陌生的恋人比得上的。"},
                {"from": "有你即有家", "to": "小菜菜", "content": "十年前你不属于我，我不拥有你，十年后，我们是同学，我们是朋友，我们更是爱人。十年前我们交集很少，还有多少错过。十年后，我们一起打拼，一起生活，一起是一辈子。"},
                {"from": "Eric", "to": "Yvette", "content": "徐志摩说：“一生至少该有一次，为了某个人而忘了自己，不求有结果，不求同行，不求曾经拥有，甚至不求你爱我，只求在我最美的年华里，遇到你。”我们亦如此，今生遇见你，我觉得是我的幸福，尽管这幸福里交杂着万千痛苦。"},
                {"from": "爱丽丝", "to": "贝壳王子", "content": "最适合的彼此，不是一开始的一拍即合，而是愿意在未来漫长岁月中为彼此变成更好的两个人，爱情不存在天造地设的一对，只有彼此努力，成为适合我们的对方。"},
                {"from": "蔡佳全", "to": "林薇", "content": "春风十里，不如你。林徽因说：你是一树一树的花开，是燕在梁间的呢喃。你是爱，是暖，是希望，是人间的四月天。你亦是我的人间四月天。枕着你的香息，念着你的名字，入眠。梦境里，樱花浪漫……"},
                {"from": "黎科", "to": "孙琴", "content": "“当我老了，眉眼低垂，鬓染风霜，唯你心中深藏着我的青春，仍那般葱茏，当我老了，背影弯曲，步履蹒跚，唯你眼里洋溢着爱恋仍那般澄澈。”岁月那条河我们一起蹚过，人生的聚散我们一起经过，当我们老了，你是我的眼，我是你的拐杖，我一生最温暖的事，就是途中与你相遇，然后相濡以沫，共闻花香，只愿这一生，饭是和你一起做的，水是你端的，我爱你，是你说的，如此到老，多好！"},
                {"from": "王晓东", "to": "王熙雯", "content": "花开，你在花里。蝶来，你在蝶间。你是我岁岁年年，月月日日永不褪色的花。我是你时时刻刻，分分秒秒不肯老去的蝶。花为蝶绽放，蝶为花沉醉。总感觉花是蝶的前世，蝶是花的旧人，不然为什么就一见如故呢。"},
                {"from": "欣妍", "to": "堪东", "content": "我喜欢安静，喜欢幽居，你也喜欢远离尘俗，远离喧嚣，在僻静处，安放我们的灵魂。推窗一溪云，开门满山花，时光正好。就这样枕着水声入眠，什么也不说，你我都会心领神会。你给我一个世上最寂静的地址，说那是灵魂的故乡。我沿着小径一路追寻，却发现一路通向的是你的心 ，清风十里，莲荷满池，月光落下，满园清香。"},
                {"from": "林馨", "to": "尚夏", "content": "8年时间如白驹过隙，从同学到同事到恋人，从一个街道到一座城再到两地分隔，从一见倾心到形影不离再到默契无间。一路走来，很不容易，也五味杂陈，现在我不想再跟你分开了，我们结婚吧！"},
                {"from": "爱漫画的小女孩", "to": "靠谱大叔", "content": "一个偶然的机会，我们在微信上认识。一切是那么不靠谱，但是却奇迹般的开始了我们的故事。两年多的时间，你陪我度过了最难熬的时间，陪我在医院照顾母亲，参加我的毕业典礼。真的很谢谢这份感情这段缘分。无论最后结果如何，我希望你很幸福。"},
                {"from": "冯清雅", "to": "江平", "content": "三个月的时间交往，五个月的时间同居，十一个月的时间领证。我们的一切好像都很快，也不能说一切都那么顺利吧，可能是我们决心选择了彼此吧。快两年了现在，是不是应该生个宝宝了？"},
                {"from": "梁静", "to": "潘翔", "content": "死生契阔，与子成说。执子之手，与子偕老。"},
                {"from": "云清", "to": "斯哥哥", "content": "多么希望有一天，能与你手牵手，走过那条古朴的小巷，天空是大朵的白云，空气中飘着淡淡的野花香，那里，没有红尘喧嚣，没有世事纷扰，只有两个人，两颗心，还有共经岁月风霜洗礼后，所镌刻在心中最深的情意。"},
                {"from": "古妍凌", "to": "刘凯华", "content": "期初很多人不看好我们，因为我作为一个女人比你大三岁。但是你说没关系，女大三抱金砖。你的爸妈对我们的关系直摇头，但是你说没关系，你会做他们的工作，也会陪我一起改变他们对我的看法。你身边的朋友都觉得你可以找到更好的，但是你说没关系，在你眼里最好的已经出现了。如今岁月安好，我们也好。"},
                {"from": "刘开宇", "to": "戴泽芳", "content": "从相识到相知再到相爱，我们经历了一年时间的考验。也许你认为我不够主动，看不到我追你的行动，内敛的性格造就我学不会主动，差点错过与你的缘份，但你不能否认我爱你的心，从来不敢想象自己会这么去爱一个人。我爱你柔情的言语，是你支撑起我希望的一片天，我爱你飘逸柔顺的头发，是你拂起我奋斗的羽翼。带我走出了那片孤独和痛楚的森林，我要说声：谢谢你！老婆！"},
                {"from": "高伊娜", "to": "陆晓丹", "content": "因为你，我每天很晚入睡只为等你，和你说说话；因为你，我会时不时拿手机看有没有你的未接来电有没有你的短信；因为你，我会莫名的生气莫名的无理取闹；因为你，我变得很纠结变得不知如何是好。你的一句话可以改变我一天的心情，你的一条短信可以左右我一天的情绪一切都只是因为你。"},
                {"from": "陈红", "to": "高宇文", "content": "很庆幸当年我答应了你的追求，让我现在拥有这么可爱的一双儿女，拥有一个为了家这么拼搏的老公，拥有一段令人羡慕的爱情。有你们，此生足矣。"},
                {"from": "费启佳", "to": "舒嫣", "content": "在一起566天了，我真的是受够了这样的日子。晚安要对着话筒说，隔着屏幕看。我希望每天一睁眼看到的就是你，每天的那句晚安可以在你耳边说。所以，亲爱的，嫁给我好么？"},
                {"from": "陈志元", "to": "宁静", "content": "谢谢你一直陪在我的身边！让我忘记了烦恼，留住了感动！谢谢你和我一起守护，守护每天的日出日落！让我不再孤单，留住了精彩！谢谢你每天为我所做的，让我不再需要顾这顾那！可以一心的做事业！值此，我愿与你分享每天的欢乐与进步！我愿守候在你的身边！直到永远！"},
                {"from": "常俊", "to": "刘清玲", "content": "老婆，娶到你是我这一生最大的幸福，从今天开始，从我成为你的丈夫这一刻开始，我有了一个人生中最重要的努力目标——那就是在我们手牵手度过一生，到老了走不动坐在摇椅上的时候，我希望你能发自内心的和我说：这辈子跟了我，你从来没有后悔过。"},
                {"from": "鲍岩", "to": "江可馨", "content": "媳妇，你我携手这一路，难免发生磕磕绊绊，但是在你吃饭或者睡前，我绝不会任由战争僵持！我知道，你的心总是很重。吵架后，多少会减少你的食欲，影响你的睡眠。在我心里，没什么比你的健康更重要。"},
                {"from": "Arno", "to": "Vivian", "content": "你我携手这一路，难免有时心生倦怠;如果我对你疏忽了，冷落了，记得告诉我.不要胡思乱想，偷偷掉泪.相信我，真的不是故意. 只要你说，我定会反省.对你的爱，永是常新。"},
                {"from": "刘亚楠", "to": "罗巍巍", "content": "我想要的未来，有房子住，不用多大，最好窗外有阳光;早晚有酸奶，一天能吃上苹果，有锅给我煮汤，偶尔能逛逛公园，一年能陪爸妈几次;有工作，有本，有单反，有书看，有歌听;朋友偶尔奔过来聚一起，偶尔能到处走走，这些都有你陪着我，就很幸福了。"},
                {"from": "李德伟", "to": "周春眉", "content": "老婆，你真的辛苦了。备孕时开始调理身体，吃中药，怀上了以后这个不能吃，那个不敢吃，孕吐，工作受气，大大小小一堆检查，最后还要挺着大肚子，手脚浮肿，生孩子的时候还要忍受我无法想象的疼痛。和你做的这些比，我这个父亲来的真是很轻松。谢谢你为这个家做的一切，辛苦了。"},
                {"from": "潘月虹", "to": "蒋龙", "content": "好想有那么一天，我们白发很多的时候，仍能被你牢牢的牵着手。好想有那么一天，你给我戴上我不记得放在哪里的老花镜。好想有那么一天，我睡在沙发上时你能轻嘘叫儿孙小声点。好想有那么一天，即使我得了老年痴呆，也还认得你。"},
                {"from": "美琳", "to": "月哥", "content": "没有房子车子，我们可以一起努力挣钱去买，爸妈生病，我们可以一起照顾分担家里的压力，羡慕别人家有宝宝，我们也可以孕育我们俩的爱情结晶。我们不比别人过的差，只有彼此珍惜，相亲相爱。一切都会好起来。"},
                {"from": "雷振涛", "to": "宁馨", "content": "最难忘的是你的微笑，当它绽开在你的脸上时，我仿佛感到拂过一阵春风，暖融融的，把我的心都溶化了。"},
                {"from": "林涛", "to": "冰如雪", "content": "当我看见你被冻得嘴唇发紫，整个人都缩着，我的心里好难受，但是我也很欣慰，因为有个远方的你时刻牵挂着我。"},
                {"from": "吕凌", "to": "蓉蓉", "content": "我承认我不是一个体贴的男人，不会送你玫瑰或说一些甜言蜜语制造浪漫，但有一件事我敢肯定而且会做的很好：我爱你，我永远不会离开你。"},
                {"from": "追爱小野菜", "to": "落跑跑不掉", "content": "都说女追男隔层纱，可是为了和你在一起真的非常不容易。所幸的是等到了你，还好我没放弃，你也没有让我输，给了我现在这样幸福的生活。"},
                {"from": "穆夏", "to": "刘语嘉", "content": "我能想到最浪漫的事就是和你一起慢慢变老，不仅仅是歌词，更是我的心声。"},
                {"from": "欧阳平", "to": "王珏", "content": "以前的我就像一匹野马，谁都没法驯服，由着自己性子。但是不得不承认，一物降一物。遇到你以后，变得有耐心，慢慢成了一个越来越成熟的人。如今有了孩子，性子也被磨平啦。挺好的，做一个温柔的人。"},
                {"from": "彭建军", "to": "雯雯", "content": "认识你以后，我从一个从不拍照的人变成了个爱自拍更爱给你拍照的人，从一个做事毛毛躁躁，没有耐心的人变成一个慢条斯理，不紊不乱的人，从一个男孩蜕变成一个男人。谢谢你的出现，亲爱的老婆。"},
                {"from": "江一岚", "to": "小祁祁", "content": "在我眼里，你比超人长得更帅气更man，比蜘蛛侠更勇敢更正义，比钢铁侠更酷更有型。反正，我就觉得你最好，是个跟我老爸一样优秀的男人。"},
                {"from": "为爱奋斗", "to": "等待幸福", "content": "虽然现在挤在50平的小房子里，虽然现在上班还要花一个多小时挤地铁，虽然房贷的压力让人心累，但是看到你和孩子的脸，我就觉得充满了电。"},
                {"from": "云舒", "to": "笨蛋", "content": "如果我们之间的距离是100步，我已经走了99步，就等你走最后一步。不管多久我都等，因为我爱你。"},
                {"from": "兵哥哥", "to": "可儿", "content": "产房外的我，害怕，无助，焦虑，憧憬。感觉时间被放慢，每一次呼吸都被拉长，每一秒滴答都被延迟。谢谢你在产房里头为我们的宝宝那么辛苦的努力着。"},
                {"from": "绿茶", "to": "咖啡", "content": "路过你爱吃的店，我就会买一点，看过好看的景，我就会收藏起来，听说过好用的化妆品，我就会做做功课。生活的重心在无意识的向你倾斜，仿佛你开心，世界就放晴了。"},
                {"from": "Ivan", "to": "Aibeka", "content": "我在忧愁时想你，就像在冬季想太阳;我在快乐时想你，就像在骄阳下想树荫。"},
                {"from": "张群", "to": "牟婕妤", "content": "约定了去完一百个地方，咱们就结婚。今天去的是第九十六个，很快我就可以娶你了。"},
                {"from": "章文凤", "to": "许文浩", "content": "无论什么时候，什么地点，只要我需要，都是你，一直都是你。如今，让我主动一次说爱你。"},
                {"from": "邵永", "to": "毛茹婷", "content": "你喜欢摩天轮，我陪你去坐，你喜欢棉花糖，我陪你去吃，你喜欢两个人在一起，咱们领证结婚吧。"},
                {"from": "谷雨", "to": "陈玲玲", "content": "热恋期的我，对你的感觉只有一个词，一日不见，如隔三秋。"},
                {"from": "宁东东", "to": "曹璐", "content": "原来我远比自己想象的更爱你。"},
                {"from": "郑兴", "to": "江燕", "content": "愿孩子健康成长，愿余生都有你。"},
                {"from": "沙蒙", "to": "胡菲菲", "content": "谢谢你陪我一起从200斤瘦到现在的标准体重，我们是外界不看好的肥胖情侣，也是现在的充满正能量的健身cp。"},
                {"from": "白寒", "to": "程祥伟 ", "content": "看不到你的脸，听不见你的声音，就觉得浑身不自在。"},
                {"from": "卞萍", "to": "丁扬", "content": "不离不弃，简单的四个字有多少人能做到。但是，你依旧在我身边照顾着我，从未放弃过我。有你真好。"},
                {"from": "袁宏", "to": "林明红", "content": "愿你在嫁给我以后的每一天里都更加快乐。"},
                {"from": "高廷", "to": "何静", "content": "这双手牵了你，就再也牵不动其他人，这颗心装下你，就再也容不得其他人。"},
                {"from": "李飞", "to": "蔡荣", "content": "海誓山盟在我看来不如柴米油盐来的实在，来的踏实。所以，我很喜欢和你在一起。"},
                {"from": "王芳", "to": "贾勇", "content": "老公，为了这个家，你真的辛苦了。"},
                {"from": "志明", "to": "春娇", "content": "产房外的我香烟一根一根，产房里的你尖叫声一声一声。我的心里也是疼的要命，心疼你，你是个一个疼都受不了，又爱哭的小孩。现在为了我们的孩子真的是受罪了，老婆。辛苦了！"},
                {"from": "佳一", "to": "子乔", "content": "谢谢你教会了我很多，也帮助了我很多，让我成为现在这样一个我自己都很满意的女人。老公你真的很棒。"},
                {"from": "赵欢", "to": "李庆瑶", "content": "学生时代就喜欢你，现在我们的孩子都上学了，我发现我还是像以前那般崇拜你。"},
                {"from": "小迷糊", "to": "赵子明", "content": "我最怕的就是睡醒了发现你不在身边，喊你的名字却没有人回应。"},
                {"from": "王大伟", "to": "刘娇", "content": "皱纹慢慢地爬上你的眼角，头上还时不时看见几根白发，为了这个家辛苦了，老婆。"},
                {"from": "花花", "to": "小鱼", "content": "你的名字是我最喜欢的两个字，看见，听到，我都会心情愉悦。张海欣"},
                {"from": "张海欣", "to": "李琼", "content": "没了韩剧我的生活会很无聊，但是没了你，我连韩剧都不想看了。"},
                {"from": "卖萌小孕妇", "to": "亲爱的老公 ", "content": "老公，不求你赚多少钱，升官发财，只希望你照顾好自己的身体，陪伴着我和孩子。"},
                {"from": "张大大", "to": "吴小小", "content": "没有夫妻是不吵架的，但是要记住我们是彼此最爱的人。"},
                {"from": "张恒", "to": "李琴", "content": "不说什么甜言蜜语，结婚以后工资卡交给你，对小金库说no。"},
                {"from": "新晋奶爸", "to": "小小", "content": "你和女儿开开心心的，就是我努力的目标。"},
                {"from": "欣欣妈妈", "to": "熊爸比", "content": "希望我们一家人可以健健康康的，我就心满意足啦。"},
                {"from": "吴言", "to": "落落", "content": "真的是超级激动，当你告诉我，我要当爸爸了。感觉长这么大，没有哪件事让我这么兴奋，除了我们婚礼那天。"},
                {"from": "Olle", "to": "Alex", "content": "谢谢你给我策划这么一场完美的婚礼，让我可以像个公主一样嫁给你。"},
                {"from": "高凯", "to": "丫丫", "content": "谢谢你愿意陪我在高温下打球，谢谢你愿意陪我一起还房贷，谢谢你愿意在我生病时陪我到深夜，千言万语想表达对你的感谢。可我还是决定用实际行动来回报你，亲爱的。"},
                {"from": "小杰", "to": "小菲", "content": "别人都说闪婚太不理智，很有可能闪离。可我想说，那是别人。"},
                {"from": "思瑞", "to": "青青", "content": "上学时每次听到你名字，都有点激动，可以看见你站起来发言。工作以后，每次听到朋友提起你，小心翼翼的听着关于你的消息。没想到，今天，我竟然可以和你一起步入这个神圣的礼堂。"},
                {"from": "高锋", "to": "奕瑶", "content": "每次出差我都担心你过的好不好。饭有没有按时吃，夜里睡觉有没有蹬被子，工作顺不顺心。所以我决定换一份不用出差的工作，省的整天提心吊胆。"},
                {"from": "小凤", "to": "小陈陈", "content": "你大概就是那唯一一个比我父母对我都好的男人，那唯一一个比我自己都了解我的男人，那唯一一个把我看的比你自己都重要的男人。"},
                {"from": "旺仔小背头", "to": "迷糊小公主", "content": "还记得第一次去老门东，我给你拍照。你一路嫌弃我的技术，哈哈哈。如今到哪玩都要我把手机电充满，让我给你拍好多照片，还一个劲儿夸我拍的好，这张好看，那张不错的。大概是为了让你开心吧。"},
                {"from": "安阳", "to": "胡梦婷", "content": "每次看电影的票感我都留着，我要用它们拼成一个超大的爱心，拿来和你求婚。"},
                {"from": "阿锋", "to": "少岚", "content": "这个世界上，也许有人比我更优秀，但没人比我更懂你；也许有人比我更适合你，但没人比我更爱你；我永远是陪你一生的人！"},
                {"from": "小封封", "to": "陈小杰", "content": "最美的爱情莫过于你每天晚上问我第二天早上想吃什么，翌日清晨桌子上如约而至的早餐。"},
                {"from": "墨白", "to": "青瑶", "content": "老婆，虽然现在有了孩子，但是你依旧是No.1，最最最最最重要的人。"},
                {"from": "李梓杰", "to": "李欣", "content": "同学8年，相爱4年，小公主，再等我一年。毕业了，咱们就结婚。"},
                {"from": "姜云天", "to": "刘洁瑶", "content": "老实人，也不会说啥其他。此生定不负你，全心全意为你。"},
                {"from": "林平", "to": "林丽华", "content": "谢谢你愿意为了我甘愿在家做全职太太，照顾宝宝。感恩亲爱的"},
                {"from": "吴秀萍", "to": "蒋超凡", "content": "你加班回来晚了，就自己一个人蜷缩在沙发上睡着了。不敢进房间怕吵醒怀孕熟睡的我，其实我也很心疼你，你知道么"},
                {"from": "杨丽", "to": "韩东", "content": "我们没有电视剧里的一见钟情，也没有家长里短的婆媳矛盾，甚至七年止痒的劫难也没遇到。一切都很平淡，自然，心安。"},
                {"from": "路遥", "to": "郑秀秀", "content": "十月怀胎，真的很不容易，你真的付出太多了。感谢你，亲爱的。"},
                {"from": "邢超", "to": "于曼曼", "content": "英国，美国，法国，澳大利亚，日本，墨尔本到处都有我们的足迹了。下次的目的地选好了么？我已经迫不及待了。"},
                {"from": "宋慧", "to": "孙强", "content": "其实在你跟我表白之前，我已经喜欢你有一段时间了。但是呢，我就装傻没说，接受了你的表白。现在把这个秘密告诉你了，开心了吧。"},
                {"from": "小米", "to": "赵宇", "content": "别的女孩子都觉得房子车子结婚必不可少，在我看来，有你在身边更加珍贵。不是说我觉得面包不重要，而是我觉得这些我们都会有的。但是没有你，面包食而无味。"},
                {"from": "程序猴", "to": "小公主", "content": "我不怎么会说话 我擅长敲代码 我不怎么会哄你开心 我对你一见倾心 我不会的还有很多 但是为了你我都会慢慢去学做的更好。"},
                {"from": "孟媛媛", "to": "薛禹哲", "content": "因为你的挑食我学会了做菜，而且慢慢喜欢上了做菜。很奇妙，大概这就是爱情的魅力吧。"},
                {"from": "陈晨", "to": "王璐 ", "content": "这99朵玫瑰是我自己去玫瑰园里一朵一朵采下来给你的，事无巨细，亲力亲为。以后漫长的婚姻生活里，我也会像今天这般待你。"},
                {"from": "小胖子", "to": "小瘦子", "content": "我会视你的父母，如同我的亲生父母，我会把你的感受，优先于我自己的想法，我会把每一个明天，都当做生命中的最后一天去珍惜我们的生活。"},
                {"from": "张大美", "to": "李泽", "content": "我要的很简单，毕业之后无论是否还在一个城市，不会因为短暂的分别而影响我们的感情。"},
              ];
