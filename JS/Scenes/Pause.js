import BaseScene from "../Base/Scene.js";

import Input from "../Game/Input.js";

import {CONST_PAUSE_TEXT_DATA} from "../Constants.js";

export default class Pause extends BaseScene
{
	
	constructor()
	{
	
		super("Pause");
		
	}
	
	preload()
	{
		
	}
	
	create()
	{
				
		Input.Initialize(this.input);
		
		var screenWidth = this.cameras.main.width;
		var screenHeight = this.cameras.main.height;
		
		this.paused = this.add.text(screenWidth / 2, screenHeight / 2, "Paused", {fontFamily: "silkscreen", fontSize: CONST_PAUSE_TEXT_DATA.size, color: CONST_PAUSE_TEXT_DATA.color});
		this.paused.setOrigin(0.5, 0.5);	
		
	}

	update()
	{
		
		if(Input.Access().DialogueSkip())
		{
			
			this.Unpause();
			
		}
		
	}
	
	Unpause()
	{
		
		this.scene.remove("Pause");
		
		this.scene.resume("Shmup");
		
	}
	
}