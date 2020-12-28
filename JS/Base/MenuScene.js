import BaseScene from "../Base/Scene.js";
import {MenuItem, TextMenuItem} from "../Base/MenuItems.js";
import UI from "../Base/UILayer.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";

import SaveData from "../Game/SaveData.js";

import SoundBoard from "../Tools/SoundBoard.js";

import {CONST_CURRENCY_DATA} from "../Constants.js";

export default class MenuSceen extends BaseScene
{
	
	constructor(type)
	{
	
		super(type);
		
		this.menu_data = [];
		
		this.text = [];
		
		this.menu_items = [];
		
		this.max_animation = -1;
		this.closing = false;
		
	}
	
	init(data)
	{
		
		this.menu_data = data;
		
		this.background_image = data.background;
		
		this.music = data.music;
		
	}
	
	preload()
	{
		
		super.preload();
		
	}
	
	create()
	{
		
		if(this.background_image)
		{
		
		    this.add.image(0, 0, this.background_image).setOrigin(0, 0);
		
		}
		
		SoundBoard.Music(this.music);
		
		if(this.menu_data.currency)
		{
		    
		    this.CreateCurrency();
		    
		}
		
		for(var i = 0; i < this.menu_data.text.length; i++)
		{
			
			var text = this.menu_data.text[i];
			
			var textObj = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, text.text, text.font);
		
			text.index = UI.AddSource(textObj.canvas, text.display.start);
			
			this.max_animation = Math.max(MenuItem.Animate(text.index, text.display), this.max_animation);
			
			this.text.push(text);
			
		}
		
		for(var i = 0; i < this.menu_data.items.length; i++)
		{
			
			this.menu_items[i] = MenuItem.Factory(this, this.menu_data.items[i]);
			this.max_animation = Math.max(this.menu_items[i].Display(), this.max_animation);
			this.menu_items[i].setInteractive();
			
			this.menu_items[i].on("pointerdown", function(pointer)
			{
				
				this.Activate(pointer);
				
			}, this.menu_items[i]);
			
			this.children.add(this.menu_items[i]);
			
		}
		
		this.input.on("pointerover", function(event, objects)
		{
			
			objects[0].Highlight();
			
		});
		
		this.input.on("pointerout", function(event, objects)
		{
			
			objects[0].Dim();
			
		});
		
	}
	
	CreateCurrency()
	{
	    
	    this.currency_image = this.textures.get("CurrencyImage");
		this.currencyIndex = UI.AddSource(this.currency_image.source[0].source, {x: 0, y: 0, alpha: 0});
		UI.AnimateSource(this.currencyIndex, "alpha", 0, 1, 500, false);
	    
	    this.currency_text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, " x " + SaveData.CurrentPower(), CONST_CURRENCY_DATA.font);
	    this.currencyTextIndex = UI.AddSource(this.currency_text.canvas, CONST_CURRENCY_DATA);
	    UI.AnimateSource(this.currencyTextIndex, "alpha", 0, 1, 500, false);
	    
	}
	
	update()
	{
		
		if(this.menu_data.currency)
		{
		    
		    this.UpdateCurrency();
		    
		}
		
		UI.Update();
		UI.Draw();
		
	}
	
	UpdateCurrency()
	{
	    
	    this.currency_text.setText(" x " + SaveData.CurrentPower());
	    
	}
	
	Hide()
	{
		
		this.closing = true;
		
		if(this.menu_data.currency)
		{
		    
		    this.HideCurrency();
		    
		}
		
		for(var i = 0; i < this.text.length; i++)
		{
			
			var text = this.text[i];
			
			MenuItem.ReverseAnimate(text.index, text.display);
			
		}
		
		for(var i = 0; i < this.menu_items.length; i++)
		{
			
			this.menu_items[i].Hide();
			
		}
		
	}
	
	HideCurrency()
	{
	    
	    UI.AnimateSource(this.currencyIndex, "alpha", 1, 0, 500, true);
	    UI.AnimateSource(this.currencyTextIndex, "alpha", 1, 0, 500, true);
	    
	}
	
}