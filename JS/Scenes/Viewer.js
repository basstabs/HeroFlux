import MenuScene from "../Base/MenuScene.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";

import SaveData from "../Game/SaveData.js";

const CONST_FONT = {fontFamily: "chunk", fontSize: "125px", color: "#888888"};
const CONST_LOCKED_DATA = {"x": 0.45, "y": 0.48, "alpha": 1};

export default class Viewer extends MenuScene
{
	
	constructor()
	{
	
		super("Viewer");
		
		this.current = 0;
		
		this.image = null;
		this.index = -1;
		
		this.locked_text = null;
		
	}
	
	init(data)
	{
		
		var menu_data = this.cache.json.get("ViewerScreen");
		menu_data = JSON.parse(JSON.stringify(menu_data));
		
		this.data = data;
		
		super.init(menu_data);
		
	}
	
	preload()
	{
		
		this.loadedSheets = [];
		
		for(var i = 0; i < this.data.length; i++)
		{
			
			if(this.data[i].type === "image")
			{
				
				this.load.image(this.data[i].key, "DB/Images/" + this.data[i].key + ".png");
				
			}
			else
			{
				
				if(!this.loadedSheets.includes(this.data[i].key))
				{
					
					this.load.spritesheet(this.data[i].key, "DB/Images/Spritesheets/" + this.data[i].key + ".png", this.data[i].dimensions);
					this.loadedSheets.push(this.data[i].key);
				
				}
				
			}
			
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
	
	create()
	{
		
		super.create();
		
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#000000");
		
		for(var i = 0; i < this.data.length; i++)
		{
			
			if(this.data[i].type !== "image")
			{
				
				this.anims.create({key: this.data[i].animation_key,
						frames: this.CreateFrames(this.data[i].key, this.data[i].frames),
						frameRate: this.data[i].frameRate,
						repeat: -1
				});
				
			}
			
		}
		
		this.locked_text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "Locked", CONST_FONT);
		this.index = UI.AddSource(this.locked_text.canvas, CONST_LOCKED_DATA);
		
		this.image = this.add.sprite(Config.width / 2, Config.height / 2, "Player").anims.play("Idle");
		this.image.setOrigin(0.5, 0.5);
		this.image.setVisible(false);
		this.image.setScale(2);
		
		this.SelectView(0);
		
	}
	
	SelectView(index)
	{
	    
		var forward = (index >= this.current);
		this.current = index;
	    
		var entry = this.data[this.current];
		
		UI.UpdateSource(this.index, null, null);
		this.image.setVisible(false);
		
		for(var i = 0; i < entry.requirements.length; i++)
		{
			
			if(SaveData.Score(entry.requirements[i]) === 0)
			{
				
				this.SelectLocked();
				
				return;
				
			}
			
		}
		
		if(entry.type === "image")
		{
			
			this.SelectImage(entry.key);
			
		}
		else
		{
			
			this.SelectAnimation(entry.key, entry.animation_key);
			
		}
		
	}
	
	SelectLocked()
	{
		
		UI.UpdateSource(this.index, this.locked_text.canvas, CONST_LOCKED_DATA);
		
	}
	
	SelectImage(key)
	{
		
		var image = this.textures.get(key);
		
		UI.UpdateSource(this.index, image.source[0].source, {"x": 0.5 - ((image.source[0].source.width / 2) / CONST_UI_WIDTH), "y": 0, "alpha": 1});
		
	}
	
	SelectAnimation(texture, animation)
	{
	
		this.image.setVisible(true);
		
		this.image.setTexture(texture);
		this.image.anims.play(animation);
		
	}
	
	Next()
	{
	    
	    this.SelectView((this.current + 1) % this.data.length);
	    
	}
	
	Previous()
	{
	    
	    this.SelectView(((this.current - 1) + this.data.length) % this.data.length); //Scumbag Javascript uses negative remainders like an idiot
	    
	}
	
	Hide()
	{
		
		super.Hide();
		
	}
	
	Back()
	{

					
		UI.AnimateSource(this.index, "alpha", 1, 0, 500, true);
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{

			UI.Unstash();
			
			this.scene.remove("Viewer");
		
			for(var i = 0; i < this.data.length; i++)
			{
				
				if(this.data[i].type === "image")
				{
				
					this.textures.remove(this.data[i].key); 
				
				}
				else
				{
					
					this.anims.remove(this.data[i].animation_key);
				
				}
				
			}
			
			for(var i = 0; i < this.loadedSheets.length; i++)
			{
				
				this.textures.remove(this.data[i].key);
				
			}
			
			this.scene.resume("Gallery");
		
		}, [], this);

	}
	
}