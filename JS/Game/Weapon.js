import MessageBox from "../Tools/Messages.js";
import Timer from "../Tools/Timer.js";
import SoundBoard from "../Tools/SoundBoard.js";

import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";
import {PoolMessage} from "../Base/PoolObject.js";

export default class Weapon
{
	
	constructor(scene, code, json, audio)
	{
		
		this.fire_modes = [];
		for(var i = 0; i < json.fire_modes.length; i++)
		{
			
			this.fire_modes[i] = {};
			
			this.fire_modes[i].message = new PoolMessage(json.fire_modes[i].key, json.fire_modes[i].xParam, json.fire_modes[i].yParam);
			this.fire_modes[i].message.SetWorld(json.world);
			this.fire_modes[i].offset_x = json.fire_modes[i].x;
			this.fire_modes[i].offset_y = json.fire_modes[i].y;
			
		}
		
		this.last = 0;
		this.fire_rate = json.fire_rate;
		
		this.audio = audio;
		
		this.cost = json.cost;
		
		this.aimed = json.aimed;
		
		this.scene = scene;
		this.code = code;
		
		this.world = json.world;
		
	}
	
	Ready()
	{
		
		return (Timer.RunningMilliseconds() - this.last) / 1000 >= this.fire_rate;
		
	}
	
	Aimed()
	{
	
		return (this.aimed ? true : false);
	
	}
	
	Fire(x, y)
	{
		
		if(this.Ready())
		{
			
			var theta = 0;
			
			for(var i = 0; i < this.fire_modes.length; i++)
			{
				
				if(this.Aimed())
				{
				
					var obj = {x: x + this.fire_modes[i].offset_x, y: y + this.fire_modes[i].offset_y};
				
					var direction = this.scene.AimingTarget(obj, this.code, this.aimed.actor, this.aimed.agent);
					
					theta = Math.atan2(direction.y, direction.x);
				
				}
				
				var message = this.fire_modes[i].message;
				message.Launch(x + this.fire_modes[i].offset_x, y + this.fire_modes[i].offset_y, theta);
				
				MessageBox.PostMessage(message);
				
			}
			
			this.last = Timer.RunningMilliseconds();
			
			SoundBoard.Play(this.audio);
			
			return true;
			
		}
		
		return false;
		
	}

	Cost()
	{
	
		return this.cost;
	
	}
	
}

