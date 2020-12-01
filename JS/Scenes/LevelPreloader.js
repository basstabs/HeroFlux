import BaseScene from "../Base/Scene.js";

import Loader from "../Scenes/Loader.js";
import {CONST_UI_LIFE_WIDTH, CONST_UI_LIFE_HEIGHT, CONST_UI_LIFE_PADDING} from "../Scenes/Shmup.js";

export default class LevelPreloader extends BaseScene
{
	
	constructor()
	{
	
		super("LevelPreloader");

	}
	
	init(data)
	{
		
		this.cache.json.add("LevelData", data);
		
		this.level_data = data;
		
	}
	
	preload()
	{
		
		for(var i = 0; i < this.level_data.props.length; i++)
		{
			
			this.load.json("Props/" + this.level_data.props[i].prop, "DB/Data/Props/" + this.level_data.props[i].prop + ".json");
			
		}
		
		for(var i = 0; i < this.level_data.actors.length; i++)
		{
			
			this.load.json("Actors/" + this.level_data.actors[i].actor, "DB/Data/Actors/" + this.level_data.actors[i].actor + ".json");
			
		}
		
		for(var i = 0; i < this.level_data.agents.length; i++)
		{
			
			this.load.json("Agents/" + this.level_data.agents[i].agent, "DB/Data/Agents/" + this.level_data.agents[i].agent + ".json");
			
		}
		
		for(var i = 0; i < this.level_data.effects.length; i++)
		{
			
			this.load.json("Effects/" + this.level_data.effects[i].effect, "DB/Data/Effects/" + this.level_data.effects[i].effect + ".json");
			
		}
		
		this.load.json("PlayerData", "DB/Data/PlayerData.json");
		
		this.load.json(this.level_data.level, "DB/Data/Levels/" + this.level_data.level + ".json");
		
		this.load.on("complete", function()
		{
			
			this.Load();
			
		}.bind(this));
		
	}
	
	Load()
	{
		this.assets = {spritesheets: [], images: [], json: [], sound: [], music: []};
		
		this.PrepareProps();
		this.PrepareActors();
		this.PrepareAgents();
		this.PrepareEffects();
		this.PreparePlayer();
		this.PrepareLevel();
	
		this.assets.spritesheets.push({type: "spritesheet", id: "Life", url: "DB/Images/Spritesheets/" + this.level_data.life + ".png", width: CONST_UI_LIFE_WIDTH - 2 * CONST_UI_LIFE_PADDING, height: CONST_UI_LIFE_HEIGHT, data: "LifeSheet"});
		this.assets.spritesheets.push({type: "json", id: "LifeSheet", url: "DB/Data/Spritesheets/Life.json"});
		
		var preload_data = [];
		preload_data["next_scene"] = "Shmup";
		preload_data["assets"] = this.assets.spritesheets.concat(this.assets.images, this.assets.json, this.assets.sound, this.assets.music);
		
		var preloader = new Loader("Preloader");
		this.scene.add("Preloader", preloader);
		
		this.Start("Preloader", preload_data);
		
		this.scene.remove("LevelPreloader");
		
	}

	PrepareProps()
	{
		
		for(var i = 0; i < this.level_data.props.length; i++)
		{
			
			var json = this.cache.json.get("Props/" + this.level_data.props[i].prop);
		
			if(this.assets.spritesheets.find(function(sprite) { return sprite.id === json.texture; }) === undefined)
			{
			
				this.assets.spritesheets.push({type: "spritesheet", id: json.texture, url: "DB/Images/Spritesheets/" + json.texture + ".png", width: json.width, height: json.height, data: json.texture + "Sheet"});
				this.assets.spritesheets.push({type: "json", id: json.texture + "Sheet", url: "DB/Data/Spritesheets/" + json.texture + ".json"});
			
			}
		
			if(json.death_instruction && this.assets.sound.find(function(sound) { return sound.id === json.death_instruction.audio; }) === undefined)
			{
			
				this.assets.sound.push({type: "sound", id: json.death_instruction.audio, url: "DB/Sound/" + json.death_instruction.audio + ".wav"});
			
			}
		
			if(json.death_instruction && this.assets.images.find(function(image) { return image.id === json.death_instruction.image; }) === undefined)
			{
			
				this.assets.images.push({type: "image", id: json.death_instruction.image, url: "DB/Images/GameOver/" + json.death_instruction.image + ".png"});
			
			}
		
		}
		
	}
	
	PrepareActors()
	{
		
		for(var i = 0; i < this.level_data.actors.length; i++)
		{
			
			var json = this.cache.json.get("Actors/" + this.level_data.actors[i].actor);
		
			if(this.assets.spritesheets.find(function(sprite) { return sprite.id === json.texture; }) === undefined)
			{
			
				this.assets.spritesheets.push({type: "spritesheet", id: json.texture, url: "DB/Images/Spritesheets/" + json.texture + ".png", width: json.width, height: json.height, data: json.texture + "Sheet"});
				this.assets.spritesheets.push({type: "json", id: json.texture + "Sheet", url: "DB/Data/Spritesheets/" + json.texture + ".json"});
			
			}
		
			for(var j = 0; j < json.actor.weapons.length; j++)
			{
			
				var weapon = json.actor.weapons[j];
			
				if(this.assets.json.find(function(json) { return json.id === weapon.weapon; }) === undefined)
				{
				
					this.assets.json.push({type: "json", id: weapon.weapon, url: "DB/Data/Weapons/" + weapon.weapon + ".json"});
				
				}
			
				if(this.assets.sound.find(function(sound) { return sound.id === weapon.audio; }) === undefined)
				{
			
					this.assets.sound.push({type: "sound", id: weapon.audio, url: "DB/Sound/" + weapon.audio + ".wav"});
			
				}
			
			}
			
			if(json.actor.death_instruction && this.assets.sound.find(function(sound) { return sound.id === json.actor.death_instruction.audio; }) === undefined)
			{
			
				this.assets.sound.push({type: "sound", id: json.actor.death_instruction.audio, url: "DB/Sound/" + json.actor.death_instruction.audio + ".wav"});
			
			}
		
			if(json.actor.death_instruction && this.assets.images.find(function(image) { return image.id === json.actor.death_instruction.image; }) === undefined)
			{
			
				this.assets.images.push({type: "image", id: json.actor.death_instruction.image, url: "DB/Images/GameOver/" + json.actor.death_instruction.image + ".png"});
			
			}
		
		}
		
	}
	
	PrepareAgents()
	{
		
		for(var i = 0; i < this.level_data.agents.length; i++)
		{
			
			var json = this.cache.json.get("Agents/" + this.level_data.agents[i].agent);
		
			if(this.assets.spritesheets.find(function(sprite) { return sprite.id === json.texture; }) === undefined)
			{
			
				this.assets.spritesheets.push({type: "spritesheet", id: json.texture, url: "DB/Images/Spritesheets/" + json.texture + ".png", width: json.width, height: json.height, data: json.texture + "Sheet"});
				this.assets.spritesheets.push({type: "json", id: json.texture + "Sheet", url: "DB/Data/Spritesheets/" + json.texture + ".json"});
			
			}
		
			for(var j = 0; j < json.agent.weapons.length; j++)
			{
			
				var weapon = json.agent.weapons[j];
			
				if(this.assets.json.find(function(json) { return json.id === weapon.weapon; }) === undefined)
				{
				
					this.assets.json.push({type: "json", id: weapon.weapon, url: "DB/Data/Weapons/" + weapon.weapon + ".json"});
				
				}
			
				if(this.assets.sound.find(function(sound) { return sound.id === weapon.audio; }) === undefined)
				{
			
					this.assets.sound.push({type: "sound", id: weapon.audio, url: "DB/Sound/" + weapon.audio + ".wav"});
			
				}
			
			}
			
			if(json.agent.death_instruction && this.assets.sound.find(function(sound) { return sound.id === json.agent.death_instruction.audio; }) === undefined)
			{
			
				this.assets.sound.push({type: "sound", id: json.agent.death_instruction.audio, url: "DB/Sound/" + json.agent.death_instruction.audio + ".wav"});
			
			}
		
			if(json.agent.death_instruction && this.assets.images.find(function(image) { return image.id === json.agent.death_instruction.image; }) === undefined)
			{
			
				this.assets.images.push({type: "image", id: json.agent.death_instruction.image, url: "DB/Images/GameOver/" + json.agent.death_instruction.image + ".png"});
			
			}
		
			if(this.assets.sound.find(function(sound) { return sound.id === json.agent.default_death.audio; }) === undefined)
			{
			
				this.assets.sound.push({type: "sound", id: json.agent.default_death.audio, url: "DB/Sound/" + json.agent.default_death.audio + ".wav"});
			
			}
		
			if(this.assets.sound.find(function(sound) { return sound.id === json.agent.empty; }) === undefined)
			{
			
				this.assets.sound.push({type: "sound", id: json.agent.empty, url: "DB/Sound/" + json.agent.empty + ".wav"});
			
			}
			
		}
		
	}
	
	PrepareEffects()
	{
		
		for(var i = 0; i < this.level_data.effects.length; i++)
		{
			
			var json = this.cache.json.get("Effects/" + this.level_data.effects[i].effect);
			
			if(this.assets.spritesheets.find(function(sprite) { return sprite.id === json.texture; }) === undefined)
			{
			
				this.assets.spritesheets.push({type: "spritesheet", id: json.texture, url: "DB/Images/Spritesheets/" + json.texture + ".png", width: json.width, height: json.height, data: json.texture + "Sheet"});
				this.assets.spritesheets.push({type: "json", id: json.texture + "Sheet", url: "DB/Data/Spritesheets/" + json.texture + ".json"});
			
			}
			
			if(json.audio && this.assets.sound.find(function(sound) { return sound.id === json.audio; }) === undefined)
			{
			
				this.assets.sound.push({type: "sound", id: json.audio, url: "DB/Sound/" + json.audio + ".wav"});
			
			}
			
		}
		
	}
	
	PreparePlayer()
	{
	
		var playerData = this.cache.json.get("PlayerData");
		
		if(this.assets.spritesheets.find(function(sprite) { return sprite.id === playerData.texture; }) === undefined)
		{
			
			this.assets.spritesheets.push({type: "spritesheet", id: playerData.texture, url: "DB/Images/Spritesheets/" + playerData.texture + ".png", width: playerData.width, height: playerData.height, data: playerData.texture + "Sheet"});
			this.assets.spritesheets.push({type: "json", id: playerData.texture + "Sheet", url: "DB/Data/Spritesheets/" + playerData.texture + ".json"});
			
		}
		
		for(var i = 0; i < playerData.agent.weapons.length; i++)
		{
			
			var weapon = playerData.agent.weapons[i];
			
			if(this.assets.json.find(function(json) { return json.id === weapon.weapon; }) === undefined)
			{
				
				this.assets.json.push({type: "json", id: weapon.weapon, url: "DB/Data/Weapons/" + weapon.weapon + ".json"});
				
			}
			
			if(this.assets.sound.find(function(sound) { return sound.id === weapon.audio; }) === undefined)
			{
			
				this.assets.sound.push({type: "sound", id: weapon.audio, url: "DB/Sound/" + weapon.audio + ".wav"});
			
			}
			
		}
		
		if(this.assets.sound.find(function(sound) { return sound.id === playerData.agent.default_death.audio; }) === undefined)
		{
			
			this.assets.sound.push({type: "sound", id: playerData.agent.default_death.audio, url: "DB/Sound/" + playerData.agent.default_death.audio + ".wav"});
			
		}
		
		if(this.assets.sound.find(function(sound) { return sound.id === playerData.agent.empty; }) === undefined)
		{
			
			this.assets.sound.push({type: "sound", id: playerData.agent.empty, url: "DB/Sound/" + playerData.agent.empty + ".wav"});
			
		}
		
	}
	
	PrepareLevel()
	{
		
		var levelData = this.cache.json.get(this.level_data.level);
		
		if(this.assets.images.find(function(image) { return image.id === levelData.background; }) === undefined)
		{
			
			this.assets.images.push({type: "image", id: levelData.background, url: "DB/Images/Backgrounds/" + levelData.background + ".png"});
			
		}
		
		levelData = levelData.level;
		
		for(var i = 0; i < levelData.stages.length; i++)
		{
			
			if(levelData.stages[i].music && this.assets.music.find(function(music) { return music.id === levelData.stages[i].music; }) === undefined)
			{
				
				this.assets.music.push({type: "music", id: levelData.stages[i].music, url: "DB/Music/" + levelData.stages[i].music + ".mp3"});
				
			}
			
			if(levelData.stages[i].type === "dialogue")
			{
				
				for(var j = 0; j < levelData.stages[i].script.length; j++)
				{
					
					if(this.assets.images.find(function(image) { return image.id === levelData.stages[i].script[j].speaker; }) === undefined)
					{
						
						this.assets.images.push({type: "image", id: levelData.stages[i].script[j].speaker, url: "DB/Images/Dialogue/" + levelData.stages[i].script[j].speaker + ".png"});
						
					}
					
				}
				
			}
			
		}
		
	}
	
}