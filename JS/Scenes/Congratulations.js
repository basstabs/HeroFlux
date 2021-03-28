import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";
import UI from "../Base/UILayer.js";

import Title from "../Scenes/Title.js";

const CONST_STASH_LINK = "https://sta.sh/2tmt454o4ig";

export default class Congratulations extends MenuScene
{
	
	constructor()
	{
	
		super("Congratulations");
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("CongratulationsScreen");
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
	
	}
	
	Continue()
	{
		
		this.Hide();
				
		this.time.delayedCall(this.max_animation, function()
		{
				
			this.scene.remove("Congratulations");
			this.scene.add("Title", Title);
		
			this.Start("Title");
				
		}, [], this);
		
	}
	
	Copy()
	{
		
		var text = document.createElement("textarea");
		document.body.appendChild(text);
    	text.value = CONST_STASH_LINK;
    	text.select();
    	document.execCommand("copy");
    	document.body.removeChild(text);
		
	}
	
}