import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";

import Settings from "../Tools/Settings.js";
import SoundBoard from "../Tools/SoundBoard.js";

import Title from "../Scenes/Title.js";
import Remap from "../Scenes/Remap.js";

const CONST_EFFECT_MULTIPLIER = 1;
const CONST_MUSIC_MULTIPLIER = 0.25;

export default class Options extends MenuScene
{
	
	constructor()
	{
	
		super("Options");
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("OptionsScreen");
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
	
	}
	
	EffectVolume()
	{
		
		return Settings.EffectVolume() / CONST_EFFECT_MULTIPLIER;
		
	}
	
	MusicVolume()
	{
		
		return Settings.MusicVolume() / CONST_MUSIC_MULTIPLIER;
		
	}
	
	SetEffects(vol)
	{
	
	    Settings.EffectVolume(vol * CONST_EFFECT_MULTIPLIER);
		
		SoundBoard.UpdateEffectVolume(vol * CONST_EFFECT_MULTIPLIER);
		
	}
	
	SetMusic(vol)
	{
		
		Settings.MusicVolume(vol * CONST_MUSIC_MULTIPLIER);
		
		SoundBoard.UpdateMusicVolume(vol * CONST_MUSIC_MULTIPLIER);
		
	}
	
	Remap(controller)
	{
	    
	    this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Options");
			this.scene.add("Remap", Remap);
		
			this.Start("Remap", {"controller": controller});
		
		}, [], this);
		
	}
	
	Back()
	{
		
		super.Hide();
		
		Settings.Save();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Options");
			this.scene.add("Title", Title);
		
			this.Start("Title");
		
		}, [], this);

	}
	
}