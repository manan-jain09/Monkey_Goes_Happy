//variable to store values for - 
var PLAY=1;
var END=0;
var gameState = PLAY;
var monkey, monkey_running, monkey_stop;
var banana, obstacle, obstacleImage;
var back, backHolder;
var food, foodGroup, obstaclesGroup;
var reset, restart, gameDone, gameOver;
var score, survival;
var jumpSound; 

function preload(){
  
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  
  monkey_stop = loadAnimation("sprite_8.png");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  backHolder = loadImage("back.png");

  restart = loadImage("restart.png");
  gameDone = loadImage("gameover.png");
  
  jumpSound = loadSound("jump.mp3");
}

//Seup Function
function setup() {
  //creating the canvas
  createCanvas(400, 400);
  //background
  back = createSprite(0,30,400,400);
  back.addImage("back",backHolder);
  back.velocityX = -4;
  back.x = back.width / 2;
  back.scale = 2;
  
  //monkey
  monkey = createSprite(100,200, 20, 20);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("stopped", monkey_stop);
  monkey.scale = 0.1;
  
  //GameOver and reset
  gameOver = createSprite(200,200, 20, 20);
  gameOver.addImage("gameOver",gameDone);
  gameOver.scale = 0.7;
  reset = createSprite(200,300);
  reset.addImage("reset12",restart);
  //invisible ground
  invisibleGround = createSprite(200,350,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and food Groups 
  obstaclesGroup = createGroup();
  foodGroup = createGroup();
  //monkey collider function
  monkey.setCollider("circle",0,0,40);
  //monkey.debug = true;
  
  //score and survival time
  score = 0;
  survival = 0;
  
}

function draw() {
  //background color
  background("white");
  
  //if condition for play state
  if(gameState === PLAY){
    gameOver.visible = false;
    reset.visible = false;
    
    //Need the score running only when the game is in playstate
    survival = survival + Math.round(getFrameRate()/60);
        
    //move the ground
    back.velocityX = -(4 + 3 * score / 100);
  
    //making the background never-ending
    if (back.x < 0){
      back.x = back.width/2;
      }
    
    //jump when the space key is pressed
      if((keyDown("space") || keyDown(UP_ARROW)) && monkey.y >= 330) {
        monkey.velocityY = -10;
        jumpSound.play();
      }
      //add gravity
    monkey.velocityY = monkey.velocityY + 0.8;  

  
  if(foodGroup.isTouching(monkey)){
    score = score + 1;
    foodGroup.destroyEach();
     }
    
     //spawn the bananas
    spawnFood();
    
    //spawn obstacles on the ground
    spawnObstacles();
  } 
  //making the gamestate turn to end
  if(obstaclesGroup.isTouching(monkey)){
      gameState = END;
  }
  //Game State is end  
  if(gameState === END){
      gameOver.visible = true;
      reset.visible = true;
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    foodGroup.setVelocityYEach(0);
    foodGroup.setLifetimeEach(-1);
     
    back.velocityX = 0;
    monkey.velocityY = 0;
  
    monkey.changeAnimation("stopped", monkey_stop);

    }

  //making a ground for monkey and bananas
  foodGroup.collide(invisibleGround);
  monkey.collide(invisibleGround);
  
  //if condition for reset
   if(mousePressedOver(reset) && reset.visible === true){
     reset1();
     }
  
  //drawing the objects
  drawSprites();
  
  //Displaying the text
  fill("red");
  textSize(20);
  textAlign(CENTER);
  text("Score: "+ score, 100,50);
  text("Survival Time = " + survival, 300, 50);
  
 
}

function reset1(){

  monkey.changeAnimation("running", monkey_running);
  obstaclesGroup.destroyEach();
  foodGroup.destroyEach();
  score = 0;
  survival = 0;
  gameState = PLAY;
}

function spawnObstacles(){
  if (frameCount % 300 === 0){
    obstacle = createSprite(350,360,40,40);
    obstacle.velocityX = -(6 + score / 100);
    obstacle.addImage("obstacle",obstacleImage);
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}
function spawnFood(){
  if (frameCount % 80  === 0){
    food = createSprite(Math.round(random(90, 110)),Math.round(random(120, 200)),40,40);
    food.velocityY = (9   + score / 100);
    food.addImage("banana", bananaImage);
    food.scale = 0.1;
    food.lifetime = 300;
    foodGroup.add(food);
  }
}