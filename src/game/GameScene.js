import Gems from "./Gems";
import GemSprite from "./GemSprite";

export default class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super("GameScene");
    }
    preload()
    {
        this.load.atlas(
            'sprites',
            'images/' + this.game.getScaleSuffix('spritesheet.png'),
            'images/' + this.game.getScaleSuffix('spritesheet.json')
        );
    }
    create ()
    {
        //this.cameras.main.
        console.log("GameScene has been started.");
        this.cameras.main.setBackgroundColor("#ffffff");
        const bg = this.add.image(this.cameras.main.centerX,this.cameras.main.centerY,"sprites", "g271.png");


        const gems = new Gems(this);
    }
}
