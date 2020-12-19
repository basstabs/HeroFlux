import MenuScene from "../Base/MenuScene.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";

import Settings from "../Tools/Settings.js";
import SoundBoard from "../Tools/SoundBoard.js";

import SaveData from "../Game/SaveData.js";

import Title from "../Scenes/Title.js";

export default class Options extends MenuScene
{
	
	constructor()
	{
	
		super("Feats");
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("FeatsScreen");
		data = JSON.parse(JSON.stringify(data));
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
		
	}
	
	Hide()
	{
		
		super.Hide();
		
	}
	
	Back()
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Feats");
			this.scene.add("Title", Title);
		
			this.Start("Title");
		
		}, [], this);

	}
	
}