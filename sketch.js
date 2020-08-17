var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex , trexrunning , deadtrex;
var ground , invisibleground , groundimage;
var CloudsGroup, CloudImage;
var OstaclesGroup, obstacle1 , obstacle2 , obstacle3 , obstacle4 , obstacle5 , obstacle6;
var gameOver , gameOverimage;
var restart , restartimage;
var checkpoint , die , jump;
var score = 0;
localStorage["HighestScore"]=0;
function preload(){
  trexrunning = loadAnimation("trex1.png" , "trex3.png" , "trex4.png");
  deadtrex = loadAnimation("trex_collided.png");
  groundimage = loadImage("ground2.png");
  CloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  checkpoint = loadSound("checkPoint.mp3");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
}
function setup() {
  createCanvas(600, 200);
  trex = createSprite(50 , 180 , 20 , 50);
  trex.addAnimation("running" , trexrunning);
  trex.addAnimation("collided" , deadtrex);
  trex.scale = 0.5;
  camera.x=trex.x;
  camera.y=100;
  ground = createSprite(100 , 180 , 600 , 20);
  ground.addImage(groundimage);
  ground.x = ground.width/2-200;
  ground.velocityX = -(6 + 3*score/100);
  
  invisibleground = createSprite(300 , 190 , 600 , 10);
  invisibleground.visible = false;
  //place gameOver and restart icon on the screen
 gameOver = createSprite(100,100);
 restart = createSprite(100,140);
gameOver.addImage(gameOverimage);
gameOver.scale = 0.5;
restart.addImage(restartimage);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

//set text
textSize(18);
textFont("Georgia");
textStyle(BOLD);
  
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();
}

function draw() {
  background("white");
  text("score: "+score,200 , 50);
  if(gameState == PLAY){
    score = score+Math.round(getFrameRate()/60);
    if (score>0 && score%100 == 0){
      checkpoint.play();
    }
    ground.velocityX = -(6 + 3*score/100);
    if(keyDown("space") && trex.y>=158){
      trex.velocityY = -12;
      jump.play();
    }
    trex.velocityY = trex.velocityY+0.8;
    if(ground.x<0){
      ground.x = ground.width/2-200;
    }
    trex.collide(invisibleground);
    spawnClouds();
    spawnObstacles();
     //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play;
    }
  }
  else if(gameState == END){
    ground.velocityX = 0;
    trex.velocityY = 0;
     gameOver.visible = true;
    restart.visible = true;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided", deadtrex);
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
  }
  if(mousePressedOver(restart)) {
  reset(); 
  
  }
  drawSprites();
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
   trex.changeAnimation("running", trexrunning);
  if (localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score;
  }
  score = 0;
  
  
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(CloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
        break;
      case 2:obstacle.addImage(obstacle2);
        break;
      case 3:obstacle.addImage(obstacle3);
        break;
      case 4:obstacle.addImage(obstacle4);
        break;
      case 5:obstacle.addImage(obstacle5);
        break;
      case 6:obstacle.addImage(obstacle6);
        break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}