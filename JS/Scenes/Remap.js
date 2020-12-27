import MenuScene from "../Base/MenuScene.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH} from "../Base/BaseConstants.js";

import Settings from "../Tools/Settings.js";
import SoundBoard from "../Tools/SoundBoard.js";

import SaveData from "../Game/SaveData.js";
import Input, {CONST_ACTIONS} from "../Game/Input.js";

import Options from "../Scenes/Options.js";

import {CONST_REMAP_SCREEN_DATA} from "../Constants.js";

export default class Remap extends MenuScene
{
	
	constructor()
	{
	
		super("Remap");
		
		this.active_command = "";
		
		this.controller = false;
		
		this.command_data = [];
		
	}
	
	init(data)
	{
		
		this.controller = data.controller;
		
		var menuData = this.cache.json.get("RemapScreen");
		menuData = JSON.parse(JSON.stringify(menuData));
		
		super.init(menuData);
		
	}
	
	create()
	{
		
		super.create();

        Input.Initialize(this.input);

        for(var i = 0; i < CONST_ACTIONS.length; i++)
        {

            this.command_data[CONST_ACTIONS[i]] = {};
            
            var text = (this.controller ? "" : TranslateKeyCode(Settings.Instance().AccessKeyBinding(CONST_ACTIONS[i])));
            
            this.command_data[CONST_ACTIONS[i]].text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, text, CONST_REMAP_SCREEN_DATA.font);
		    this.command_data[CONST_ACTIONS[i]].index = UI.AddSource(this.command_data[CONST_ACTIONS[i]].text.canvas, CONST_REMAP_SCREEN_DATA.data[CONST_ACTIONS[i]]);
		    UI.AnimateSource(this.command_data[CONST_ACTIONS[i]].index, "alpha", 0, 1, 500, false);
            
        }

	}
	
	Hide()
	{
		
		super.Hide();
		
		for(var i = 0; i < CONST_ACTIONS.length; i++)
        {

		    UI.AnimateSource(this.command_data[CONST_ACTIONS[i]].index, "alpha", 1, 0, 500, true);
            
        }
		
	}
	
	Back()
	{
		
		this.Hide();
		
		Settings.Save();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("Remap");
			this.scene.add("Options", Options);
		
			this.Start("Options");
		
		}, [], this);

	}
	
	PollCommand(command)
	{
	    
	    this.active_command = command;
	    
	    this.command_data[command].text.setColor(CONST_REMAP_SCREEN_DATA.highlight);
	    	        
	    if(this.controller)
	    {
	        
	    }
	    else
	    {
	        
	        this.input.keyboard.on("keyup", SetCommand, this);
	    
	    }
	    
	}
	
}

function SetCommand(event)
{
    
    
    if(this.controller)
    {
        
    }
    else
    {
    
        this.input.keyboard.off("keyup");
    
        var new_key = event.keyCode;
	    
	    Settings.Instance().ChangeKeyBinding(this.active_command, new_key);
	    
	    Input.ChangeKey(this.active_command, new_key);
    
        this.command_data[this.active_command].text.setText(TranslateKeyCode(new_key));
    
    }
    
    this.command_data[this.active_command].text.setColor(CONST_REMAP_SCREEN_DATA.font.color);
    
    this.active_command = "";
    
}

function TranslateKeyCode(code)
{
    
    if(code === 32)
    {
        
        return "Space";
        
    }
    
    if(code === 192)
    {
        
        return "`";
        
    }
    
    if(code >= 65 && code <= 90)
    {
        
        return String.fromCharCode(code);
        
    }
    
    return "Unknown";
    
}