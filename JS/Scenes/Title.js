import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";

import LevelSelect from "../Scenes/LevelSelect.js";
import Loader from "../Scenes/Loader.js";
import Options from "../Scenes/Options.js";
import Feats from "../Scenes/Feats.js";

import SaveData from "../Game/SaveData.js";

import {CONST_TITLE_SCREEN_DATA} from "../Constants.js";

export default class Title extends MenuScene
{
	
	constructor()
	{
	
		super("Title");
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("TitleScreen");
		
		super.init(data);
		
		SaveData.LoadData(this);
		
	}
	
	create()
	{
		
		super.create();
	
		this.image = this.textures.get("TitleImage");
		this.imageIndex = UI.AddSource(this.image.source[0].source, CONST_TITLE_SCREEN_DATA.image);
		UI.AnimateSource(this.imageIndex, "alpha", 0, 1, CONST_TITLE_SCREEN_DATA.time, false);
		
		this.logo = this.textures.get("Logo");
		this.logoIndex = UI.AddSource(this.logo.source[0].source, CONST_TITLE_SCREEN_DATA.logo);
		UI.AnimateSource(this.logoIndex, "x", CONST_TITLE_SCREEN_DATA.logo.x, CONST_TITLE_SCREEN_DATA.logo.targetX, CONST_TITLE_SCREEN_DATA.time, false);
		UI.AnimateSource(this.logoIndex, "alpha", 0, 1, CONST_TITLE_SCREEN_DATA.time, false);
	
	}
	
	Hide()
	{
		
		super.Hide();
		
		UI.AnimateSource(this.imageIndex, "alpha", 1, 0, CONST_TITLE_SCREEN_DATA.time, true);
		UI.AnimateSource(this.logoIndex, "alpha", 1, 0, CONST_TITLE_SCREEN_DATA.time, true);
		UI.AnimateSource(this.logoIndex, "x", CONST_TITLE_SCREEN_DATA.logo.targetX, CONST_TITLE_SCREEN_DATA.logo.x, CONST_TITLE_SCREEN_DATA.time, true);
		
	}
	
	Play()
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Title");
			
			this.scene.add("LevelSelect", LevelSelect);
			
			this.Start("LevelSelect");
		
		}, [], this);

	}
	
	Upgrades()
	{
	    
	    this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Title");
		
			this.scene.add("Upgrades", Upgrades);
			this.Start("Upgrades", {preserve: false});
			
		}, [], this);
	    
	}
	
	Feats()
	{
	    
	    this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Title");
		
			this.scene.add("Feats", Feats);
			this.Start("Feats", {preserve: false});
			
		}, [], this);
	    
	}
	
	Gallery()
	{
	    
	    this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Title");
		
			this.scene.add("Gallery", Gallery);
			this.Start("Gallery", {preserve: false});
			
		}, [], this);
	    
	}
	
	Options()
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Title");
		
			this.scene.add("Options", Options);
			this.Start("Options", {preserve: false});
			
		}, [], this);

	}
	
}