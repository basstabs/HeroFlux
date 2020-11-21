import GameScene from "../Base/GameScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";
import UI from "../Base/UILayer.js";

import Title from "../Scenes/Title.js";
import Loader from "../Scenes/Loader.js";

import Input from "../Game/Input.js";
import Score from "../Game/Score.js";

import SoundBoard from "../Tools/SoundBoard.js";

const CONST_GAMEOVER_ANIMATION_TIME = 1000;

const CONST_GAMEOVER_DEFAULT_IMAGE = "GameOverImage";

const CONST_GAMEOVER_IMAGE_DATA = {
	
	x: 0,
	y: 0,
	alpha: 0
	
};

const CONST_UI_GAMEOVER_DATA = {
	
	size: "400px",
	color: "#aa0000",
	stroke: "#000000",
	thickness: 12,
	alpha: 0,
	targetAlpha: 0.75,
	x: 0.2,
	y: 0.1
	
}

const CONST_GAMEOVER_TEXT = "Depowered!";

export default class GameOver extends GameScene
{
	
	constructor(data)
	{
	
		super("GameOver");
		
		this.text = null;
		this.text_index = -1;
		
		this.image = null;
		this.image_index = -1;
		
		this.animating = false;
		
	}
	
	init(data)
	{
		
		this.image = data.image;
		this.remove = data.remove;
		
		Score.WipeScore();
		
	}

	create()
	{
		
		Input.Initialize(this.input);
		this.inputInstance = Input.Access();
		
		if(this.image)
		{
			
			this.image = this.textures.get(this.image);
			
		}
		else
		{
			
			this.image = this.textures.get(CONST_GAMEOVER_DEFAULT_IMAGE);
			
		}
		
		this.image_index = UI.AddSource(this.image.source[0].source, CONST_GAMEOVER_IMAGE_DATA);
		
		UI.AnimateSource(this.image_index, "alpha", 0, 1, CONST_GAMEOVER_ANIMATION_TIME, false);
		
		this.text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_GAMEOVER_TEXT, {fontFamily: "plasma", fontSize: CONST_UI_GAMEOVER_DATA.size, fill: CONST_UI_GAMEOVER_DATA.color, stroke: CONST_UI_GAMEOVER_DATA.stroke, strokeThickness: CONST_UI_GAMEOVER_DATA.thickness});
		this.text.setOrigin(0.5, 0.5);
		
		this.text_index = UI.AddSource(this.text.canvas, CONST_UI_GAMEOVER_DATA);
		
		UI.AnimateSource(this.text_index, "alpha", 0, CONST_UI_GAMEOVER_DATA.targetAlpha, CONST_GAMEOVER_ANIMATION_TIME, false);
			
	}
	
	update()
	{
		
		if(!this.animating && (this.inputInstance.DialogueSkip() || this.inputInstance.DialoguePress()))
		{
			
			SoundBoard.Play("SelectAudio");
			
		   	this.animating = true;
		   
			UI.AnimateSource(this.image_index, "alpha", 1, 0, CONST_GAMEOVER_ANIMATION_TIME, true);
			UI.AnimateSource(this.text_index, "alpha", CONST_UI_GAMEOVER_DATA.targetAlpha, 0, CONST_GAMEOVER_ANIMATION_TIME, true);
			
			this.time.delayedCall(CONST_GAMEOVER_ANIMATION_TIME, function()
			{
				
				this.scene.remove("GameOver");
				this.scene.remove("Win");
				
				var title = new Title();
				this.scene.add("Title", title);
		
				this.Start("Title", {});
				
				Loader.Unload(this, this.remove);
				
			}, [], this);
			
		}
		
		UI.Update();
		UI.Draw();
		
	}
	
}