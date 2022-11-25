export default class Gem extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, color) {
        super(
            scene,
            (32 + x * 64) * scene.game.scaleFactor,
            (32 + y * 64) * scene.game.scaleFactor,
            "sprites",
            color + ".png"
        );
        scene.add.existing(this);
        this.setState({
            color: color,
            x: x,
            y: y
        });
        this.setInteractive({ pixelPerfect: true });
    }
    isNeightbour(anotherGem) {
        return (this.state.x === anotherGem.state.x && this.state.y + 1 === anotherGem.state.y)
            || (this.state.x === anotherGem.state.x && this.state.y - 1 === anotherGem.state.y)
            || (this.state.x + 1 === anotherGem.state.x && this.state.y === anotherGem.state.y)
            || (this.state.x - 1 === anotherGem.state.x && this.state.y === anotherGem.state.y);
    }
    updatePosition(cb) {
        this.disableInteractive();
        this.scene.tweens.add({
            targets: this,
            x: (32 + this.state.x * 64) * this.scene.game.scaleFactor,
            y: (32 + this.state.y * 64) * this.scene.game.scaleFactor,
            ease: 'Bounce',
            duration: 500,
            onComplete: () => {
                this.setInteractive();
                if (cb) cb();
            }
        });
    }
    remove() {
        this.disableInteractive();
        return new Promise(resolve => {
            this.scene.tweens.add({
                targets: this,
                scaleX: 0.01,
                scaleY: 0.01,
                ease: 'Bounce',
                duration: 300,
                onComplete: () => {
                    resolve();
                    this.destroy();
                }
            });
        });
    }
    showUp() {
        this.scene.tweens.add({
            targets: this,
            scaleX: { from: 0.01, to: 1 },
            scaleY: { from: 0.01, to: 1 },
            ease: 'Bounce',
            duration: 300
        });
    }
}