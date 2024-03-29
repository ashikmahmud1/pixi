//luke Goodridge
//1408298 Mobile Tech

document.addEventListener("DOMContentLoaded", function () {

    class Scene extends PIXI.Stage {

        constructor(background) {
            super(background);
            this.paused = false;
            this.buttonStyle = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 22,
                fill: "white",
                stroke: '#ff3300',
                strokeThickness: 4,
                dropShadow: true,
                dropShadowColor: "#000000",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
            });
        }
        updateCB() {

        }
        onUpdate() {
            this.updateCB()
        }
        update() {
            this.updateCB();
        }
        pause() {
            this.paused = true;
        }
        resume() {
            this.paused = false;
        }
        isPaused() {
            return this.paused;
        }
        control(){
            let leftKey = $("#left");
            let rightKey = $("#right");
            let newKey = $("#new");
            let spaceKey = $("#space");

            leftKey.on("touchstart", (event)=> {
                ScenesManager.scenes["game"].paddle.left = true;
            });
            leftKey.on("touchend", (event) => {
                ScenesManager.scenes["game"].paddle.left = false;
            });
            rightKey.on("touchstart", (event)=> {
                ScenesManager.scenes["game"].paddle.right = true;
            });
            rightKey.on("touchend", (event) => {
                ScenesManager.scenes["game"].paddle.right = false;
            });
            newKey.on("touchstart", () => {
               location.reload();
            });
            spaceKey.on("touchstart", () => {
                ScenesManager.currentScene.isPaused() ?
                    ScenesManager.currentScene.resume() :
                    ScenesManager.currentScene.pause();
            });

            document.addEventListener('keyup', (event) => {
                event.preventDefault();
                if (event.key === 'ArrowLeft') {
                    ScenesManager.scenes["game"].paddle.left = false;
                }
                else if (event.key === 'ArrowRight') {
                    ScenesManager.scenes["game"].paddle.right = false;
                }
            }, false);

            document.addEventListener('keydown', (event) => {
                event.preventDefault();
                if (event.key === 'ArrowLeft') {
                    ScenesManager.scenes["game"].paddle.left = true;
                }
                else if (event.key === 'ArrowRight') {
                    ScenesManager.scenes["game"].paddle.right = true;
                }
            }, false);
            document.addEventListener("keydown", (event) => {
                if (event.keyCode === 32) {
                    if(ScenesManager.currentScene.isPaused()) {
                        this.resume()
                    } else {
                        this.pause()
                    }
                }
            })
        }

        showLeaderBoardButton(x, y, width, height) {
            this.leaderboardButton = new Button(x, y, width, height);
            this.leaderboardButton.setText("LeaderBoard", this.buttonStyle);
            this.addChild(this.leaderboardButton);
            this.leaderboardButton.clicked = () => {
                window.location = "./leaderboard.html";
            };
        }

        showMenuButton(x, y, width, height) {
            this.menuButton = new Button(x, y, width, height);
            this.menuButton.setText("Menu", this.buttonStyle);
            this.addChild(this.menuButton);
            this.menuButton.clicked = () => {
                if (this.isPaused()) return;
                ScenesManager.scenes["game"].updateLives(true);
                ScenesManager.scenes["game"].updateScore(0);
                ScenesManager.goToScene('menu');
            };
        }

        showPlayButton(x, y, width, height) {
            this.playButton = new Button(x, y, width, height);
            this.playButton.setText("Play", this.buttonStyle);
            this.addChild(this.playButton);
            this.playButton.clicked = () => {
                if (this.isPaused()) return;
                game.reset();
                ScenesManager.goToScene('game');
            };
        }

        showMessage(text, style, x, y){
            let message = new PIXI.Text(text, style);
            message.position.set(x, y);
            this.addChild(message);
        }
    }

    class ScenesManager {

        static create(width, height) {
            if (ScenesManager.renderer) return this;
            ScenesManager.defaultWidth = width;
            ScenesManager.defaultHeight = height;
            ScenesManager.renderer = new PIXI.autoDetectRenderer(ScenesManager.defaultWidth, ScenesManager.defaultHeight);
            document.getElementById("renderer").appendChild(ScenesManager.renderer.view);
            requestAnimationFrame(ScenesManager.loop);
            return this;
        }
        static loop() {
            requestAnimationFrame(() => { ScenesManager.loop() });
            if (!ScenesManager.currentScene || ScenesManager.currentScene.isPaused()) return;
            ScenesManager.currentScene.update();
            ScenesManager.renderer.render(ScenesManager.currentScene);
        }
        static createScene(id, TScene) {
            if (ScenesManager.scenes[id]) return undefined;
            let scene = TScene ? new TScene() : new Scene();
            ScenesManager.scenes[id] = scene;
            return scene;
        }
        static goToScene(id){
            if (ScenesManager.scenes[id]) {
                if (ScenesManager.currentScene) ScenesManager.currentScene.pause();
                ScenesManager.currentScene = ScenesManager.scenes[id];
                ScenesManager.currentScene.resume();
                return true;
            }
            return false;
        }
    }
    ScenesManager.scenes = {};

    class Button extends PIXI.Sprite {

        constructor(x, y, width, height) {
            super();
            this._text =  PIXI.Text;
            this._cb = Function;
            this.create(x, y, width, height);
        }

        create(x, y, width, height) {
            // generate the texture
            let gfx = new PIXI.Graphics();
            gfx.beginFill(0xffffff, 1);
            gfx.drawRoundedRect(0, 0, width, height, height / 5);
            gfx.endFill();
            this.texture = gfx.generateCanvasTexture();

            // set the x, y and anchor
            this.x = x;
            this.y = y;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            // create the text object
            this._text = new PIXI.Text("", 'arial');
            this._text.anchor = new PIXI.Point(0.5, 0.5);
            this.addChild(this._text);

            // set the interactivity to true and assign callback functions
            this.interactive = true;

            this.on("mousedown", () => {
                this.onDown();
            }, this);

            this.on("mouseup", () => {
                this.onUp();
            }, this);

            this.on("touchstart", () => {
                this.onDown();
            }, this);

            this.on("touchend", () => {
                this.onUp();
            }, this);

            this.on("mouseover", () => {
                this.onHover();
            }, this);

            this.on("mouseout", () => {
                this.onOut();
            }, this);
        }

        setText(val, style) {
            // Set text to be the value passed as a parameter
            this._text.text = val;
            // Set style of text to the style passed as a parameter
            this._text.style = style;
        }

        onDown() {
            this.y += 5;
            this.tint = 0xffffff;
        }

        onUp() {
            if(typeof(this._cb) === 'function') {
                this._cb();
            }
            this.y -= 5;
            this.tint = 0xEEEE44;
        }

        onHover() {
            this.tint = 0xEEEE44;
            this.scale.x = 1.2;
            this.scale.y = 1.2;
        }

        onOut() {
            this.tint = 0xffffff;
            this.scale.x = 1;
            this.scale.y = 1;
        }

        get clicked() {
            return this._cb;
        }

        set clicked(cb) {
            this._cb = cb;
        }
    }

    class Paddle {
        constructor() {
            this.right = false;
            this.left = false;
            this.speed = 8;
            this.margin = 5;
        }

        init(renderer, texture) {;
            this.texture = texture;
            this.sprite = new PIXI.Sprite(this.texture);
            this.renderer = renderer;
            this.startPosition();
        }

        startPosition() {
            this.sprite.position.set((this.renderer.width - this.sprite.width) / 2 ,(this.renderer.height - this.sprite.height)- 30)
        };

        update() {
            if (this.right && !this.left &&
                this.sprite.position.x + this.sprite.width <= this.renderer.width - this.margin) {
                this.sprite.position.x += this.speed;
            }
            else if (this.left && !this.right &&
                this.sprite.position.x >= this.margin && !this.right) {
                this.sprite.position.x -= this.speed;
            }
        };
    }

    class Ball {
        constructor() {
            let gameSpeed = $("#gameSpeed").val();
            this.defaultSpeed = parseInt(gameSpeed);
            this.startingPosition = {
                x: 200, y: 300
            };
            this.speed = {
                x: this.defaultSpeed,
                y: this.defaultSpeed
            };
        }

        init(renderer, texture) {
            this.texture = texture;
            this.sprite = new PIXI.Sprite(this.texture);
            this.renderer = renderer;
            this.startPosition()
        }

        startPosition() {
            this.sprite.position.set(this.startingPosition.x, this.startingPosition.y);
            this.speed.x = this.defaultSpeed;
            this.speed.y = this.defaultSpeed;
        }

        static checkCollision(a, b) {

            return a.position.y + a.height > b.position.y &&
                a.position.y < b.position.y + b.height &&
                a.position.x + a.width > b.position.x &&
                a.position.x < b.position.x + b.width;
        }

        paddleCollision(element) {
            if (Ball.checkCollision(this.sprite, element)) {
                ScenesManager.currentScene.wallSnd.play();
                this.speed.y = -this.defaultSpeed;
            }
        }

        bricksCollision(bricks, stage) {
            for (let b = 0; b < bricks.bricks.length; b++) {
                if (Ball.checkCollision(this.sprite, bricks.bricks[b])) {
                    this.speed.y = -this.speed.y;
                    bricks.destroy(bricks.bricks[b], stage);
                }
            }
        }

        update(scene){
            this.sprite.position.x += this.speed.x;
            this.sprite.position.y += this.speed.y;

            if (this.sprite.position.x + this.sprite.width > this.renderer.width ||
                this.sprite.position.x < 0) {
                this.speed.x = -this.speed.x;
            }
            else if (this.sprite.position.y < 0) {
                this.speed.y = -this.speed.y;
            }
            else if (this.sprite.position.y + this.sprite.height > this.renderer.height) {
                scene.pause();
                ScenesManager.currentScene.updateLives();
                if(ScenesManager.currentScene.isLive()) {
                    game.reset(true);
                    game.resume();
                } else {
                    ScenesManager.currentScene.overSnd.play();
                    ScenesManager.goToScene("gameOver");
                    saveUserResult(game.userName, game.score);
                }
            }
        }
    }

    class Bricks {
        constructor() {
            this.bricks = [];
            this.rows = 5;
            this.colors = [
                '0xFF0000',
                '0x00FF00',
                '0x7777FF',
                '0xFF00FF',
                '0x00FFFF'
            ]
        }

        init(renderer, texture, stage) {
            this.texture = texture;
            this.renderer = renderer;
            this.numInRow = Math.floor(this.renderer.width/this.texture.width) - 1;
            this.totalWidth = this.texture.width * this.numInRow;
            this.startPosX = (this.renderer.width - this.totalWidth)/2;
            this.reset(stage);
        }
        addBricksToStage(stage) {
            for (let i = 0; i < this.bricks.length; i++) {
                stage.addChild(this.bricks[i]);
            }
        }
        destroy(brick, stage) {
            ScenesManager.currentScene.brickSnd.play();
            let index = this.bricks.indexOf(brick);
            if (index > -1) {
                this.bricks.splice(index, 1);
                ScenesManager.currentScene.updateScore(10);
            }
            stage.removeChild(brick);
            if(this.bricks.length === 0) {
                ScenesManager.goToScene("win");
                saveUserResult(game.userName, game.score);
            }
        }
        reset(stage) {
            for (let i = 0; i < this.bricks.length; i++) {
                stage.removeChild(this.bricks[i]);
            }

            this.bricks = [];
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.numInRow; col++) {
                    let b = new PIXI.Sprite(this.texture);
                    b.tint = this.colors[row % this.colors.length];
                    b.position.set(this.startPosX + col * this.texture.width, (2 + row) * this.texture.height);
                    this.bricks.push(b);
                }
            }
        }
    }

    class GameScene extends Scene {

        constructor() {
            super();
            this.paddle = new Paddle();
            this.ball = new Ball();
            this.bricks = new Bricks();
            this.lives = 3;
            this.score = 0;
            this.brickSnd = new Howl({ urls: ["assets/audiofiles/brick.wav"] });
            this.wallSnd = new Howl({ urls: ["assets/audiofiles/collision.wav"] });
            this.overSnd = new Howl({ urls: ["assets/audiofiles/over.mp3"] });

            PIXI.loader
                .add('brick', 'assets/images/brick.png')
                .add('paddle', 'assets/images/paddle.png')
                .add('ball', 'assets/images/ball.png')
                .load((loader, resources) => {
                    this.paddle.init(ScenesManager.renderer, resources.paddle.texture);
                    this.ball.init(ScenesManager.renderer, resources.ball.texture);
                    this.bricks.init(ScenesManager.renderer, resources.brick.texture, this);
                    this.addChild(this.paddle.sprite);
                    this.addChild(this.ball.sprite);
                    this.bricks.addBricksToStage(this);
                });
            this.control();
        }

        update() {
            super.update();
            this.paddle.update();
            this.ball.paddleCollision(this.paddle.sprite);
            this.ball.update(this);
            this.ball.bricksCollision(this.bricks, this);
        }

        reset(alive=false) {
            if(alive) {
                this.ball.startPosition();
                this.paddle.startPosition();
            } else {
                this.ball.startPosition();
                this.paddle.startPosition();
                this.bricks.reset(this);
                this.bricks.addBricksToStage(this);
            }
        }

        updateScore(value){
            if(!value) {
                this.score = 0;
            } else {
                this.score += 10;
            }
            $("#scoreValue").text(this.score);
        }

        updateLives(reset=false) {
            if(reset){
                this.lives = 3;
            } else {
                this.lives -= 1;
            }
            $("#livesCount").text(this.lives);
        }

        isLive() {
            return this.lives;
        }

        control() {
            super.control();
        }
    }

    class IntroScene extends Scene {

        constructor() {
            super();
            this.logo = new PIXI.Sprite.fromImage("assets/images/rsz_1loading.png");
            this.addChild(this.logo);
            this.logo.scale.x = ScenesManager.defaultWidth / 250;
            this.logo.scale.y = this.logo.scale.x;
            this.logo.anchor.x = 0.5;
            this.logo.anchor.y = 0.5;
            this.logo.alpha = 0;
            // move the sprite to the center of the screen
            this.logo.position.set(ScenesManager.defaultWidth / 2, ScenesManager.defaultHeight /2);
        }

        update() {
            super.update();
            if (this.logo.alpha < 1) {
                this.logo.alpha += 0.01;
            }
            else {
                ScenesManager.goToScene('menu');
            }
        }
    }

    class MenuScene extends Scene {

        constructor() {
            super();
            this.showPlayButton(
                ScenesManager.defaultWidth/2,
                ScenesManager.defaultHeight/2,
                150,
                75
            );
            this.showLeaderBoardButton(
                ScenesManager.defaultWidth * 0.5,
                ScenesManager.defaultHeight * 0.5 + 90,
                150,
                75
            );
        }

        update() {
            super.update();
        }
    }

    class GameOver extends Scene {
        constructor(){
            super();
            this.showMenuButton(
                ScenesManager.defaultWidth/2,
                ScenesManager.defaultHeight/2 + 50,
                150,
                75
            );
            this.showLeaderBoardButton(
                ScenesManager.defaultWidth * 0.5,
                ScenesManager.defaultHeight * 0.5 + 130,
                150,
                75
            );
            this.message = "Game Over!";
            this.style = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 36,
                fill: "white",
                stroke: '#ff3300',
                strokeThickness: 4,
                dropShadow: true,
                dropShadowColor: "#000000",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
            });
            this.showMessage(
                this.message,
                this.style,
                ScenesManager.defaultWidth /2 - 100,
                ScenesManager.defaultHeight / 2 - 80
            );
        }
    }
    class Win extends Scene {
        constructor(){
            super();
            this.showMenuButton(
                ScenesManager.defaultWidth/2,
                ScenesManager.defaultHeight/2 + 50,
                150,
                75
            );
            this.showLeaderBoardButton(
                ScenesManager.defaultWidth * 0.5,
                ScenesManager.defaultHeight * 0.5 + 130,
                150,
                75
            );
            this.message = "You are WIN!";
            this.style = new PIXI.TextStyle({
                fontFamily: "Arial",
                fontSize: 36,
                fill: "white",
                stroke: '#007A00',
                strokeThickness: 4,
                dropShadow: true,
                dropShadowColor: "#000000",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
            });
            this.showMessage(
                this.message,
                this.style,
                ScenesManager.defaultWidth /2 - 100,
                ScenesManager.defaultHeight / 2 - 80
            );
        }
    }

    function saveUserResult(userName, scores) {
        let data = localStorage.getItem("resultTable");
        data = JSON.parse(data);
        if(userName in data) {
            if(data[userName]["scores"] < scores) {
                data[userName]["scores"] = scores;
            }
        } else {
            data[userName] = {};
            data[userName]["userName"] = userName;
            data[userName]["scores"] = scores;
        }
        data = JSON.stringify(data);
        localStorage.setItem("resultTable", data);
    }

    let game, intro, gameOver, win;
    if(!localStorage.getItem("resultTable")){
        localStorage.setItem("resultTable", JSON.stringify({}));
    }

    $("#gameStart").on("touchstart click", function () {
        let userName = $("#userName").val();
        $(".auth").css({"z-index": -1});
        saveUserResult(userName, 0);
        $(".center").text(userName);
        //get reference of ScenesManager;
        let scenesManager = ScenesManager;
        //create
        scenesManager.create(919, 768, true);
        //create a the game scene
        game = scenesManager.createScene('game', GameScene);
        game.userName = userName;
        intro = scenesManager.createScene('intro', IntroScene);
        gameOver = scenesManager.createScene('gameOver', GameOver);
        win = scenesManager.createScene('win', Win);
        scenesManager.createScene('menu', MenuScene);
        scenesManager.goToScene('intro');
    });
});