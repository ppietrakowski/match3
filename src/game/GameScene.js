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
        this.load.audio('DnD', 'sounds/src_assets_sounds_cristalDragDrop.mp3');
        this.load.audio('score', 'sounds/src_assets_sounds_score.mp3')
        
    }
    create ()
    {
        console.log("GameScene has been started.");
        this.cameras.main.setBackgroundColor("#ffffff");
        const game=new GemsBoard(this);
            game.create();
    }
}
