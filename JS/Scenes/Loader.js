import BaseScene from "../Base/Scene.js";

import MathLibrary from "../Tools/Math.js";

import {CONST_LOADER_TEXT_DATA} from "../Constants.js";

export default class Loader extends BaseScene
{
	
	constructor(key)
	{
	
		super(key);

	}
	
	init(data)
	{
		
		this.next_scene = data["next_scene"];
		
		this.data = data["assets"];
		
		this.load_messages = this.cache.json.get("LoadingMessages");
	
		this.sheet_data = [];
		
	}
	
	Load(type, json)
	{
		
		switch (type)
		{
				
			case "image":
				this.LoadImage(json);
				break;
				
			case "spritesheet":
				this.LoadSheet(json);
				break;
				
			case "json":
				this.LoadJSON(json);
				break;
				
			case "sound":
				this.LoadSound(json);
				break;
				
			case "music":
				this.LoadMusic(json);
				break;
				
		}
		
	}
	
	LoadImage(json)
	{
		
		this.load.image(json.id, json.url);
		
	}
	
	LoadSheet(json)
	{
		
		this.load.spritesheet(json.id, json.url, {frameWidth: json.width, frameHeight: json.height});
		
		this.sheet_data.push({id: json.id, data: json.data});
		
	}
	
	LoadJSON(json)
	{
		
		this.load.json(json.id, json.url);
		
	}
	
	LoadSound(json)
	{
		
		this.load.audio(json.id, json.url);
		
	}
	
	LoadMusic(json)
	{
		
		//Use game.cache.isSoundDecoded('music'); if necessary
		this.load.audio(json.id, json.url);
		
	}
	
	preload()
	{
		
		super.preload();
		
		var screenWidth = this.cameras.main.width;
		var screenHeight = this.cameras.main.height;
		
		//Prepare the loading screen
		this.add.image(screenWidth / 2, screenHeight / 4, "Loading");
		
		this.add.image(screenWidth / 2, (3 * screenHeight) / 4, "LoadingFrame");
		var progress = this.add.image(screenWidth / 2, (3 * screenHeight) / 4, "LoadingBar");
		
		progress.setCrop(progress.displayWidth / 2, 0, 4, progress.displayHeight);
		this.load.on("progress", function(value)
		{

			progress.setCrop((progress.displayWidth / 2) - ((progress.displayWidth * value) / 2), 0, progress.width * value, progress.displayHeight);	
			
		});
		
		//Load the data
		for(var i = 0; i < this.data.length; i++)
		{
			
			this.Load(this.data[i].type, this.data[i]);
			
		}
	
		//Display Loading Messages
		this.messages = this.add.text(screenWidth / 2, screenHeight / 2, "", {fontFamily: "silkscreen", fontSize: CONST_LOADER_TEXT_DATA.size, color: CONST_LOADER_TEXT_DATA.color});
		this.messages.setOrigin(0.5, 0.5);
		
		this.message_index = -1;
		this.PickMessage();
		
		//Switch to the next screen once loading is finished
		
		this.load.on("complete", function()
		{
			
			for(var i = 0; i < this.sheet_data.length; i++)
			{
			
				this.PopulateAnimations(this.sheet_data[i].id, this.sheet_data[i].data);
				
			}
			
			this.time.delayedCall(1000, this.Ready, [], this); //Wait 2 seconds to show off loading screen
			
		}.bind(this));
		
	}
	
	PickMessage()
	{
	
		var last_index = this.message_index;
	
		do
		{
		
			this.message_index = MathLibrary.RandomInteger(0, this.load_messages.length);
		
		} 
		while (this.message_index === last_index)
	
		var message = this.load_messages[this.message_index];
		this.messages.setText(message + "...");
		this.messages.alpha = 0;
		
		this.tweens.add({
			targets: this.messages,
			alpha: {
				from: 0,
				to: 1
			},
			duration: 250,
			onComplete: this.FadeMessage,
			callbackScope: this
		});
		
	}
		
	FadeMessage()
	{
	
		this.time.delayedCall(500, function()
		{
		
			this.tweens.add({
				targets: this.messages,
				alpha: {
					from: 1,
					to: 0
				},
				duration: 250,
				onComplete: this.PickMessage,
				callbackScope: this
			});
		
		}, [], this);
	
	}
		
	PopulateAnimations(sheetId, dataId)
	{
		
		var data = this.cache.json.get(dataId);

		for(var i = 0; i < data.animations.length; i++)
		{

			this.anims.create({
				key: data.name + "-" + data.animations[i].name,
				frames: this.CreateFrames(sheetId, data.animations[i].frames),
				frameRate: data.animations[i].frame_rate,
				repeat: data.animations[i].repeat
			});
			
		}
		
	}
	
	CreateFrames(sheetId, frames)
	{
		
		var frame_data = [];
		for(var i = 0; i < frames.length; i++)
		{
			
			frame_data[i] = {frame: frames[i], key: sheetId};
			
		}
		
		return frame_data;
		
	}
	
	Ready()
	{

		this.scene.remove("Preloader");
		
		this.Start(this.next_scene, this.data);
	
	}
	
	create()
	{
		
	}
	
	static Unload(scene, data)
	{
		
		/*Animations are loaded from JSON files that are linked to spritesheets, however
		  We don't want to be too picky about the order in which things are unloaded
		  so we can't guarantee those JSON files will still exist. Thus we need to get
		  the animation data from the scene so we can figure out which ones need to be
		  removed.*/
		var animationData = scene.anims.toJSON().anims;
		
		for(var i = 0; i < data.length; i++)
		{
			
			switch (data[i].type)
			{
				
				case "image":
					//Unload Images by removing from the textures cache
					scene.textures.remove(data[i].id); 
					break;
				
				case "spritesheet":
					//Spritesheets are composed of a texture and animation data, so we need to remove the texture
					scene.textures.remove(data[i].id); 

					//Pick out which animations correspond to this spritesheet so we can remove them
					var animations = animationData.filter(function(val)
					{
						
						/*Our naming convention is that Spritesheet "Key" is given animations
						  with keys matching the format "Key-AnimationName". Therefore if we
						  remove that spritesheet, we remove all of the animations corresponding
						  to it. If your naming convention is different, then modify as necessary.*/
						return (val.key.indexOf(data[i].id + "-") == 0);
						
					});
					
					for(var j = 0; j < animations.length; j++)
					{
						
						scene.anims.remove(animations[j].key);
						
					}
					
					break;
				
				case "json":
					//The cache member of a scene has a bunch of subcaches for most other assets, so remove from there as necessary
					scene.cache.json.remove(data[i].id); 
					break;
				
				case "sound":
					scene.cache.audio.remove(data[i].id);
					break;
				
				case "music":
					scene.cache.audio.remove(data[i].id);
					break;
				
			}
			
		}
		
	}
	
}