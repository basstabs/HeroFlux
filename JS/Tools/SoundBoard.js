import Logger from "../Tools/Logger.js";
import Settings from "../Tools/Settings.js";

export default class SoundBoard
{

	constructor()
	{
		
		this.sound_volume = Settings.EffectVolume();
		this.music_volume = Settings.MusicVolume();
		
		this.sound_config = {};
		this.music_config = {};
		
		this.scene = null;
		
		this.music_key = null;
		
	}

	Initialize(scene)
	{
		
		this.sound_config.mute = false;
		this.sound_config.volume = this.sound_volume;
		this.sound_config.loop = false;
		
		this.music_config.mute = false;
		this.music_config.volume = this.music_volume;
		this.music_config.loop = false;
		
		if(this.music)
		{
			
			this.music.stop();
			this.music.destroy();
			
		}
		
		this.music_key = null;
		this.music = null;
		
		this.scene = scene;
		
	}
	
	static Initialize(scene)
	{
		
		SoundBoard.m_global.Initialize(scene);
		
	}
		
	Play(key)
	{
		
		if(key)
		{
			
			this.scene.sound.play(key, this.sound_config);
		
		}
		else
		{
			
			Logger.LogWarning(key + " sound effect was not set.");
			
		}
		
	}
	
	Music(key)
	{
	
		if(key !== this.music_key && key)
		{
		
			if(this.music_key && this.music)
			{
				
				this.music.destroy();
			
			}
					
			this.music_key = key;
			
			this.music = this.scene.sound.add(this.music_key);
			this.music.play("", this.music_config);
			this.music.on("complete", function()
			{
				
				this.scene.time.delayedCall(3000, function()
				{
					
					this.music.play("", this.music_config);
					
				}, [], this);
				
			}, this);
			
		}
		
	}
	
	StopMusic()
	{
		
		if(this.music)
		{
			
			this.music.stop();
			this.music.destroy();
			
		}
		
		this.music_key = null;
		this.music = null;
		
	}
	
	UpdateEffectVolume(vol)
	{
		
		this.sound_volume = vol;
		this.sound_config.volume = vol;
		
		Settings.EffectVolume(vol);
		
	}
	
	UpdateMusicVolume(vol)
	{
		
		this.music_volume = vol;
		this.music_config.volume = vol;
		
		Settings.MusicVolume(vol);
	
		if(this.music)
		{
			
			this.music.setVolume(vol);
			
		}
		
	}
	
	static Play(key)
	{
		
		SoundBoard.m_global.Play(key);
		
	}

	static Music(key)
	{
	
		SoundBoard.m_global.Music(key);
	
	}
	
	static UpdateEffectVolume(vol)
	{
		
		if(typeof vol !== "undefined")
		{
			
			SoundBoard.m_global.UpdateEffectVolume(vol);
			
			return;	
			
		}
		
		SoundBoard.m_global.UpdateEffectVolume(Settings.EffectVolume());
		
	}
	
	static UpdateMusicVolume(vol)
	{
	
		if(typeof vol !== "undefined")
		{
			
			SoundBoard.m_global.UpdateMusicVolume(vol);
			
			return;	
			
		}
		
		SoundBoard.m_global.UpdateMusicVolume(Settings.MusicVolume());
		
	}
	
}

SoundBoard.m_global = new SoundBoard();