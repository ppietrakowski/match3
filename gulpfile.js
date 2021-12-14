/**
 * Importowanie bibliotek z NPM-a.
 */
const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const babelify = require("babelify");
const rimraf = require("gulp-rimraf");
const browserSync = require("browser-sync");
const replace = require("gulp-replace");
const args = require("args-parser")(process.argv);
const gulpif = require("gulp-if");
const path = require('path');
const { execSync } = require('child_process');
const log = require('fancy-log');
const { texturepack } = require("texturepack");

const isProduction = args.production || false;

/**
 * Komenda: npx gulp clean
 * Czyszczenie katalogu z zbudowanym projektem gry.
 */
gulp.task("clean", () => gulp.src('./dist/', { allowEmpty: true }).pipe(rimraf()));

/**
 * Kopiuje pliki statyczne związane z plikiem HTML, który jest wymagany do uruchomienia gry.
 */
gulp.task("copy-html", () => gulp.src("./src/html/*").pipe(gulp.dest("./dist/")));

/**
 * Kopiuje katalogi z zasobami wykorzystywanymi z grze.
 */
gulp.task("copy-assets", () => gulp.src("./src/assets/**/*").pipe(gulp.dest("./dist/")));

/**
 * Kopiuje plik silnika Phaser.js wymagany do uruchomienia gry.
 */
gulp.task("copy-phaser", () => gulp.src("./node_modules/phaser/dist/phaser.min.js").pipe(gulp.dest("./dist/")));

/**
 * Komenda: npx gulp build
 * Buduje kod gry z wykorzystaniem nowych standardów języka JavaScript (w tym moduły).  
 */
gulp.task("browserify-scripts", () =>
    browserify({
            entries: './src/main.js',
            debug: true,
            transform: [
                [
                    babelify, {
                        presets: ['@babel/preset-env']
                    }
                ]
            ]
        })
        .bundle()
        .pipe(source('game.min.js'))
        .pipe(buffer())
        .pipe(replace('{{ENV}}', isProduction ? 'prod' : 'dev'))
        .pipe(gulpif(isProduction === false, sourcemaps.init({ loadMaps: true })))
        .pipe(uglify())
        .pipe(gulpif(isProduction === false, sourcemaps.write(".")))
        .pipe(gulp.dest("./dist/"))
);
 
/**
 * Komenda: npx gulp build
 * Buduje grę w katalogu "dist".
 */
gulp.task("build", gulp.series("clean", "copy-html", "copy-assets", "copy-phaser", 'browserify-scripts'));

/**
 * Komenda: npx gulp serve
 * Uruchamia serwer z automatycznym przeładowaniem w przypadku zmiany plików.
 */
gulp.task('serve', () => {
    browserSync({
        server: {
            baseDir: './dist/'
        },
        open: false
    });
    gulp.watch('./src/html/*', gulp.series("copy-html")).on("change", browserSync.reload);
    gulp.watch('./src/assets/**/*', gulp.series("copy-assets")).on("change", browserSync.reload);
    gulp.watch('./src/**/*.js', gulp.series("browserify-scripts")).on("change", browserSync.reload);
})

/**
 * Komenda: npx gulp
 * Domyślna komenda budująca grę oraz uruchamiająca serwer.
 */
gulp.task("default", gulp.series("build", "serve"));

/**
 * Komenda: npx gulp generate-assets
 * Generuje zasoby.
 */
gulp.task("generate-assets", (done) => {
    const inkscape = "/Applications/Inkscape.app/Contents/MacOS/inkscape";
    const groups = ["blue", "red", "yellow", "g271"];
    const input = path.join(__dirname, "src", "resources", "board.svg");
    const maxDpiFactor = 4;
    for (let dpiFactor = 1; dpiFactor <= maxDpiFactor; ++dpiFactor) {
        for (let group of groups) {
            const output = path.join(__dirname, "src", "resources", "@" + dpiFactor, group + ".png");
            const command = `"${inkscape}" --export-id="${group}" --export-dpi=${96*dpiFactor} --export-id-only --export-background-opacity=0 --export-type=png --export-filename="${output}" "${input}"`;
            execSync(command, {stdio: "inherit"});
            log(`The element ${output} has been exported`);
        }
        texturepack({
            folder: path.join("src", "resources", "@" + dpiFactor),
            fileName: "spritesheet@" + dpiFactor,
            outFolder: path.join("src", "assets", "images"),
            packOptions: {
                maxWidth: 2048,
                maxHeight: 2048
            },
        })
            .then(() => log(`Pack@${dpiFactor} successful`));
    }
    done();
})
