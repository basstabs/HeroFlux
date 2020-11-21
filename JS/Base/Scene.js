import Logger from "../Tools/Logger.js";
import SoundBoard from "../Tools/SoundBoard.js";

import UI from "../Base/UILayer.js";

export default class BaseScene extends Phaser.Scene
{
	
	constructor(type)
	{
	
		super(type);
		
	}
	
	preload()
	{
		
	}
	
	create()
	{
		
	}

	Transition(scene)
	{
		
		UI.Clear();
		
	}
	
	Start(scene, data)
	{
	
		this.Transition(scene);
		
		this.scene.start(scene, data);
	
	}
	
}