import config from "./Base/Config.js";
import AudioScene from "./Base/AudioScene.js";

import Timer from "./Tools/Timer.js";
import SoundBoard from "./Tools/SoundBoard.js";

import Boot from "./Scenes/Boot.js";
import Title from "./Scenes/Title.js";

import UI from "./Base/UILayer.js";

class App extends Phaser.Game
{
	
	constructor()
	{
		
		super(config);
		
		Timer.Hook(this);
		
		this.scene.add("Audio", AudioScene);
		this.scene.add("Boot", Boot);
		this.scene.add("Title", Title);
	
		this.scene.start("Audio");
		this.scene.start("Boot");
	
		this.scale.on('resize', Resize);
		UI.Initialize();
		
		UI.Resize(this.scale.displaySize.width, this.scale.displaySize.height);
		
	}
	
}

window.game = new App();

function Resize(gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight)
{
	
	UI.Resize(displaySize.width, displaySize.height);
	
}