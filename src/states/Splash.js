import Phaser from 'phaser'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.stage.backgroundColor = '#fff';
    
    this.loader = this.add.sprite(game.world.width * 0.5, game.world.height * 0.6, 'preloadbar');
    this.loader.anchor.set(0.5);
    this.load.setPreloadSprite(this.loader);

    this.load.spritesheet('button', '/assets/images/button.png', 120, 40);
    this.load.image('paddle-1', '/assets/images/paddle-1.svg');
    this.load.image('paddle-2', '/assets/images/paddle-2.svg');
    
    this.load.image('ball', '/assets/images/ball.png');
    this.load.json('data', '/assets/data/level-map.json');
    this.load.pack('audios', '/assets/data/resource.json');
    this.load.pack('blocks', '/assets/data/resource.json');
    this.load.pack('backgrounds', '/assets/data/resource.json');

    // this.load.onLoadComplete.add(() => {
    //   this.loader.destroy();
    // }, this);
  }

  update() {
    this.state.start('Menu')
  }

}
