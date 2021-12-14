import GemsBoard from "./GemsBoard";

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
        this.add.image(this.cameras.main.centerX,this.cameras.main.centerY,"sprites", "g271.png");
        new GemsBoard(this);
    }
}
