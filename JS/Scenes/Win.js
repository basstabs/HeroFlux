import MenuScene from "../Base/MenuScene.js";
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

export default class Win extends MenuScene
{
	
	constructor(data)
	{
	
		super("Win");
		
		this.score = 0;
		
	}
	
	init(data)
	{

	    var menu_data = this.cache.json.get("ContinueScreen");
		menu_data.background = "TitleBackground";

		super.init(menu_data);

		var level = this.cache.json.get("LevelData");
	
		this.score = Score.ComputeScore(level.level);
		
		Loader.Unload(this, data);
	
		
	}
	
	create()
	{
		
		super.create();
		
	}
	
	update()
	{
		
		super.update();
		
	}
	
	Continue()
	{
	    
	}
	
	Quit()
	{
	    
	    this.Hide();
	    
	    this.time.delayedCall(this.max_animation, function()
		{
				
			this.scene.remove("Win");
			this.scene.remove("GameOver");
				
			var title = new Title();
			this.scene.add("Title", title);
		
			this.Start("Title", {});
			
		}, [], this);
	    
	}
	
}