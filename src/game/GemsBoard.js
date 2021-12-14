import Gem from "./Gem"

export default class GemsBoard
{
    constructor(scene)
    {
        this.scene = scene;
        this.size = 5;
        this.selectedGem = null;
        this.gems = [];
        this.colors = ["red", "blue", "yellow"];
        for (let y = 0; y < this.size; ++y) {
            this.gems[y] = [];
            for (let x = 0; x < this.size; ++x) {
                this.gems[y][x] = null;
            }
        }
        this.fill();
    }
    fill()
    {
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size; ++x) {
                if (this.gems[y][x] !== null) {
                    continue; // gem jest na pozycji
                }
                do {
                    if (this.gems[y][x] !== null) {
                        this.gems[y][x].destroy();
                    }
                    this.createGem(x, y, this.colors[Math.floor(Math.random() * this.colors.length)]);
                } while (this.verify() !== null);
            }
        }
    }
    verify()
    {
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size; ++x) {
                if (this.gems[y][x] === null) {
                    continue;
                }
                let gems = this.verifyHorizontal(x, y);
                if (gems !== null) {
                    return gems;
                }
                gems = this.verifyVertical(x, y);
                if (gems !== null) {
                    return gems;
                }
            }
        }
        return null;
    }
    verifyHorizontal(x, y)
    {
        let ox = x;
        let counter = 1;
        while (x < this.size - 1 && this.gems[y][++x] !== null && this.gems[y][x].state.color === this.gems[y][ox].state.color) {
            counter++;
        }
        if (counter >= 3) {
            let gems = [];
            for (let i = 0; i < counter; i++) {
                gems.push([ox + i, y])
            }
            return gems;
        }
        return null;
    }
    verifyVertical(x, y)
    {
        let oy = y;
        let counter = 1;
        while (y < this.size - 1 && this.gems[++y][x] !== null && this.gems[y][x].state.color === this.gems[oy][x].state.color) {
            counter++;
        }
        if (counter >= 3) {
            let gems = [];
            for (let i = 0; i < counter; i++) {
                gems.push([x, oy + i])
            }
            return gems;
        }
        return null;
    }
    createGem(x, y, color)
    {
        // tworzenie klejnotu
        let gem = new Gem(this.scene, x, y, color);
        gem.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
            gem.setTint(0x787878);
            this.selectedGem = gem;
        });
        gem.on(Phaser.Input.Events.POINTER_OVER, (pointer) => {
            if (this.selectedGem !== null && this.selectedGem.isNeightbour(gem)) {
                // swap
                this.gems[gem.state.y][gem.state.x] = this.selectedGem;
                this.gems[this.selectedGem.state.y][this.selectedGem.state.x] = gem;
                let x = this.selectedGem.state.x;
                let y = this.selectedGem.state.y;
                this.selectedGem.state.x = gem.state.x;
                this.selectedGem.state.y = gem.state.y;
                gem.state.x = x;
                gem.state.y = y;
                this.selectedGem.updatePosition();
                gem.updatePosition(() => {
                    let promises = [];
                    let points = 0;
                    while (true) {
                        let gems = this.verify();
                        if (gems === null) {
                            break;
                        }
                        points += gems.length;
                        gems.forEach(([x, y]) => {
                            promises.push(this.gems[y][x].remove());
                            this.gems[y][x] = null;
                        })
                    }
                    if (points > 0) {
                        this.scene.add.text(gem.x, gem.y, points * 100);
                    }
                    Promise.all(promises).then(() => {
                        this.fill();
                    });
                });
                this.selectedGem.clearTint();
                this.selectedGem = null;
            }
        });
        this.scene.input.on(Phaser.Input.Events.POINTER_UP, (pointer) => {
            gem.clearTint();
            this.selectedGem = null;
        });
        gem.showUp();
        this.gems[y][x] = gem;
    }
}