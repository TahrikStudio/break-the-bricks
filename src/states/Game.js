/* globals __DEV__ */
import Phaser from 'phaser'
import config from '../config'
import Util from '../Util'

export default class extends Phaser.State {
  consturctor() {
    this.ball;
  }
  preload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.backgroundColor = '#eee';
  }

  init (data) {
    this.level = (data.level || 0) % config.LEVEL_COUNT;
    this.lives = data.lives || config.MAX_LIVES;
    this.score = data.score || 0;
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.ball = this.game.add.sprite(this.game.world.width * 0.5, this.game.world.height * 0.8 - 10, 'ball');
    this.ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
    this.ball.anchor.set(0.5);
    this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.body.velocity.set(150, -150);
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.set(1);
    this.game.physics.arcade.checkCollision.down = false;

    this.ball.checkWorldBounds = true;
    this.ball.events.onOutOfBounds.add(this.ballLeaveScreen, this);

    this.paddle = this.game.add.sprite(this.game.world.width * 0.5, this.game.world.height * 0.8, 
      `paddle-${Util.randomInt(2) + 1}`
    );
    this.paddle.anchor.set(0.5);
    this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);
    this.paddle.body.immovable = true;

    

    this.scoreText = game.add.text(10, 5, `Score: ${this.score}`, { font: '14px', fill: '#000' });
    this.levelText = game.add.text(10, 25, `Level: ${this.level + 1}`, { font: '14px', fill: '#000' });
    this.livesText = game.add.text(game.world.width - 10, 5, `Lives: ${this.lives}`, { font: '14px', fill: '#000' })
    this.livesText.anchor.set(1, 0);

    this.lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.7, 'Life lost, click to continue', { font: '18px', fill: '#000' });
    this.lifeLostText.anchor.set(0.5);
    this.lifeLostText.visible = false;

    this.initBricks();
  }

  update() {
    this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle, null, this);
    this.game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);
    this.paddle.x = this.game.input.x || this.game.world.width * 0.5;
  }

  ballHitPaddle() {
    game.sound.play('hit');
    this.ball.animations.play('wobble');
  }

  ballLeaveScreen() {
    this.lives -= 1;
    if (this.lives == 0) {
      game.sound.play('game-over');
      this.gameOver = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.7, "Game Over");
      this.gameOver.anchor.set(0.5);

      game.input.onDown.addOnce(() => {
        this.state.start('Menu');
      }, this);
    } else {
      game.sound.play('lost');
      this.lifeLostText.visible = true;
      this.livesText.setText(`Lives: ${this.lives}`);
      this.ball.reset(game.world.width * 0.5, game.world.height * 0.8 - 15);
      this.paddle.reset(game.world.width * 0.5, game.world.height * 0.8);

      game.input.onDown.addOnce(function () {
        this.lifeLostText.visible = false;
        this.ball.body.velocity.set(150, -150);
      }, this)
    }
  }

  ballHitBrick(ball, brick) {
    game.sound.play('collect');
    this.ball.animations.play('wobble');
    var killTween = this.add.tween(brick.scale);
    killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function () {
      brick.destroy();
      let alive_count = 0;
      for (let i = 0; i < this.bricks.children.length; i += 1) {
        if (this.bricks.children[i].alive) {
          alive_count += 1;
        }
      }
      console.log(alive_count);

      if (alive_count == 0) {
        game.sound.play('level-clear');
        this.success = this.game.add.text(
          this.game.world.width * 0.5, this.game.world.height * 0.5, "Level Completed"
        );
        this.success.anchor.set(0.5);
        this.proceed = this.game.add.text(
          this.game.world.width * 0.5, this.game.world.height * 0.5 + 20, "Tap to proceed..",
          {font: '18px Arial'}
        );
        this.proceed.anchor.set(0.5);

        this.ball.body.enable = false;

        game.input.onDown.addOnce(function () {
          this.state.restart('Game', false, {
            level: this.level + 1,
            score: this.score,
            lives: this.lives
          });
        }, this);
      }
    }, this);
    killTween.start();

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  initBricks() {
    this.brickInfo = {
      width: 50,
      height: 20,
      offset: {
        top: 80,
        left: 40
      },
      padding: 10
    };

    let jsonData = this.cache.getJSON('data');
    
    this.bricks = this.add.group();
    for (let r = 0; r < jsonData.levels[this.level + 1].layout.length; r++) {
      for (let c = 0; c < jsonData.levels[this.level + 1].layout[r].length; c++) {
        var brickX = (c * (this.brickInfo.width + this.brickInfo.padding)) + this.brickInfo.offset.left;
        var brickY = (r * (this.brickInfo.height + this.brickInfo.padding)) + this.brickInfo.offset.top;
        console.log(brickX, brickY);
        var newBrick = this.game.add.sprite(brickX, brickY, `block-${jsonData.levels[this.level + 1].layout[r][c]}`);
        this.game.physics.enable(newBrick, Phaser.Physics.ARCADE);
        newBrick.body.immovable = true;
        newBrick.anchor.set(0.5);
        this.bricks.add(newBrick);
      }
    }
  }
}
