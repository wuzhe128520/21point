/*一、21点游戏分析

1、玩家构造器
属性：
name: 名字
ownCards: 当前持有的牌(数组)
isPlaying: 是否正在游戏中
point: 分数;
方法：
putCards: 获取牌之后，将牌放入自己的ownCards数组
getPoint: 获取当前牌面的点数(分为获取明牌的点数和获取所有牌的点数)
isNeedCard: 是否需要牌(普通玩家通过事件点击判断，电脑玩家通过简单的ai智能判断)*/
function Player (name,isPlaying) {
    this.name = name;
    this.ownCards = [];
    this.point = 0;
    this.score = 0;
    this.isPlaying = isPlaying;
}
Player.prototype = {
    //保存得到的牌
    putCards: function (singleCard) { //ok
        var ownCards = this.ownCards;
        //当前发的牌的点数
        var cardPoint = singleCard.point,
            //拥有的牌里有多少个A
            howManyA = 0;
            //不管当前的牌是多少，先将发的牌加进数组。
            ownCards.push(singleCard);
          //目前所拥有的牌的点数和
           var sumPoint =this.getPoint(true);
            var ownCardsLength = ownCards.length,
                sumA= 0,    //ownCards中所有A加起来的点数
                indexAry = []; //保存所有含有A的对象的索引
            for(var i=0;i < ownCardsLength ;i ++){
                if(ownCards[i].point == 1 || ownCards[i].point==11){
                    howManyA++;
                    sumA += ownCards[i].point;
                    indexAry.push(i);
                }
            }
            if(!howManyA){//如果拥有的牌里没有A，直接返回数组
                return ownCards;
            }
            //如果拥有的牌里有A
            //除去数组中所有A的点数，得到剩余的点数和
            var remainPoint = sumPoint - sumA;
            //如果A作为11的时候，所有A的和加上之前剩余的点数之和，小于21。
            // 则设置A为11,否则设置A为1
            var isLt21 = (remainPoint + howManyA * 11 <= 21),
                 num = isLt21 ? 11 : 1;
              for (var j in indexAry) {
                  //将所拥有牌的数组中所有包含A的对象的点数重新设置为num
                   ownCards[indexAry[j]].point = num;
              }
            return ownCards;
    },
    //得到当前牌的点数(isAllPoint表示是否获得所有牌(包括暗牌)的点数，为false则只获取明牌的点数)
    getPoint: function (isAllPoint) {//ok
        if(!this.ownCards){//手中没有牌，返回0
            return 0;
        }
        var sumPoint=0,
            aryLength=this.ownCards.length;
        for (var i = (isAllPoint ? 0 : 1);i < aryLength;i++) {
            //
            sumPoint+=this.ownCards[i].point;
        }
        this.point=sumPoint;
        return sumPoint;
    },
    //是否需要牌
    isNeedCard: function () {

    }
};
//庄家：
function User (name) {
    this.name = name;
}
User.prototype=new Player();
User.prototype.isNeedCard = function (isRequiedCard) {
    return isRequiedCard;//true需要牌，false不需要牌
};
//电脑玩家
function GamePlayer (name) {
    this.name = name;
}
GamePlayer.prototype=new Player();
GamePlayer.prototype.isNeedCard = function (userObj){//玩家对象
    var userPoint = userObj.getPoint(false);//得到玩家明牌的点数
    var gamePoint = this.getPoint(true);//得到电脑所有的点数
    var differ=gamePoint - userPoint;
    if(differ > 0){
        var poor = 21 - gamePoint;
        if(poor >= 1 && poor <= 2){
          return  ai.probability(10);
        }
        else if(poor >= 3 && poor <= 5){
           return ai.probability(25);
        }
        else if(poor >= 6 && poor <= 9){
           return ai.probability(50);
        }
        else if (poor==10){
            return true;
        }
    }
    else {//如果点数小于庄家的明牌点数则百分之百需要牌
        return true;
    }
    return false;//默认不要牌
};
/*2、AI构造器
原则：如果人脑的牌面上的点数比我（电脑）目前的大，必须要
如果我们的牌面已经比他大，那么这个时候，我们要不要牌就通过几率来判断
如果离21点还少1-2个点，要牌的概率就是10%  1/10
如果离21点还少3-5个点，要牌的概率就是25%
如果离21点还少6-9个点，要牌的概率就是50%
如果离21点还少10个点以上，要牌的概率就是100%*/
    //概率执行函数
/*function probability(percent){//percent: 10 25 50 100
    var baseRange = 100;
    var percent = 10;
    var data =Math.floor(Math.random()*baseRange );
    if(data >=0&&data<percent ){
        return true;
    }
}*/
function AI(){//AI自动判断
}
AI.prototype={
    //概率事件
    probability: function(percent){//percent: 10 25 50 100
        var baseRange = 100;
        var percent = 10;
        var data =parseInt(Math.random()*baseRange );
        if(data >=0&&data<percent ){
            //发牌
            return true;
        }
        return false;
    }
};
var ai=new AI();
    //3、牌构造器Cards
function Cards (count){
    this.cards=[];
    this.count=count;
    this.init();
}
Cards.prototype={
    init: function () { //几副牌  ok
        var count=this.count,
            cards=this.cards;
        for(var n=0;n<count;n++) {
            for( var i = 1;i <= 4;i++ ){
                for (var j = 1;j <= 13 ;j++) {
                    cards.push( {
                        color: i,//1: 黑桃 2：红桃 3：梅花 4：方片
                        point: j > 10 ? 10 : j,
                        src: "images/"+i+"/"+j+".jpg"
                    } );
                }
            }
        }
        return cards;
    }
};
//4、21点游戏系统构造器
/*
 user: 玩家对象
 compCount: 电脑对象
 pukeCount: 几副牌
 视图 如何 与对象一一联系起来
 */
function Game21(user,compCount,cardCount) {
    this.user=user;            //庄家(用户)
    this.compCount=compCount; //电脑玩家的个数
    this.card=new Cards(cardCount); //牌
    this.players=[];           //所有玩家
    this.currentplay=this.user; //当前活动的玩家
    this.computers=[];//电脑玩家
    this.init();

}
Game21.prototype = {
    //初始化，将玩家全部装入players数组中
    init: function() {
        var length=this.compCount;
        for(var i = 0;i < length;i++) {
            this.computers.push(new GamePlayer("电脑" + (i + 1)));
        }
        this.players=this.players.concat(this.computers);
        this.players.push(this.user);
    },
    //洗牌
    shuffle: function(){//puke牌对象  ok
        this.card.cards.sort(function(a,b){
            return parseInt(Math.random()*3)-1;
        });
        return this.card.cards;
    },
    //发牌
    sendCard: function(){//ok
        console.log("牌的长度："+this.card.cards.length);
        if(this.card.cards.length > 0){
            var card=this.card.cards.pop();
        }
        else {
           var reShuffle = window.confirm("没有牌了,是否重新洗牌？");
            if(reShuffle){
                this.card = new Cards(1);
                this.shuffle();
                card=this.card.cards.pop();//重新发牌
            }
        }
        return card;//发出去的那张牌
    },
    //裁决  player: 普通玩家 ,gameplays: 电脑玩家
    verdict: function(player,gameplays) {
        var that = this;
        var isContinue=false;
        //这里的point必须是小于等于21的
        var playerSumPoint = player.getPoint(true);
        var gameSumPoint = gameplays.getPoint(true);
            gameSumPoint = gameSumPoint > 21 ? 0 : gameSumPoint;
            playerSumPoint = playerSumPoint > 21 ? 0 : playerSumPoint;
        //平局情况
        if(playerSumPoint==0&&gameSumPoint==0){
            setTimeout(function(){
                 isContinue=window.confirm("平局!\n是否继续？");
                that.isEnd(isContinue);
            },1000);
        }
        //玩家赢
        else if(playerSumPoint==gameSumPoint|| playerSumPoint > gameSumPoint){
            player.score++;
            that.showScore( document.getElementsByClassName("playscore")[0],"得分："+player.score );
            setTimeout(function(){
                isContinue=window.confirm(player.name+"赢!是否继续？");
                that.isEnd(isContinue);
            },1000);
        }
        else {
            gameplays.score++;
            that.showScore( document.getElementsByClassName("computerscore")[0],"得分："+gameplays.score );
            setTimeout(function(){
                isContinue=window.confirm(gameplays.name+"赢!是否继续？");
                that.isEnd(isContinue);
            },1000);
        }
    },
 /*   //是否出局
    isGetOut: function(player){
        var point=player.getPoint(true);
        if(point>21){
            //将当前玩家的游戏状态isPlaying改为false;

        }
    },*/
    //发牌显示控制
    sendCardControl: function (requireSendCard){//requireSendCard:需要发牌的个数
    var banker=document.getElementsByClassName("player");//所有玩家的视图元素
    var playLength=this.players.length;
    for(var n = 0;n < requireSendCard;n++){
        var i=0;
        while(i<playLength) {
                   var sendcardobj=this.sendCard();
                    this.players[i].putCards(sendcardobj);
                    //将图片追加到对应玩家的视图中去
                    var imgs = document.createElement("img");
                    if(!i&&!n){
                        imgs.src = "images/back.jpg";
                        imgs.id = "unlookcard";
                        imgs.setAttribute("realCard",sendcardobj.src);
                    }
                    else {
                        imgs.src = sendcardobj.src;
                    }
                    banker[i].appendChild(imgs);
                    i++;
        }
    }
},
    //开始游戏
    play: function () {
        //恢复最初视图
        this.initDateAndView();
        this.shuffle();
        this.sendCardControl(2);
        var userPoint=this.user.getPoint(true);
        this.showPoints(this.user,document.getElementById("playerPoint"));
        var computerId = document.getElementById("machinePoint");
        computerId.style.visibility = "hidden";
    },
    //显示点数。playerObj: 玩家对象
    showPoints: function(playerObj,targetid) {
        var userPoint=playerObj.getPoint(true);
             targetid.innerText=userPoint+"点";
    },
    //视图操作
    handleView: function() {
        var players = document.getElementsByClassName("player")[1];
        var imgs=document.createElement("img");
        imgs.src=cardObj.src;
        players.appendChild(imgs);
    },
    //电脑自动要牌
    computerTakeCards: function(){
        var that=this;
            var userobj = that.user;
            var computer = that.computers[0];
            var isNeedCard = computer.isNeedCard(userobj);
            var computerPoint = 0; // 电脑点数
            var computerId = document.getElementById("machinePoint");
                computerId.style.visibility = "visible";
            if(!isNeedCard){//如果不需要牌，直接显示点数
                    this.showPoints(computer,computerId);
            }
            while(isNeedCard){
                    var sendcard=that.sendCard();
                    computer.putCards(sendcard);
                    var players = document.getElementsByClassName("player")[0];
                    var imgs=document.createElement("img");
                    imgs.src=sendcard.src;
                    players.appendChild(imgs);
                    computerPoint = computer.getPoint(true);
                    this.showPoints(computer,computerId);
                    isNeedCard = computer.isNeedCard(userobj);
           }
             var unlookcard = document.getElementById("unlookcard");
                 unlookcard.src = unlookcard.getAttribute("realCard");
           return computer.getPoint(true);
    },
    isEnd: function (isContinue){
        //如果玩家选择继续游戏，则清除各个玩家手中的牌和点数
        if(isContinue){
            //清空 手里的牌，和点数
            game.play();
        }
        else {
            //如果玩家选择结束游戏，直接销毁game对象
            this.exit();
        }
    },
    //初始化显示视图
    initDateAndView: function (){
        var players=document.getElementsByClassName("player");
        for(var i= 0,plLength=players.length;i<plLength;i++){
            players[i].innerHTML="";
        };
        var gameplayers=this.players;
        for(var j= 0,gameLength=gameplayers.length;j<gameLength;j++){
            gameplayers[j].ownCards=[];
            gameplayers[j].point=0;
        }
    },
    //退出
    exit: function() {
        this.initDateAndView();
        var requireCard = document.getElementById("requireCard");
            requireCard.style.display="none";
        var sendCard = document.getElementById("sendCard");
            sendCard.style.display = "inline-block";
        game=null;
        zs=null;
    },
    //显示分数
    showScore: function(targetElement,score) {
        targetElement.innerText = score;
    }
};
var zs=new User("我浪故我在");
var game=new Game21(zs,1,1);
var bankerName=document.getElementById("bankerName");
bankerName.innerText=game.computers[0].name;
var playerName=document.getElementById("playerName");
playerName.innerText=zs.name;
var sendCard=document.getElementById("sendCard");
sendCard.onclick = function(){ //点击发牌时的事件
    game.play();
    this.style.display="none";
    var prev=this.previousSibling;
    prev.style.display="inline-block";
    var next = this.nextElementSibling;
    next.style.display= "inline-block";
    prev.onclick = function () { //点击叫牌时的事件
        var cardObj=game.sendCard();
        game.currentplay.putCards(cardObj);
        //获取当前用户对应的视图
        var players = document.getElementsByClassName("player")[1];
        var imgs=document.createElement("img");
             imgs.src=cardObj.src;
             players.appendChild(imgs);
        game.showPoints(game.currentplay,document.getElementById("playerPoint"));
        if(game.currentplay.getPoint(true)>21){
            //game.currentplay.ownCards=null;
            //此时玩家的牌已经爆掉了，需要裁决了
            //console.log("自动要牌");
            var gamepoint=game.computerTakeCards();
            game.verdict(game.currentplay,game.computers[0]);
        }
    }
};
var dealCard = document.getElementById("dealCard");
//点击"听牌"进行裁决
 dealCard.onclick = function () {
     //电脑自动获取牌
     gamepoint=game.computerTakeCards();
     console.log("电脑的点数是： "+gamepoint);
     game.verdict(game.currentplay,game.computers[0]);
 };
//图片预加载

    var imgAry = [];
    for( var i = 1;i <= 4;i++ ){
        for (var j = 1;j <= 13 ;j++) {
            var url = "images/"+i+"/"+j+".jpg";
            imgAry.push(url);
        }
    }
    var Imgvalue;
    var Count =imgAry.length;
    var Imgs = new Array(Count);
    var ImgLoaded =0;
//预加载图片
    function preLoadImgs()
    {

        for(var i=0;i<Imgs.length;i++){
            Imgs[i]=new Image();
            downloadImage(i);
        }
    }

//加载单个图片
    function downloadImage(i)
    {
        //var imageIndex = i+1; //图片以1开始
        Imgs[i].src = imgAry[i];
        Imgs[i].onLoad=validateImages(i);
    }


//验证是否成功加载完成，如不成功则重新加载
    function validateImages(i){
        if (!Imgs[i].complete)
        {
            window.setTimeout('downloadImage('+i+')',200);
        }
        else if (typeof Imgs[i].naturalWidth != "undefined" && Imgs[i].naturalWidth == 0)
        {
            window.setTimeout('downloadImage('+i+')',200);
        }
        else
        {
            ImgLoaded++;
            var cent=parseInt((ImgLoaded/Count)*100);
            var progressbar=document.getElementById("progressbar"),
            progressbar2=progressbar.getElementsByTagName("p");
            progressbar2[0].innerHTML=cent+"%";
            var progress=document.getElementById("progress");
            progress.style.width=cent+"%";
            if(ImgLoaded == Count)
            {
                setTimeout(function(){
                    progressbar.style.display = "none";
                    document.getElementById("gameview").style.display="block";
                },1000);
            }
        }
    }
    preLoadImgs();





