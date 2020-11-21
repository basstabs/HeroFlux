const CONST_DEFAULT_EFFECT_VOLUME = 0.5;
const CONST_DEFAULT_MUSIC_VOLUME = 0.05;

export default class Settings
{

	constructor()
	{
		
		this.data = 
		{
			
			keybinds: {
			
			    left:
                {

                	key: "A"

                },
                right:
                {

                    key: "D"

                },
                up:
                {

                    key: "W"

                },
                down:
                {

                    key: "S"

                },
                A:
                {

                    key: "J"

                },
                B:
                {

                    key: "K"

                },
				X:
				{
				
					key: "U"
					
				},
				Y:
				{
					
					key: "I"
					
				},
				L:
				{
					
					key: "N"
					
				},
				R:
				{
					
					key: "M"
					
				},
				confirm:
				{
					
					key: "SPACE"
					
				},
				pause:
				{
					
					key: "BACKTICK"
					
				}
			
			},
			effectVolume: CONST_DEFAULT_EFFECT_VOLUME,
			musicVolume: CONST_DEFAULT_MUSIC_VOLUME

		};
		
	}
	
	static Instance()
	{
		
		if(!Settings.m_instance)
		{
			
			Settings.m_instance = new Settings();
			
		}
		
		return Settings.m_instance;
		
	}
	
	static EffectVolume(vol)
	{
		
		return Settings.Instance().EffectVolume(vol);
		
	}
	
	static MusicVolume(vol)
	{
		
		return Settings.Instance().MusicVolume(vol);
		
	}
	
	EffectVolume(vol)
	{
		
		if(typeof vol !== "undefined")
		{
			
			this.data.effectVolume = vol;
			
		}
		
		return this.data.effectVolume;
		
	}
	
	MusicVolume(vol)
	{
		
		if(typeof vol !== "undefined")
		{
		
			this.data.musicVolume = vol;
			
		}
		
		return this.data.musicVolume;
		
	}
	
	Populate(json)
	{
		
		this.data = (json ? json : {});
		
	}
	
	Access(key)
	{
		
		return this.data[key];
		
	}
	
	Change(key, value)
	{
	
		this.data[key] = value;
		
	}
	
	Full()
	{
		
		return this.data;
		
	}
	
}

Settings.m_instance = null;