import Logger from "../Tools/Logger.js";
import MessageBox from "../Tools/Messages.js";

import PoolObject, {SpriteMessage, CONST_POOLSPRITE_MESSAGE_CODE} from "../Base/PoolObject.js";

import Timer from "../Tools/Timer.js";
import Parametrizer from "../Tools/Parametrizer.js";

export default class Prop extends PoolObject
{
	
	constructor(scene, texture, tracking, value, hostile, maxHealth, death_animation, death_instruction, code)
	{

		super(scene, texture, tracking, death_animation, maxHealth, code);
		
		this.Pool();
		
		this.value = value;
		this.hostile = hostile;
		
		this.die = false;
		
		this.death_instruction = death_instruction;
		
		this.idle = "";
		
	}

	Pool()
	{
		
		super.Pool();
		
		this.xParam = Parametrizer.ConstantFunction(0);
		this.yParam = Parametrizer.ConstantFunction(0);
		
		this.sintheta = 0;
		this.costheta = 1;
		
		this.die = false;
		
	}
	
	Launch(x, y, xParam, yParam, theta, idle)
	{
	
		super.Launch(x, y);
		
		this.xParam = xParam;
		this.yParam = yParam;
		
		this.sintheta = Math.sin(theta);
		this.costheta = Math.cos(theta);
		
		this.anims.play(idle);
		this.idle = idle;
		
	}
	
	update()
	{
		
		var t = (Timer.RunningMilliseconds() - this.start) / 1000;
		
		var velX = this.xParam(t);
		var velY = this.yParam(t);
		
		this.setVelocityX((this.costheta * velX) - (this.sintheta * velY));
		this.setVelocityY((this.sintheta * velX) + (this.costheta * velY));
		
		super.update();
		
		if(this.die)
		{
		
			if(this.death_animation)
			{
			
				var message = new SpriteMessage(this.death_animation);
				message.Display(this.x, this.y);
				MessageBox.PostMessage(message);
		
			}
			
			this.Pool();
			
		}
		
	}
	
	Value()
	{
		
		return this.value;
		
	}
	
	Handle(obj)
	{
			
		super.Handle(obj);
		
		this.Die();
		
	}
	
	Die()
	{
		
		this.die = true;
		
	}
	
	Hostile()
	{
		
		return this.hostile;
		
	}
	
}