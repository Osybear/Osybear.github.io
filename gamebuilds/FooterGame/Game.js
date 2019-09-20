
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    
    this.player = null;
    this.speed = 2;
    
    this.coin1 = null;
    this.coin2 = null;
    this.scaleX = {x: 1};
    
    this.collected = 0;
    this.counter = null;
};

BasicGame.Game.prototype = {

    create: function () {
        
        //Set Stage Background Color
        this.stage.backgroundColor = "#EBEBEB";
        
        //Set Physics Engine
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        //Create Player
        //this.player = this.add.graphics(0, 0);
        //this.player.beginFill(0xffa500);
        //this.player.drawRect(0, 0, 16, 16);
        //this.player.position.setTo(this.world.width/2 - this.player.width /2,this.world.height - this.player.height)
        
        this.player = this.add.sprite(0,0,'Guy-Run',0);
        this.player.scale.setTo(.3);
        this.player.position.setTo(this.world.width/2, this.world.height);
        this.player.anchor.setTo(0.5,0.5);
        
        this.physics.arcade.enable(this.player);
        this.player.body.setSize(128,128,0,0)
        this.player.body.collideWorldBounds = true;
        
        this.player.animations.add('run-right', [0,2], 4, false, true);
        this.player.animations.add('run-left', [1,3], 4, false, true);
        this.player.animations.add('hugs', [5,6,7,8,9,10,11,12,13,14,15,16,17,18], 5, false, true);
        
        //Create The Collectable Objects
        //Coin1
        this.coin1 = this.add.graphics(0,0);
        this.coin1.beginFill(0xFFFF00);
        this.coin1.lineStyle(1, 0x000000, 1);
        this.coin1.drawCircle(0, 0, 15, 15);
        this.coin1.anchor.setTo(0.5,0.5);
        this.coin1.position.setTo(0,this.world.height);
        this.coin1.x += 10;
        this.coin1.y -= 10;
        this.physics.arcade.enable(this.coin1);
        
        //Coin2
        this.coin2 = this.add.graphics(0,0);
        this.coin2.beginFill(0xFFFF00);
        this.coin2.lineStyle(1, 0x000000, 1);
        this.coin2.drawCircle(0, 0, 15, 15);
        this.coin2.anchor.setTo(0.5,0.5);
        this.coin2.position.setTo(this.world.width,this.world.height);
        this.coin2.x -= 10;
        this.coin2.y -= 10;
        this.physics.arcade.enable(this.coin2);
        
        //Tween Scale from -1 to 1
        this.add.tween(this.scaleX).to( { x: -1 }, 1000, "Linear", true, 0, -1, true); 
        //Create the Counter Text
        this.counter = this.add.text(0,0,"000",{font: 'bold 20pt Arial', fill: '#000000'});
    },

    update: function () {
        
        //Set Player Offset
        var mousePos = this.input.position;
        
        //Move Player Towards Pointer
        if(this.math.distance(this.player.x,this.player.y,mousePos.x,mousePos.y) < 10){
            this.player.play('hugs');
        }
        else if(this.math.distance(this.player.x,0,mousePos.x,0) < 3){
            this.player.animations.stop();
            this.player.frame = 4; 
        }else if(this.player.x < mousePos.x){
            this.player.x += this.speed;
            this.player.play('run-right');
        }else if(this.player.x > mousePos.x){
            this.player.x -= this.speed;
            this.player.play('run-left');
        }
        
        //Check Collisions
        this.physics.arcade.overlap(this.player,this.coin1,this.hitCoin1, null, this);
        this.physics.arcade.overlap(this.player,this.coin2,this.hitCoin2, null, this);
        
        //Update Counter And Counter Format
        if(this.collected < 10)
            this.counter.text = "00" + this.collected;
        else if(this.collected >= 10 && this.collected < 100)
            this.counter.text = "0" + this.collected;
        else if(this.collected >= 100)
            this.counter.text = this.collected;
        
        //Update Coin Scale. Adds Rotate Effect
        this.coin1.scale.x = this.scaleX.x;
        this.coin2.scale.x = this.scaleX.x;
    },
    
    render: function () {
        //this.game.debug.text( "Player X: " + this.player.x, 32, 32 );
        //this.game.debug.text( "Input X: " + this.input.x, 32, 64 );
        //this.game.debug.body(this.player);
    },
    
    hitCoin1: function(player, coin1) {
        coin1.kill();
        this.collected++;
        this.time.events.add(Phaser.Timer.SECOND * 2, function(){
            coin1.visible = true;
            coin1.alive = true;
            coin1.exists = true;
        }, this);
    },
    
    hitCoin2: function(player, coin2) {
        coin2.kill();
        this.collected++;
        this.time.events.add(Phaser.Timer.SECOND * 2, function(){
            coin2.visible = true;
            coin2.alive = true;
            coin2.exists = true;
        }, this);
    }
};
