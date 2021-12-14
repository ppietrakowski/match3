// Importowanie skryptu Stats.js
// @see https://github.com/mrdoob/stats.js/
import Stats from 'stats.js'

// Import scen gry.
import BootScene from "./game/BootScene"
import GameScene from "./game/GameScene"

/**
 * Dodałem własną klasę gry, która rozszerza standardową klasę `Phaser.Game`.
 * Dzięki temu mogę w łatwy sposób rozszerzać grę o nowe funkcje.
 */
class Game extends Phaser.Game
{
    constructor()
    {
        /**
         * Standardowa konfiguracja gry przekazywana do konstruktora klasy `Phaser.Game`.
         * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/
         */
        const width = 960; // Domyślna szerokość dla gier publikowanych w serwisie itch.io.
        const height = 540; // Domyślna wysokość dla gier publikowanych w serwisie itch.io.
        const maxScaleFactor = 4;
        const minScaleFactor = 1;
        super({
            type: Phaser.AUTO,
            width: width, 
            height: height, 
            /**
             * Konfiguracja skalowania gry.
             * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scalemanager/
             */
            scale: {
                mode: Phaser.Scale.ScaleModes.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        });
        // Wyliczanie współczynnika skalowania, tzn. o ile większy obraz widzi użytkownik od założonej szerokości i wysokości.
        this.scale.once("resize", (gameSize, baseSize, displaySize, previousWidth, previousHeight) => {
            this.scaleFactorX = Math.ceil(displaySize.width / gameSize.width);
            this.scaleFactorY = Math.ceil(displaySize.height / gameSize.height);
            this.scaleFactor = Math.min(maxScaleFactor, Math.max(minScaleFactor, Math.max(this.scaleFactorX, this.scaleFactorY)));
            this.scale.setZoom(1 / this.scaleFactor);
            this.scale.setGameSize(
                width * this.scaleFactor,
                height * this.scaleFactor
            );
        });
        this.scaleFactorX = 1;
        this.scaleFactorY = 1;
        this.scaleFactor = 1;
        /**
         * Środowisko budowania gry. Skrypt gulp-a podmienia tą wartość w momencie uruchomienia.
         */
        this.ENV = '{{ENV}}';
        // Monitoruj tylko jeżeli jesteśmy w środowisku deweloperskim.
        if (this.ENV === 'dev') {
            this.setupStatsJS();
        }
        
        // Dodawanie scen gry, pamiętaj aby je zaimportować na początku pliku!
        // @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scenemanager/
        this.scene.add("BootScene", BootScene, true);
        this.scene.add("GameScene", GameScene, false);
    }
    setupStatsJS()
    {
        const stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);
        this.events.on(Phaser.Core.Events.PRE_STEP, () => {
            stats.begin();
        });
        this.events.on(Phaser.Core.Events.POST_RENDER, () => {
            stats.end();
        });
    }
    getScaleSuffix(filename)
    {
        const extension = /(?:\.([^.]+))?$/.exec(filename)[1];
        const name = filename.substring(0, filename.length-extension.length-1);
        return `${name}@${this.scaleFactor}.${extension}`;
    }
}


/**
 * W tym miejscu uruchamiamy grę, a właściwie dzieje się to po wczytaniu wszystkich niezbędnych plików (kod gry i Phaser-a).
 */
window.onload = () => {
    // Obiekt gry jest udostępniony przez własność `window.game`. Można z niej korzystać w dowolnym miejscu kodu.
    window.game = new Game();
}
