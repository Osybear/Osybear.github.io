
BasicGame.Preloader = function (game) {
};

BasicGame.Preloader.prototype = {

	preload: function () {
        this.load.spritesheet('Guy-Run','images/home/Guy-FinalSpriteSheet.png',128,128,19);
	},

	create: function () {
	},

	update: function () {
        this.state.start('Game');
	}
};
