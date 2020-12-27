import MenuScene from "../Base/MenuScene.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH} from "../Base/BaseConstants.js";

import SoundBoard from "../Tools/SoundBoard.js";

import SaveData from "../Game/SaveData.js";

import Title from "../Scenes/Title.js";

import {CONST_FEATS_SCREEN_DATA} from "../Constants.js";

export default class Feats extends MenuScene
{
	
	constructor()
	{
	
		super("Feats");
		
		this.current_feat = 0;
		
		this.image = null;
		
		this.name = null;
		this.name_index = -1;
		
		this.description_text = null;
		this.description_index = -1;
		
		this.reward_image = null;
		this.reward_image_index = -1;
		
		this.reward = null;
		this.reward_index = -1;
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("FeatsScreen");
		data = JSON.parse(JSON.stringify(data));
		
		this.feats = this.cache.json.get("Feats");
		
		this.level_data = this.cache.json.get("Levels");
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
		
	    this.name = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_FEATS_SCREEN_DATA.font);
		this.name_index = UI.AddSource(this.name.canvas, CONST_FEATS_SCREEN_DATA.name_data);
		UI.AnimateSource(this.name_index, "alpha", 0, 1, 500, false);
		
	    this.description_text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_FEATS_SCREEN_DATA.font);
		this.description_index = UI.AddSource(this.description_text.canvas, CONST_FEATS_SCREEN_DATA.description_data);
		UI.AnimateSource(this.description_index, "alpha", 0, 1, 500, false);
		
		this.reward_image_index= UI.AddSource(this.currency_image.source[0].source, CONST_FEATS_SCREEN_DATA.reward_image_data);
		UI.AnimateSource(this.reward_image_index, "alpha", 0, 1, 500, false);
		
		this.reward = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_FEATS_SCREEN_DATA.font);
		this.reward_index = UI.AddSource(this.reward.canvas, CONST_FEATS_SCREEN_DATA.reward_data);
		UI.AnimateSource(this.reward_index, "alpha", 0, 1, 500, false);
		
		this.SelectFeat(0);
		
	}
	
	Translate(description)
	{
	    
	    var desc = description;
	    var active = true;
	    
	    for(var i = 0; i < this.level_data.length; i++)
	    {
	        
	        var replacement = (active ? this.level_data[i].title : "???");
	        
	        desc = desc.replaceAll("<t-" + this.level_data[i].level + ">", replacement);
	        
	        if(SaveData.Score(this.level_data[i].level) <= 0)
	        {
	            
	            active = false;
	            
	        }
	        
	    }
	    
	    return desc;
	    
	}
	
	SelectFeat(index)
	{
	    
	    this.current_feat = index;
	    
	    var feat = this.feats[this.current_feat];
	    
	    this.name.setText(feat.name);
	    this.description_text.setText(this.Translate(feat.description));
	    this.reward.setText(" x " + -SaveData.LockCost(feat.key));
	    
	    UI.UpdateSource(this.description_index, null, {x: 0.5 - ((this.description_text.displayWidth / 2) / CONST_UI_WIDTH)});
	    
	    if(Feats.Achieved(feat))
	    {
	        
	        SaveData.OpenLock(feat.key);
	        
	        this.name.setColor(CONST_FEATS_SCREEN_DATA.unlocked_color);
	        this.description_text.setColor(CONST_FEATS_SCREEN_DATA.unlocked_color);
	        this.reward.setColor(CONST_FEATS_SCREEN_DATA.unlocked_color);
	        
	    }
	    else
	    {
	        
	        this.name.setColor(CONST_FEATS_SCREEN_DATA.font.color);
	        this.description_text.setColor(CONST_FEATS_SCREEN_DATA.font.color);
	        this.reward.setColor(CONST_FEATS_SCREEN_DATA.font.color);
	        
	    }
	    
	}
	
	static Achieved(feat)
	{
	    
	    switch(feat.type)
	    {
	        
	        case "score":
	            
	            for(var i = 0; i < feat.scores.length; i++)
	            {
	                
	                if(SaveData.Score(feat.scores[i].level) < feat.scores[i].score)
	                {
	                    
	                    return false;
	                    
	                }
	                
	            }
	            
	            return true;
	            break;
	            
	        case "1cc":
	            return SaveData.HasCCed(feat.level);
	            break;
	            
	        case "kill":
	            return (SaveData.CurrentKills() >= feat.amount);
	            break;
	        
	    }
	    
	}
	
	Next()
	{
	    
	    this.SelectFeat((this.current_feat + 1) % this.feats.length);
	    
	}
	
	Previous()
	{
	    
	    this.SelectFeat(((this.current_feat - 1) + this.feats.length) % this.feats.length); //Scumbag Javascript uses negative remainders like an idiot
	    
	}
	
	Hide()
	{
		
		super.Hide();
		
		UI.AnimateSource(this.name_index, "alpha", 1, 0, 500, true);
		UI.AnimateSource(this.description_index, "alpha", 1, 0, 500, true);
		UI.AnimateSource(this.reward_image_index, "alpha", 1, 0, 500, true);
		UI.AnimateSource(this.reward_index, "alpha", 1, 0, 500, true);
		
	}
	
	Back()
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Feats");
			this.scene.add("Title", Title);
		
			this.Start("Title");
		
		}, [], this);

	}
	
}