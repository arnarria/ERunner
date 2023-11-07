class Load extends Phaser.Scene
{
    constructor()
    {
        super("loadScene");
    }

    preload()
    {
        // loading bar
        let loadingBar = this.add.graphics();
        this.load.on('progress', (value) => {
            loadingBar.clear();
            loadingBar.fillStyle(0xFFFFFF, 1);
            loadingBar.fillRect(0, game.config.height - 20, game.config.width * value, 10);
        });
        this.load.on('complete', () => {
            loadingBar.destroy();
        });

        // set load path
        this.load.path = "assets/";

        // load environmental assets
        this.load.image("titleScreen_bg", "titleScreen_bg.png");
        this.load.image("titleScreen_credit", "titleScreen_credit.png");
        
        this.load.image("scene1_bg_basecolor", "scene1_bg_basecolor.png");
        this.load.image("scene1_bg_background", "scene1_bg_background.png");
        this.load.image("scene1_bg_midground", "scene1_bg_midground.png");
        this.load.image("scene1_bg_foreground", "scene1_bg_foreground.png");
        this.load.image("scene1_bg_clouds", "cloudy.png");
        this.load.image("scene1_result", "scene1_result.png");

        // load audio
        this.load.audio("bgm", "bgm.mp3");
        this.load.audio("sfx_hurt", "sfx_hurt.wav");

        // load pigeon (dove?) player
        this.load.image("pigeon", "pigeon.png");

        // load "kill" objects
        this.load.image("spikeBall", "spikeball.png");
    }

    create()
    {
        this.scene.start("menuScene");
    }
}