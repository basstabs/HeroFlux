import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";

import Settings from "../Tools/Settings.js";
import SoundBoard from "../Tools/SoundBoard.js";

import Title from "../Scenes/Title.js";

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
		
		SoundBoard.UpdateEffectVolume(vol * CONST_EFFECT_MULTIPLIER);
		
	}
	
	SetMusic(vol)
	{
		
		SoundBoard.UpdateMusicVolume(vol * CONST_MUSIC_MULTIPLIER);
		
	}
	
	Back()
	{
		
		super.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Options");
			this.scene.add("Title", Title);
		
			this.Start("Title");
		
		}, [], this);

	}
	
}