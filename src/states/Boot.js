import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config';

export default class extends Phaser.State {
  preload() {
    this.stage.backgroundColor = '#fff';
    this.load.image('preloadbar', '/assets/images/loader.png')

  }

  update() {
      this.state.start('Splash')
  }
}
