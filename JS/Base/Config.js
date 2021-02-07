export default
{
      
	type: Phaser.AUTO,
	input: {
	
		gamepad: true
		
	},
    parent: 'game-container',
	width: 480,
    height: 270,
	scale: {
		
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
		
	},
    physics: {
		
		default: "arcade",
		arcade: {
			
			debug: false
			
		}
		
	},
	pixelArt: true
	
};