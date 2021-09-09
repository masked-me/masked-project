//主进程部分
var can1, can2, ctx1, ctx2, lastTime, deltaTime;
var bgPic = new Image();
var canWidth, canHeight;
var ane;
var fruit;
var mom;
var mx;
var my;
var baby;

var babyTail = [];
var babyEye = [];
var babyBody = [];

var momTail = [];
var momEye = [];
var momBodyOra = [];
var momBodyBlue = [];

var data;
var wave;
var halo;

var dust;
var dustPic = [];
document.body.onload = game;

function game() {
    init();
    lastTime = Date.now();
    deltaTime = 0;
    gameloop();
}

function init() {
    //获取canvas context
    can1 = document.getElementById('canvas1');//鱼，内容，UI，圆
    ctx1 = can1.getContext('2d');
    can2 = document.getElementById('canvas2');//背景，果实，海葵
    ctx2 = can2.getContext('2d');

    can1.addEventListener("mousemove", onMouseMove, false);

    bgPic.src = './src/background.jpg';

    canWidth = can1.width;
    canHeight = can1.height;
    //海葵
    ane = new aneObj();
    ane.init();
    //果实
    fruit = new fruitObj();
    fruit.init();
    //大鱼
    mom = new momObj();
    mom.init();
    //鼠标
    mx = canWidth * 0.5;
    my = canHeight * 0.5;
    //小鱼
    baby = new babyObj();
    baby.init();
    //数据
    data = new dataObj();
    //大鱼果实反馈
    wave = new waveObj();
    wave.init();
    //小鱼果实反馈
    halo = new haloObj();
    halo.init();
    //漂浮物
    dust = new dustObj();
    dust.init();

    for (let i = 0; i < 8; i++) {
        babyTail[i] = new Image();
        babyTail[i].src = `./src/babyTail${i}.png`;
    }

    for (let i = 0; i < 2; i++) {
        babyEye[i] = new Image();
        babyEye[i].src = `./src/babyEye${i}.png`;
    }

    for (let i = 0; i < 20; i++) {
        babyBody[i] = new Image();
        babyBody[i].src = `./src/babyFade${i}.png`;
    }

    for (let i = 0; i < 8; i++) {
        momTail[i] = new Image();
        momTail[i].src = `./src/bigTail${i}.png`;
    }

    for (let i = 0; i < 2; i++) {
        momEye[i] = new Image();
        momEye[i].src = `./src/bigEye${i}.png`;
    }

    for (let i = 0; i < 8; i++) {
        momBodyOra[i] = new Image();
        momBodyBlue[i] = new Image();
        momBodyOra[i].src = `./src/bigSwim${i}.png`;
        momBodyBlue[i].src = `./src/bigSwimBlue${i}.png`;
    }

    for (let i = 0; i < 7; i++) {
        dustPic[i] = new Image();
        dustPic[i].src = `./src/dust${i}.png`;
    }
}

function gameloop() {
    //智能计算绘制时间，fps frame per second 
    window.requestAnimationFrame(gameloop);//setInterval,setTimeout
    let now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    if (deltaTime > 40) {
        deltaTime = 40;
    }
    drawBackground();
    ane.draw();
    fruitMonitor();
    fruit.draw();

    ctx1.clearRect(0, 0, canWidth, canHeight);
    mom.draw();
    momFruitsCollision();
    momBabyCollision();
    baby.draw();

    data.draw();
    wave.draw();
    halo.draw();
    dust.draw();
}
function onMouseMove(e) {
    if (!data.gameOver) {
        if (e.offSetX || e.layerX) {
            mx = e.offSetX == undefined ? e.layerX : e.offSetX;
            my = e.offSetY == undefined ? e.layerY : e.offSetY;
        }
    }
}