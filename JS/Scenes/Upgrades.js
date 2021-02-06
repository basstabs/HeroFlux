import MenuScene from "../Base/MenuScene.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH} from "../Base/BaseConstants.js";

import SoundBoard from "../Tools/SoundBoard.js";

import SaveData from "../Game/SaveData.js";

import Title from "../Scenes/Title.js";

import {CONST_UPGRADES_SCREEN_DATA} from "../Constants.js";

export default class Upgrades extends MenuScene
{
	
	constructor()
	{
	
		super("Upgrades");
		
		this.current_upgrade = 0;
		
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
		
		var data = this.cache.json.get("UpgradesScreen");
		data = JSON.parse(JSON.stringify(data));
		
		this.upgrades = this.cache.json.get("Upgrades");
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
		
	    this.name = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_UPGRADES_SCREEN_DATA.font);
		this.name_index = UI.AddSource(this.name.canvas, CONST_UPGRADES_SCREEN_DATA.name_data);
		UI.AnimateSource(this.name_index, "alpha", 0, 1, 500, false);
		
	    this.description_text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_UPGRADES_SCREEN_DATA.font);
		this.description_index = UI.AddSource(this.description_text.canvas, CONST_UPGRADES_SCREEN_DATA.description_data);
		UI.AnimateSource(this.description_index, "alpha", 0, 1, 500, false);
		
		this.cost_image_index= UI.AddSource(this.currency_image.source[0].source, CONST_UPGRADES_SCREEN_DATA.cost_image_data);
		UI.AnimateSource(this.cost_image_index, "alpha", 0, 1, 500, false);
		
		this.cost = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_UPGRADES_SCREEN_DATA.font);
		this.cost_index = UI.AddSource(this.cost.canvas, CONST_UPGRADES_SCREEN_DATA.cost_data);
		UI.AnimateSource(this.cost_index, "alpha", 0, 1, 500, false);
		
		this.SelectUpgrade(0);
		
	}
	
	SelectUpgrade(index)
	{
	    
	    this.current_upgrade = index;
	    
	    var upgrade = this.upgrades[this.current_upgrade];
	    
	    this.name.setText(upgrade.name);
	    this.description_text.setText(upgrade.description);
	    this.cost.setText(" x " + SaveData.LockCost(upgrade.key));
	    
	    UI.UpdateSource(this.description_index, null, {x: 0.5 - ((this.description_text.displayWidth / 2) / CONST_UI_WIDTH)});
	    
		var unlock_item = this.menu_items[this.menu_items.length - 1];
		unlock_item.On();
		unlock_item.text.setColor(unlock_item.font.color);
		
	    if(SaveData.IsLockOpen(upgrade.key))
	    {
	        
	        this.name.setColor(CONST_UPGRADES_SCREEN_DATA.unlocked_color);
	        this.description_text.setColor(CONST_UPGRADES_SCREEN_DATA.unlocked_color);
	        this.cost.setColor(CONST_UPGRADES_SCREEN_DATA.unlocked_color);
	     
			unlock_item.text.setText("Lock");
			
	    }
	    else
	    {
	        
	        this.name.setColor(CONST_UPGRADES_SCREEN_DATA.font.color);
	        this.description_text.setColor(CONST_UPGRADES_SCREEN_DATA.font.color);
	        this.cost.setColor(CONST_UPGRADES_SCREEN_DATA.font.color);
	        
			var hasPower = SaveData.CurrentPower() >= SaveData.LockCost(this.upgrades[this.current_upgrade].key);
			var hasRequirements = true;
			for(var i = 0; i < upgrade.requirements.length; i++)
			{
				
				if(!SaveData.IsLockOpen(upgrade.requirements[i]))
				{
					
					hasRequirements = false;
					break;
					
				}
				
			}
			
			if(hasPower && hasRequirements)
			{				
				
				unlock_item.text.setText("Unlock");
			
			}
			else
			{
			
				unlock_item.Off();
				unlock_item.text.setText("Locked");
				unlock_item.text.setColor(CONST_UPGRADES_SCREEN_DATA.inactive_color);
				
			}
			
	    }
		
		UI.UpdateSource(unlock_item.index, null, {x: 0.5 - ((unlock_item.text.displayWidth / 2) / CONST_UI_WIDTH)});
		
	}
	
	Next()
	{
	    
	    this.SelectUpgrade((this.current_upgrade + 1) % this.upgrades.length);
	    
	}
	
	Previous()
	{
	    
	    this.SelectUpgrade(((this.current_upgrade - 1) + this.upgrades.length) % this.upgrades.length); //Scumbag Javascript uses negative remainders like an idiot
	    
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
		
		var upgrade = this.upgrades[this.current_upgrade];
		
		if(SaveData.IsLockOpen(upgrade.key))
		{
			
			SaveData.CloseLock(upgrade.key);
			
			for(var i = 0; i < this.upgrades.length; i++)
			{
				
				if(this.upgrades[i].requirements.includes(upgrade.key))
				{
					
					SaveData.CloseLock(this.upgrades[i].key);
					
				}
				
			}
			
		}
		else
		{
			
			if(SaveData.CurrentPower() >= SaveData.LockCost(this.upgrades[this.current_upgrade].key))
			{
			
				SaveData.OpenLock(upgrade.key);
				
			}
		
		}
		
		this.SelectUpgrade(this.current_upgrade);
		
	}
	
	Back()
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Upgrades");
			this.scene.add("Title", Title);
		
			this.Start("Title");
		
		}, [], this);

	}
	
}