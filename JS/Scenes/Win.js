import GameScene from "../Base/GameScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";
import UI from "../Base/UILayer.js";

import SoundBoard from "../Tools/SoundBoard.js";

import Score from "../Game/Score.js";
import Input from "../Game/Input.js";

import Title from "../Scenes/Title.js";
import Loader from "../Scenes/Loader.js";

const CONST_WIN_IMAGE = "WinScreen";
const CONST_WIN_ANIMATION_TIME = 1000;

const CONST_WIN_STASH_LINK = "https://sta.sh/21zei9q3ju4y";

const CONST_WIN_IMAGE_DATA = {
	
	x: 0,
	y: 0,
	alpha: 0
	
};

const CONST_UI_WIN_DATA = {
	
	size: "400px",
	color: "#8AF1FF",
	stroke: "#000000",
	thickness: 12,
	alpha: 0,
	targetAlpha: 0.8,
	x: 0.2,
	y: 0.3,
	score:
	{
	
		color: "#F1C321",
		alpha: 0,
		x: 0.6,
		y: 0.3,
		
	},
	link:
	{
		
		size: "200px",
		color: "#F1C321",
		alpha: 0,
		x: 0.15,
		y: 0.1
		
	}
	
}

export default class Win extends GameScene
{
	
	constructor(data)
	{
	
		super("Win");
		
		this.score = 0;
		
		this.animating = false;
		
	}
	
	init(data)
	{
	
		var level = this.cache.json.get("LevelData");
	
		this.score = Score.ComputeScore(level.level);
		
		Loader.Unload(this, data);
		
	}
	
	create()
	{
		
		this.add.image(0, 0, "TitleBackground").setOrigin(0, 0);
		
		Input.Initialize(this.input);
		this.inputInstance = Input.Access();
	
		this.image = this.textures.get(CONST_WIN_IMAGE);
		this.image_index = UI.AddSource(this.image.source[0].source, CONST_WIN_IMAGE_DATA);
		
		UI.AnimateSource(this.image_index, "alpha", 0, 1, CONST_WIN_ANIMATION_TIME, false);
		
		this.text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "Score:", {fontFamily: "chunk", fontSize: CONST_UI_WIN_DATA.size, fill: CONST_UI_WIN_DATA.color, stroke: CONST_UI_WIN_DATA.stroke, strokeThickness: CONST_UI_WIN_DATA.thickness});
		this.text.setOrigin(0.5, 0.5);
		
		this.text_index = UI.AddSource(this.text.canvas, CONST_UI_WIN_DATA);
		
		UI.AnimateSource(this.text_index, "alpha", 0, CONST_UI_WIN_DATA.targetAlpha, CONST_WIN_ANIMATION_TIME, false);
		
		this.score = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, this.score.toString(), {fontFamily: "chunk", fontSize: CONST_UI_WIN_DATA.size, color: CONST_UI_WIN_DATA.score.color, stroke: CONST_UI_WIN_DATA.stroke, strokeThickness: CONST_UI_WIN_DATA.thickness});
		this.score.setOrigin(0.5, 0.5);
		
		this.score_index = UI.AddSource(this.score.canvas, CONST_UI_WIN_DATA.score);
		UI.AnimateSource(this.score_index, "alpha", 0, CONST_UI_WIN_DATA.targetAlpha, CONST_WIN_ANIMATION_TIME, false);
		
		this.link = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_WIN_STASH_LINK, {fontFamily: "chunk", fontSize: CONST_UI_WIN_DATA.link.size, color: CONST_UI_WIN_DATA.link.color, stroke: CONST_UI_WIN_DATA.stroke, strokeThickness: CONST_UI_WIN_DATA.thickness});
		this.link.setOrigin(0.5, 0.5);
		
		this.link_index = UI.AddSource(this.link.canvas, CONST_UI_WIN_DATA.link);
		
		UI.AnimateSource(this.link_index, "alpha", 0, CONST_UI_WIN_DATA.targetAlpha, CONST_WIN_ANIMATION_TIME, false);
		
	}
	
	update()
	{
		
		if(!this.animating && (this.inputInstance.DialogueSkip() || this.inputInstance.DialoguePress()))
		{
			
			SoundBoard.Play("SelectAudio");
			
		   	this.animating = true;
		   
			UI.AnimateSource(this.image_index, "alpha", 1, 0, CONST_WIN_ANIMATION_TIME, true);
			UI.AnimateSource(this.text_index, "alpha", CONST_UI_WIN_DATA.targetAlpha, 0, CONST_WIN_ANIMATION_TIME, true);
			UI.AnimateSource(this.score_index, "alpha", CONST_UI_WIN_DATA.targetAlpha, 0, CONST_WIN_ANIMATION_TIME, true);
			UI.AnimateSource(this.link_index, "alpha", CONST_UI_WIN_DATA.targetAlpha, 0, CONST_WIN_ANIMATION_TIME, true);
			
			this.time.delayedCall(CONST_WIN_ANIMATION_TIME, function()
			{
				
				this.scene.remove("Win");
				this.scene.remove("GameOver");
				
				var title = new Title();
				this.scene.add("Title", title);
		
				this.Start("Title", {});
				
			}, [], this);
			
		}
		
		UI.Update();
		UI.Draw();
		
	}
	
}