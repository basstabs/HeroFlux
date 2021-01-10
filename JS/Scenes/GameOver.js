import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";
import UI from "../Base/UILayer.js";

import Title from "../Scenes/Title.js";
import Loader from "../Scenes/Loader.js";

import Input from "../Game/Input.js";
import Score from "../Game/Score.js";

import SoundBoard from "../Tools/SoundBoard.js";

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
	targetAlpha: 0.5,
	x: 0.2,
	y: 0.1
	
}

const CONST_GAMEOVER_TEXT = "Depowered!";

export default class GameOver extends MenuScene
{
	
	constructor(data)
	{
	
		super("GameOver");
		
		this.text = null;
		this.text_index = -1;
		
		this.image = null;
		this.image_index = -1;
		
	}
	
	init(data)
	{
		
	    var menu_data = this.cache.json.get("ContinueScreen");
        menu_data = JSON.parse(JSON.stringify(menu_data));
        
		menu_data.music = "GameOverMusic";
		
		super.init(menu_data);
		
		this.image = data.image;
		this.remove = data.remove;
		
		Score.WipeScore();
		
	}

	create()
	{
		
		super.create();
		
		if(this.image)
		{
			
			this.image = this.textures.get(this.image);
			
		}
		else
		{
			
			this.image = this.textures.get(CONST_GAMEOVER_DEFAULT_IMAGE);
			
		}
		
		this.image_index = UI.AddSource(this.image.source[0].source, CONST_GAMEOVER_IMAGE_DATA);
		
		UI.AnimateSource(this.image_index, "alpha", 0, 1, this.max_animation, false);
		
		this.text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_GAMEOVER_TEXT, {fontFamily: "plasma", fontSize: CONST_UI_GAMEOVER_DATA.size, fill: CONST_UI_GAMEOVER_DATA.color, stroke: CONST_UI_GAMEOVER_DATA.stroke, strokeThickness: CONST_UI_GAMEOVER_DATA.thickness});
		this.text.setOrigin(0.5, 0.5);
		
		this.text_index = UI.AddSource(this.text.canvas, CONST_UI_GAMEOVER_DATA);
		
		UI.AnimateSource(this.text_index, "alpha", 0, CONST_UI_GAMEOVER_DATA.targetAlpha, this.max_animation, false);
			
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
				
			Loader.Unload(this, this.remove);
				
		}, [], this);
	    
	}
	
}