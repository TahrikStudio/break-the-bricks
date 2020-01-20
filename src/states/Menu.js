import Phaser from 'phaser'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.backgroundColor = '#0095DD';
  }

  create() {
    this.startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5,
      'button', this.startGame, this, 1, 0, 2);
    this.startButton.anchor.set(0.5);
  }

  startGame() {
    this.startButton.destroy();
    this.state.start('Game', true, false, {level: 0})
  }

}
