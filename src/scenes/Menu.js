class Menu extends Phaser.Scene
{
    constructor()
    {
        super("menuScene");
    }

    create()
    {

        //create title screen image
        this.add.sprite(game.config.width / 2, game.config.height / 2, "titleScreen_bg");

        // define menu keys
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        //load credit image
        this.credit = this.add.image(0, 0, "titleScreen_credit").setOrigin(0, 0);
        this.credit.alpha = 0;
    }

    update()
    {
        if(this.credit.alpha == 0)
        {
            if(Phaser.Input.Keyboard.JustDown(keyS))
            {
                //initialize game settings
                game.settings = {
                    playerSpeed: 5
                };

                let textureManager = this.textures;
                // take snapshot of the entire game viewport
                // https://newdocs.phaser.io/docs/3.55.2/Phaser.Renderer.WebGL.WebGLRenderer#snapshot
                this.game.renderer.snapshot((snapshotImage) => {
                    if(textureManager.exists('titlesnapshot')) {
                        textureManager.remove('titlesnapshot');
                    }
                    textureManager.addImage('titlesnapshot', snapshotImage);
                });
    
                this.scene.start("scene1");
            }

            if(Phaser.Input.Keyboard.JustDown(keyC))
            {
                this.credit.alpha = 1;
            }
        }
        else
        {
            if(Phaser.Input.Keyboard.JustDown(keyC))
            {
                this.credit.alpha = 0;
            }
        }
    }
}