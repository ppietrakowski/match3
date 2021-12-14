export default class BootScene extends Phaser.Scene
{
    constructor ()
    {
        super("BootScene");
    }
    create ()
    {
        console.log("BootScene has been started.");
        this.time.addEvent({
            delay: 0,
            callback: () => this.game.scene.start('GameScene')
        });
    }
}
