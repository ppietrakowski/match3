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
        this.load.audio('DnD1', 'sounds/src_assets_sounds_cristalDragDrop1.mp3');
        this.load.audio('DnD2', 'sounds/src_assets_sounds_cristalDragDrop2.mp3');
        this.load.audio('score', 'sounds/src_assets_sounds_score2.mp3')
        
    }
    create ()
    {
        console.log("GameScene has been started.");
        this.cameras.main.setBackgroundColor("#ffffff");
        const game=new GemsBoard(this);
            game.create();
    }
}
