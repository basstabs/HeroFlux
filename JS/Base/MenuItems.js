import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";

import SoundBoard from "../Tools/SoundBoard.js";
import Logger from "../Tools/Logger.js";

const CONST_MENU_ITEM_TEXT = "text";
const CONST_MENU_ITEM_SLIDER = "slider";

export class MenuItem extends Phaser.GameObjects.Zone
{
	
	constructor(scene, x, y, width, height, displayData)
	{
		
		super(scene, x * Config.width, y * Config.height, width * Config.width, height * Config.height);
				
		this.displayData = displayData;
		this.index = -1;
		
		this.active = true;
		
	}
	
	static Factory(scene, json)
	{
		
		var newItem = null;
		
		switch (json.type)
		{
				
			case CONST_MENU_ITEM_TEXT:
				newItem =  new TextMenuItem(scene, json.text, json.x, json.y, json.display, json.method, json.arg);
				break;
			
			case CONST_MENU_ITEM_SLIDER:
				newItem = new SliderMenuItem(scene, json.image, json.pointer, json.x, json.y, json.display, json.method, json.defaultValue);
				break;
				
		}
		
		return newItem;
		
	}
	
	Display()
	{
		
		Logger.LogError("Attempting to call virtual Display method on abstract MenuItem");
		
	}
	
	Highlight()
	{
		
		Logger.LogError("Attempting to call virtual Highlight method on abstract MenuItem");
		
	}
	
	Dim()
	{
		
		Logger.LogError("Attempting to call virtual Dim method on abstract MenuItem");
		
	}
	
	Activate(pointer)
	{
		
		Logger.LogError("Attempting to call virtual Activate method on abstract MenuItem");
		
	}
	
	Hide()
	{
	
		Logger.LogError("Attempting to call virtual Hide method on abstract MenuItem");
		
	}
	
	Off()
	{
		
		this.active = false;
		
	}
	
	On()
	{
		
		this.active = true;
		
	}
	
	static Animate(index, displayData)
	{
		
		var max = -1;
		
		for(var i = 0; i < displayData.animations.length; i++)
		{
			
			var animation = displayData.animations[i];
			UI.AnimateSource(index, animation.key, animation.start, animation.target, animation.time, false);
			
			max = Math.max(max, animation.time);
			
		}

		return max;
		
	}
	
	static ReverseAnimate(index, displayData)
	{
		
		var max = -1;
		
		for(var i = 0; i < displayData.animations.length; i++)
		{
			
			var animation = displayData.animations[i];
			UI.AnimateSource(index, animation.key, animation.target, animation.start, animation.time, true);
			
			max = Math.max(max, animation.time);
			
		}

		return max;
		
	}
	
}

export class SliderMenuItem extends MenuItem
{
	
	constructor(scene, image, pointer, x, y, displayData, method, defaultValue)
	{
		
		var texture = scene.textures.get(image);
		
		var widthScale = texture.source[0].width / CONST_UI_WIDTH;
		var heightScale = texture.source[0].height / CONST_UI_HEIGHT;
		
		super(scene, x, y, widthScale, heightScale, displayData);
		
		this.setOrigin(0, 0);
		
		this.texture = texture;
		this.pointerTexture = scene.textures.get(pointer);
		
		this.method = method;
	
		this.rawX = x;
		this.rawY = y;
		this.rawWidth = widthScale;
		this.rawHeight = heightScale;
		
		this.percent = scene[defaultValue]();
		
		scene.physics.world.enable(this, 0); //Display Zone Debug
		
	}
	
	Display()
	{
		
		this.index = UI.AddSource(this.texture.source[0].source, this.displayData.start);
		this.pointerIndex = UI.AddSource(this.pointerTexture.source[0].source, { x: this.displayData.start.x + (this.percent * this.rawWidth) - (this.pointerTexture.source[0].width / 2) / CONST_UI_WIDTH, y: this.displayData.start.y, alpha: this.displayData.start.alpha });
		
		var max = MenuItem.Animate(this.index, this.displayData);
		MenuItem.Animate(this.pointerIndex, this.displayData);
		
		return max;
		
	}
	
	Highlight()
	{
		
	}
	
	Dim()
	{
		
	}
	
	Activate(pointer)
	{
	
		if(!this.scene.closing)
		{
			
			this.percent = (pointer.x - (this.rawX * Config.width)) / (this.rawWidth * Config.width);
			
			UI.UpdateSource(this.pointerIndex, null, {x: this.displayData.start.x + (this.percent * this.rawWidth) - (this.pointerTexture.source[0].width / 2) / CONST_UI_WIDTH});
			
			this.scene[this.method](this.percent);
			
			SoundBoard.Play("SelectAudio");
		
		}
		
	}
	
	Hide()
	{
	
		MenuItem.ReverseAnimate(this.index, this.displayData);
		MenuItem.ReverseAnimate(this.pointerIndex, this.displayData);
		
	}
	
}

export class TextMenuItem extends MenuItem
{
	
	constructor(scene, textData, x, y, displayData, method, arg)
	{

		var text = scene.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, textData.text, textData.font);
		
		var widthScale = text.displayWidth / CONST_UI_WIDTH;
		var heightScale = text.displayHeight / CONST_UI_HEIGHT;
		
		super(scene, x, y, widthScale, heightScale, displayData)
		
		this.setOrigin(0, 0);

		this.text = text;
		this.font = textData.font;
		
		this.method = method;
		
		this.rawX = x;
		this.rawY = y;
		
		this.arg = arg;
		
		scene.physics.world.enable(this, 0); //Display Zone Debug
		
	}
	
	Display()
	{
		
		this.index = UI.AddSource(this.text.canvas, this.displayData.start);
		
		return MenuItem.Animate(this.index, this.displayData);
		
	}
	
	Highlight()
	{
		
		if(this.active)
		{
			
			this.text.setColor(this.font.highlight);
		
		}
		
	}
	
	Dim()
	{
		
		if(this.active)
		{
			
			this.text.setColor(this.font.color);
		
		}
		
	}
	
	Activate(pointer)
	{
	
		if(!this.scene.closing && this.active)
		{
			
			SoundBoard.Play("SelectAudio");
			
			this.scene[this.method](this.arg);
		
		}
		
		if(!this.scene.closing && !this.active)
		{
			
			SoundBoard.Play("CancelAudio");
			
		}
		
	}
	
	Hide()
	{
		
		MenuItem.ReverseAnimate(this.index, this.displayData);
		
	}
	
}