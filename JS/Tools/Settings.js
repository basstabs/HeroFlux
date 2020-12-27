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

                	key: 65

                },
                right:
                {

                    key: 68

                },
                up:
                {

                    key: 87

                },
                down:
                {

                    key: 83

                },
                A:
                {

                    key: 74

                },
                B:
                {

                    key: 75

                },
				X:
				{
				
					key: 85
					
				},
				Y:
				{
					
					key: 73
					
				},
				L:
				{
					
					key: 78
					
				},
				R:
				{
					
					key: 77
					
				},
				confirm:
				{
					
					key: 32
					
				},
				pause:
				{
					
					key: 192
					
				}
			
			},
			effectVolume: CONST_DEFAULT_EFFECT_VOLUME,
			musicVolume: CONST_DEFAULT_MUSIC_VOLUME

		};
		
	}
	
	static Save()
	{
	    
	    Settings.Instance().Save();
	    
	}
	
	static Load()
	{
	    
	    Settings.Instance().Load();
	    
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
	
	Save()
	{
	    
	    window.localStorage.setItem("Settings", JSON.stringify(this.data));
	    
	}
	
	Load()
	{
	    
	    var data = window.localStorage.getItem("Settings");
	    if(data !== null)
	    {
	        
	        this.data = JSON.parse(data);
	        
	    }
	    
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
	
	AccessKeyBinding(command)
	{
	    
	    return this.data.keybinds[command].key;
	    
	}
	
	ChangeKeyBinding(command, key)
	{
	    
	    this.data.keybinds[command] = {key: key};
	    
	}
	
	Full()
	{
		
		return this.data;
		
	}
	
}

Settings.m_instance = null;