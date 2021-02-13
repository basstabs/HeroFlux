import MenuScene from "../Base/MenuScene.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH} from "../Base/BaseConstants.js";

import SoundBoard from "../Tools/SoundBoard.js";

import SaveData from "../Game/SaveData.js";

import Title from "../Scenes/Title.js";
import Viewer from "../Scenes/Viewer.js";

import {CONST_GALLERY_SCREEN_DATA} from "../Constants.js";

export default class Gallery extends MenuScene
{
	
	constructor()
	{
	
		super("Gallery");
		
		this.current = 0;
		
		this.name = null;
		this.name_index = -1;
		
		this.description_text = null;
		this.description_index = -1;
		
		this.cost_image = null;
		this.cost_image_index = -1;
		
		this.cost = null;
		this.cost_index = -1;
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("GalleryScreen");
		data = JSON.parse(JSON.stringify(data));
		
		this.gallery = this.cache.json.get("Gallery");
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
		
	    this.name = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_GALLERY_SCREEN_DATA.font);
		this.name_index = UI.AddSource(this.name.canvas, CONST_GALLERY_SCREEN_DATA.name_data);
		UI.AnimateSource(this.name_index, "alpha", 0, 1, 500, false);
		
	    this.description_text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_GALLERY_SCREEN_DATA.description_font);
		this.description_index = UI.AddSource(this.description_text.canvas, CONST_GALLERY_SCREEN_DATA.description_data);
		UI.AnimateSource(this.description_index, "alpha", 0, 1, 500, false);
		
		this.cost_image_index= UI.AddSource(this.currency_image.source[0].source, CONST_GALLERY_SCREEN_DATA.cost_image_data);
		UI.AnimateSource(this.cost_image_index, "alpha", 0, 1, 500, false);
		
		this.cost = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_GALLERY_SCREEN_DATA.font);
		this.cost_index = UI.AddSource(this.cost.canvas, CONST_GALLERY_SCREEN_DATA.cost_data);
		UI.AnimateSource(this.cost_index, "alpha", 0, 1, 500, false);
		
		this.SelectInfo(0);
		
	}
	
	SelectInfo(index)
	{
	    
	    this.current = index;
	    
	    var info = this.gallery[this.current];
	    
		var unlocked = SaveData.IsLockOpen(info.key);
		
		var hasRequirements = true;
		for(var i = 0; i < info.requirements.length; i++)
		{
			
			if(SaveData.Score(info.requirements[i]) === 0)
			{
				
				hasRequirements = false;
				break;
				
			}
			
		}
		
	    this.name.setText((hasRequirements ? info.name: "???"));
	    this.description_text.setText((unlocked ? info.description : "???"));
	    this.cost.setText(" x " + SaveData.LockCost(info.key));
	    
	    UI.UpdateSource(this.description_index, null, {x: 0.5 - ((this.description_text.displayWidth / 2) / CONST_UI_WIDTH)});
	    
		var unlock_item = this.menu_items[this.menu_items.length - 1];
		unlock_item.On();
		unlock_item.text.setColor(unlock_item.font.color);
		
		var view_item = this.menu_items[this.menu_items.length - 2];
		view_item.On();
		view_item.text.setColor(view_item.font.color);
		
	    if(unlocked)
	    {
	        
	        this.name.setColor(CONST_GALLERY_SCREEN_DATA.unlocked_color);
	        this.description_text.setColor(CONST_GALLERY_SCREEN_DATA.unlocked_color);
	        this.cost.setColor(CONST_GALLERY_SCREEN_DATA.unlocked_color);
	     
			unlock_item.text.setText("Lock");
			view_item.text.setText("View");
			
	    }
	    else
	    {
	        
	        this.name.setColor(CONST_GALLERY_SCREEN_DATA.font.color);
	        this.description_text.setColor(CONST_GALLERY_SCREEN_DATA.description_font.color);
	        this.cost.setColor(CONST_GALLERY_SCREEN_DATA.font.color);

			view_item.Off();
			view_item.text.setText("Locked");
			view_item.text.setColor(CONST_GALLERY_SCREEN_DATA.inactive_color);
			
			if(SaveData.CurrentPower() >= SaveData.LockCost(this.gallery[this.current].key) && hasRequirements)
			{
				
				unlock_item.text.setText("Unlock");
				
			}
			else
			{
			
				unlock_item.Off();
				unlock_item.text.setText("Locked");
				unlock_item.text.setColor(CONST_GALLERY_SCREEN_DATA.inactive_color);
				
			}
			
	    }
		
		UI.UpdateSource(view_item.index, null, {x: 0.5 - ((view_item.text.displayWidth / 2) / CONST_UI_WIDTH)});
		UI.UpdateSource(unlock_item.index, null, {x: 0.5 - ((unlock_item.text.displayWidth / 2) / CONST_UI_WIDTH)});
		
	}
	
	Next()
	{
	    
	    this.SelectInfo((this.current + 1) % this.gallery.length);
	    
	}
	
	Previous()
	{
	    
	    this.SelectInfo(((this.current - 1) + this.gallery.length) % this.gallery.length); //Scumbag Javascript uses negative remainders like an idiot
	    
	}
	
	Hide()
	{
		
		super.Hide();
		
		UI.AnimateSource(this.name_index, "alpha", 1, 0, 500, true);
		UI.AnimateSource(this.description_index, "alpha", 1, 0, 500, true);
		UI.AnimateSource(this.cost_image_index, "alpha", 1, 0, 500, true);
		UI.AnimateSource(this.cost_index, "alpha", 1, 0, 500, true);
		
	}
	
	Toggle()
	{
		
		var info = this.gallery[this.current];
		
		if(SaveData.IsLockOpen(info.key))
		{
			
			SaveData.CloseLock(info.key);
			
		}
		else
		{
			
			if(SaveData.CurrentPower() >= SaveData.LockCost(info.key))
			{
			
				SaveData.OpenLock(info.key);
				
			}
		
		}
		
		this.SelectInfo(this.current);
		
	}
	
	View()
	{
		
		UI.Stash();
		
		this.scene.pause();
		
		this.scene.add("Viewer", Viewer);
		this.scene.launch("Viewer", this.gallery[this.current].images);
		
	}
	
	Back()
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Gallery");
			this.scene.add("Title", Title);
		
			this.Start("Title");
		
		}, [], this);

	}
	
}