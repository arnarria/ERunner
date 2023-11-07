class Scene1 extends Phaser.Scene
{
    constructor()
    {
        super("scene1");
    }

    create()
    {

        //change sceneIndex
        sceneIndex = 1;

        //variables & settings
        this.backgroundSpeed = [1, 3, 5, 7];

        this.player_acceleration = 1500;
        this.player_maxSpeedX = 500;
        this.player_maxSpeedY = 2000;
        this.player_drag = 800;

        this.physics.world.gravity.y = gravityForce;

        this.updateSpeed = false;

        this.sceneVelocity = 0;

        this.currentScore = 0;

        //create backgroundGroup & tile sprite
        this.add.image(0, 0, "scene1_bg_basecolor").setOrigin(0, 0);
        this.add.image(0, 0, "scene1_bg_clouds").setOrigin(0, 0);

        this.backgroundGroup = this.add.group();
        this.bg_background = this.add.tileSprite(0, 0, 960, 540, "scene1_bg_background").setOrigin(0, 0);
        this.bg_midground = this.add.tileSprite(0, 0, 960, 540, "scene1_bg_midground").setOrigin(0, 0);
        this.bg_foreground = this.add.tileSprite(0, 0, 960, 540, "scene1_bg_foreground").setOrigin(0, 0);
        
        //add tile sprites into backgroundGroup
        this.backgroundGroup.add(this.bg_background);
        this.backgroundGroup.add(this.bg_midground);
        this.backgroundGroup.add(this.bg_foreground);

        // add snapshot image and tween
        if (this.textures.exists('titlesnapshot')) {
            let titleSnap = this.add.image(0, 0, 'titlesnapshot').setOrigin(0, 0);
            this.tweens.add({
                targets: titleSnap,
                duration: 1500,
                alpha: { from: 1, to: 0 },
                repeat: 0
            });
        } else {
            console.log('texture error');
        }

        //create bgm
        this.bgm = this.sound.add("bgm");
        this.bgm.setLoop(true);
        this.bgm.play();

        //set up player bird
        this.bird = this.physics.add.sprite(game.config.width / 6, game.config.height / 2, "pigeon");
        this.bird.body.setSize(80, 40);
        this.bird.setCollideWorldBounds(true);
        this.bird.setMaxVelocity(this.player_maxSpeedX, this.player_maxSpeedY);

        //set up "enemies"
        this.spikeBallGroup = this.add.group();

        //add gameOver text
        let gameOverTextConfig = {
            fontFamily: "Monospace",
            fontSize: "40px",
            color: "#faf6a7",
            align: "left"
        }

        this.result = this.add.image(0, 0, "scene1_result").setOrigin(0, 0);
        this.result.alpha = 0;
        this.scoreText_1 = this.add.text(game.config.width / 2, game.config.height / 2 + 30, "", gameOverTextConfig).setOrigin(0.5);
        this.scoreText_2 = this.add.text(game.config.width / 2, game.config.height / 2 + 30 + tileSize, "", gameOverTextConfig).setOrigin(0.5);
        this.scoreText_1.alpha = 0;
        this.scoreText_2.alpha = 0;

        //add physics collider
        this.physics.add.collider(this.spikeBallGroup, this.spikeBallGroup);

        //define keys
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

        //store gameOVer status
        this.gameOver = false;

        //create time events
        this.speedUpEvent = this.time.addEvent({ delay: 2000, callback: this.sceneVelocityUp, callbackScope: this, repeat: 50 });
        this.speedChangeEvent = this.time.addEvent({ delay: 2000, callback: this.updateSpeedChangeStatus, callbackScope: this, repeat: -1 });
        this.currentScoreUpdateEvent = this.time.addEvent({ delay: 1000, callback: this.updateCurrentScore, callbackScope: this, repeat: -1 });
        
        //generate more spikeBalls on the top half
        this.spikeBallEventUp = this.time.addEvent({ delay: 5500, callback: this.addSpikeBallUp, callbackScope: this, repeat: -1 });
        
        //generate more spikeBalls on the botton half
        this.spikeBallEventDown = this.time.addEvent({ delay: 4500, callback: this.addSpikeBallDown, callbackScope: this, repeat: -1 });
    }

    update()
    {
        //update if not gameOver
        if(!this.gameOver)
        {
            this.backgroundScroll();
            this.playerMove();
            this.destroyEnemies();
            this.updateSpikeBallSpeed();

            //check bird collision
        this.physics.world.collide(this.bird, this.spikeBallGroup, this.birdCollision, null, this);
        }
        else
        {
            //remove all events
            this.speedUpEvent.remove(false);
            this.speedChangeEvent.remove(false);
            this.spikeBallEventUp.remove(false);
            this.spikeBallEventDown.remove(false);
            this.currentScoreUpdateEvent.remove(false);

            //update high score
            if(this.currentScore > highScore)
            {
                highScore = this.currentScore;
            }

            //press R to restart
            if(Phaser.Input.Keyboard.JustDown(keyR))
            {
                this.bgm.destroy();
                console.log(`currentScore: ${this.currentScore}`);
                console.log(`highScore: ${highScore}`);
                this.scene.restart();
            }

            //press T to return to title
            if(Phaser.Input.Keyboard.JustDown(keyT))
            {
                this.bgm.destroy();
                console.log(`currentScore: ${this.currentScore}`);
                console.log(`highScore: ${highScore}`);
                this.scene.start("menuScene");
            }
        }
    }

    playerMove()
    {
        if(Phaser.Input.Keyboard.JustDown(keyUP) && this.physics.world.gravity.y > 0)
        {
            this.physics.world.gravity.y = -gravityForce;
            this.bird.body.setAccelerationY(-birdAcceleration);
        }
        
        if(Phaser.Input.Keyboard.JustDown(keyDOWN) && this.physics.world.gravity.y < 0)
        {
            this.physics.world.gravity.y = gravityForce;
            this.bird.body.setAccelerationY(birdAcceleration);
        }
    }

    backgroundScroll()
    {
        //parallax scrolling
        for(let i = 0; i < this.backgroundGroup.getLength(); i++)
        {
            this.backgroundGroup.getChildren()[i].tilePositionX += this.backgroundSpeed[i] * this.sceneVelocity;
        }
    }

    addSpikeBallUp()
    {
        let tempSpikeBall = new SpikeBall(this, game.config.width + tileSize, 90 + Math.random() * 100, "spikeBall").setScale(0.5);
        tempSpikeBall.body.setSize(80, 80);
        tempSpikeBall.body.setDragY(500);
        tempSpikeBall.setVelocityX(-this.sceneVelocity * 200);
        this.spikeBallGroup.add(tempSpikeBall);
    }

    addSpikeBallDown()
    {
        let tempSpikeBall = new SpikeBall(this, game.config.width + tileSize, 190 + Math.random() * 270, "spikeBall").setScale(0.5);
        tempSpikeBall.body.setSize(80, 80);
        tempSpikeBall.body.setDragY(500);
        tempSpikeBall.setVelocityX(-this.sceneVelocity * 200);
        this.spikeBallGroup.add(tempSpikeBall);
    }

    updateSpeedChangeStatus()
    {
        this.updateSpeed = true;
    }

    updateSpikeBallSpeed()
    {
        if(this.updateSpeed)
        {
            for(let i = 0; i < this.spikeBallGroup.getLength(); i++)
            {
                this.spikeBallGroup.getChildren()[i].setVelocityX(-this.sceneVelocity * 200);
            }
            this.updateSpeed = false;
        }
    }

    destroyEnemies()
    {
        //check if destory spikeball
        if(this.spikeBallGroup.getLength() > 0)
        {
            for(let i = 0; i < this.spikeBallGroup.getLength(); i++)
            {
                let temp = this.spikeBallGroup.getChildren()[i];
                if(temp.x < 0 - tileSize)
                {
                    this.spikeBallGroup.remove(temp);
                    temp.destroy;
                }
            }
        }
    }

    sceneVelocityUp()
    {
        this.sceneVelocity += 0.1;

        if(this.sceneVelocity < 4)
        {
            if(this.sceneVelocity % 1 >= 0.99 || this.sceneVelocity % 1 <= 0.01)
            {
                this.spikeBallEventDown.remove(false);
                this.spikeBallEventDown = this.time.addEvent({ delay: 8000 / this.sceneVelocity, callback: this.addSpikeBallDown, callbackScope: this, repeat: -1 });

                this.spikeBallEventUp.remove(false);
                this.spikeBallEventUp = this.time.addEvent({ delay: 5000 / this.sceneVelocity, callback: this.addSpikeBallUp, callbackScope: this, repeat: -1 });
            }
        }
    }

    updateCurrentScore()
    {
        this.currentScore += this.sceneVelocity * 10;
    }

    birdCollision()
    {
        this.gameOver = true;

        for(let i = 0; i < this.spikeBallGroup.getLength(); i++)
        {
            this.spikeBallGroup.getChildren()[i].setVelocityX(0);
        }

        this.bird.setTint(0xFF0000);
        this.sound.play("sfx_hurt");

        this.result.alpha = 1;

        this.scoreText_1.text = this.currentScore;
        this.scoreText_1.alpha = 1;
        this.scoreText_2.text = highScore;
        this.scoreText_2.alpha = 1;
    }
}