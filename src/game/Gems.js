import GemSprite from "./GemSprite";

export default class Gems
{
    constructor (scene)
    {
        this.gems = [];
        this.scene = scene;
        this.colors = ["red", "blue", "yellow"];
        this.fieldSize = 5;
        this.createGemsArray();
    }
    createGemsArray()
    {
        this.gemsArray = [];
        for (let col = 0; col < this.fieldSize; ++col) {
            this.gemsArray[col] = [];
            for (let row = 0; row < this.fieldSize; ++row) {
                do {
                    if (this.gemsArray[col][row]) {
                        this.gemsArray[col][row].destroy();
                    }
                    this.gemsArray[col][row] = this.createRandomGem(row, col);
                } while (this.isMatchrow, col));
            }
        }
    }
    getGemColorAt(row, col)
    {
        if(row < 0 || row >= this.fieldSize || col < 0 || col >= this.fieldSize){
            return null;
        }
        return this.gemsArray[col][row].state.color;
    }
    isMatch(row, col)
    {
        return this.isHorizontalMatch(row, col) || this.isVerticalMatch(row, col);
    }
    isHorizontalMatch(row, col)
    {
        return this.getGemColorAt(row, col) == this.getGemColorAt(row, col - 1)
            && this.getGemColorAt(row, col) == this.getGemColorAt(row, col - 2);
    }
    isVerticalMatch(row, col)
    {
        return this.getGemColorAt(row, col) == this.getGemColorAt(row - 1, col)
            && this.getGemColorAt(row, col) == this.getGemColorAt(row - 2, col);
    }
    createRandomGem(row, col)
    {
        let gem = new GemSprite(this.scene, row, col, this.colors[Phaser.Math.Between(0, this.colors.length - 1)]);
        gem.setInteractive({
            pixelPerfect: true,
            draggable: true,
            dropZone: true
        });
        gem.on(Phaser.Input.Events.POINTER_OVER, (pointer) => {
            gem.setTint(0x787878);
            gem.input.draggable = true;
        });
        gem.on(Phaser.Input.Events.POINTER_OUT, (pointer) => {
            gem.clearTint();
        });
        gem.on(Phaser.Input.Events.DRAG, (pointer, dragX, dragY) => {
            gem.x = dragX;
            gem.y = dragY;
        });
        gem.on(Phaser.Input.Events.DRAG_START, () => {
            
            this.scene.children.bringToTop(gem);
        });

        gem.on(Phaser.Input.Events.DRAG_END, (pointer, dragX, dragY, dropped) => {
            if (! dropped) {
                gem.x = gem.input.dragStartX;
                gem.y = gem.input.dragStartY;
            }
            gem.input.draggable = false;
        });

        gem.on(Phaser.Input.Events.DRAG_ENTER, (pointer, gameObject, dropZone) => {
            dropZone.setTint(0x787878);
        });
        return gem;
    }
}