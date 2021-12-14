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
        console.log("GameScene has been started.");
        this.cameras.main.setBackgroundColor("#ffffff");
        const gems = new Gems(this);
    }
}
