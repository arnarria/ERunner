/*
    Name: Ariel Arriaga
    Game Title: Concrete Jungle
    Approximate Hours: Too Long (67 Hours)

    Creative Tilt: There were other plans for this game. I went through a couple concepts. I had an idea for a sports game, and
                   then I had an idea for a sort of flappybird type game but with a twist. Eventually, I settled on more of
                   a survival "thread the needle" type of game. I took some inspiration from certain mobile endless runner games
                   and decided to implement a gravity movement that would work together with "enemy" object types to create
                   the situation where the player would have to carefully navigate a bird around these objects, thus the "thread
                   the needle" action. As for the visual style, I cannot claim to have done anything that really stands out. My
                   art skills are very limited, and I didn't want to spend too much (more) time on the art. As a result, for the
                   art direction, I decided to go with things that I could very easily draw myself. The art could be better, but
                   I did make an effort and was even able to make multiple layers that would create a (hopefully) more convincing
                   parallax effect.

    Musical Credits: https://pixabay.com/music/beautiful-plays-inspiring-cinematic-ambient-116199/

    "Death" Sound Credit: https://www.youtube.com/watch?v=xYJ63OTMDL4
*/

'use strict';

//reserve keyboard vars
let keyUP, keyDOWN, keyR, keyT, keyS, keyC;

//game config
let config = 
{
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    physics:{
        default: "arcade",
        arcade:{
            debug: false,
            gravity:{
                x: 0,
                y: 0
            }
        }
    },
    scene: [Load, Menu, Scene1]
};

let game = new Phaser.Game(config);

//global variables
let tileSize = 64;

let gravityForce = 800;
let birdAcceleration = 300;

let highScore = 0;

let sceneIndex = 0;