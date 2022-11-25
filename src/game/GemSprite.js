export default class GemSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, col, row, color) {
        super(
            scene,
            (10 + row * (64 + 10)) * scene.game.scaleFactor,
            (10 + col * (64 + 10)) * scene.game.scaleFactor,
            "sprites",
            color + ".png"
        );
        scene.add.existing(this);
        this.setOrigin(0, 0);
        this.setState({
            row: row,
            col: col,
            color: color
        });
    }
}