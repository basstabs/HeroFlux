import Timer from "../Tools/Timer.js";
import Parametrizer from "../Tools/Parametrizer.js";
import MessageBox from "../Tools/Messages.js"

import Prop from "../Game/Prop.js";
import Code from "../Game/Code.js";
import Weapon from "../Game/Weapon.js";
import SaveData from "../Game/SaveData.js";
import {ScoreMessage} from "../Game/Score.js";

import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";
import {PoolMessage} from "../Base/PoolObject.js";

import {CONST_PICKUP_SPEED} from "../Constants.js";

export const CONST_DEATH_MESSAGE_CODE = "ActorDead";

const CONST_DEATH_PICKUP_KEY = "Pickup";
const CONST_DEATH_BIG_FLOOR = 100;
const CONST_DEATH_BIGPICKUP_KEY = "BigPickup";
const CONST_DEATH_HUGE_FLOOR = 1000;
const CONST_DEATH_HUGEPICKUP_KEY = "HugePickup";

export default class Actor extends Prop
{
	
	constructor(scene, texture, json, code, textureKey)
	{

		super(scene, texture, json.tracking, json.damage, true, json.max_health, json.death, json.death_instruction, code, textureKey);
		
		this.weapons = [];
		for(var i = 0; i < json.weapons.length; i++)
		{
		
			this.weapons[i] = new Weapon(scene, code, json.weapons[i].weapon, json.weapons[i].audio);
			
		}
		
		this.fire_conditions = [];
		for(var i = 0; i < json.fire_conditions.length; i++)
		{
			
			this.fire_conditions[i] = new FireCondition(json.fire_conditions[i]);
			
		}
	
		this.aimed = json.aimed;
		
		this.firing = false;
		
		this.score = json.score;
		
	}

	Aimed()
	{
	
		return (this.aimed ? true : false);
	
	}

	Pool()
	{

		super.Pool();
		
		this.off("animationcomplete", Actor.fireTransition);

	}
	
	Launch(x, y, xParam, yParam, theta, idle)
	{
		
		super.Launch(x, y, xParam, yParam, theta, idle);
	
		if(this.Aimed())
		{
		
			var direction = this.scene.AimingTarget(this, this.code, this.aimed.actor, this.aimed.agent);
			direction.scale(this.aimed.speed);
			
			this.xParam = Parametrizer.ConstantFunction(direction.x);
			this.yParam = Parametrizer.ConstantFunction(direction.y);
		
		}
		
		for(var i = 0; i < this.fire_conditions.length; i++)
		{
			
			this.fire_conditions[i].Reset(this.start);
			
		}
		
		this.firing = false;
		
	}
	
	update()
	{
		
		super.update();
		
		if(!this.firing)
		{
			
			for(var i = 0; i < this.fire_conditions.length; i++)
			{
			
				if(this.fire_conditions[i].Meet() && this.weapons[this.fire_conditions[i].WeaponIndex()].Ready())
				{
				
					if(this.fire_conditions[i].animation)
					{
						
						this.anims.play(this.fire_conditions[i].animation).on("animationcomplete", Actor.fireTransition, {actor: this, index: i});
						this.firing = true;
					
					}
					else
					{
					
						this.weapons[this.fire_conditions[i].WeaponIndex()].Fire(this.x, this.y);
						this.fire_conditions[i].Fire();
				
					}
				
				}
			
			}
			
		}
		
	}
	
	Handle(obj)
	{
		
		this.Hurt(obj.Value(), obj.death_instruction);
		
	}
	
	Die()
	{
		
		if(Code.Enemy(this.code))
		{
		
			var velocity = new Phaser.Math.Vector2(this.body.velocity.x, this.body.velocity.y);
			velocity.normalize();
			velocity.scale(CONST_PICKUP_SPEED);
		
			if(this.score > 0)
			{
				
				var pickup = CONST_DEATH_PICKUP_KEY;
			
				if(this.score >= CONST_DEATH_BIG_FLOOR)
				{
				
					if(this.score >= CONST_DEATH_HUGE_FLOOR)
					{
				
						pickup = CONST_DEATH_HUGEPICKUP_KEY;
					
					}
					else
					{
					
						pickup = CONST_DEATH_BIGPICKUP_KEY;
					
					}
				
				}
			
				var message = new PoolMessage(pickup, velocity.x.toString(), velocity.y.toString(), this.score);
				message.Launch(this.x, this.y, 0);
		
				MessageBox.PostMessage(message);
				MessageBox.PostMessage(new ScoreMessage(this.score));
			
				SaveData.AddKill();
			
			}
			
		}
		
		super.Die();
		
	}
	
}

class FireCondition
{
	
	constructor(json)
	{
		
		this.weapon_index = json.weapon;
		
		this.time = json.time;
		this.fire_rate = json.fire_rate;

		this.max_ammo = json.ammo;
		this.ammo = json.ammo;
		
		this.last = 0;
		this.start = 0;
		
		this.animation = json.animation;
		
	}
	
	Reset(start)
	{
	
		this.ammo = this.max_ammo;
		this.last = Timer.RunningMilliseconds();
	
		this.start = Timer.RunningMilliseconds();
		
	}
	
	Meet()
	{
		
		var time = (Timer.RunningMilliseconds() - this.start) / 1000;
		
		if(time <= this.time)
		{
			
			return false;
			
		}
		
		time = (Timer.RunningMilliseconds() - this.last) / 1000;
		
		if(time <= this.fire_rate && this.last > this.start)
		{
		
			return false;
		
		}
		
		if(this.ammo === 0)
		{
		
			return false;
		
		}
		
		return true;
		
	}
	
	WeaponIndex()
	{
		
		return this.weapon_index;
		
	}
	
	Fire()
	{
		
		this.last = Timer.RunningMilliseconds();
		
		this.ammo -= 1;
		
	}
	
}

Actor.fireTransition = function()
{
			
	if(this.actor.firing)
	{
		
		var weapon = this.actor.fire_conditions[this.index];
		
		this.actor.weapons[weapon.WeaponIndex()].Fire(this.actor.x, this.actor.y);
		weapon.Fire();
							
		this.actor.anims.play(this.actor.idle);
			
		this.actor.firing = false;
							
	}
							
	this.actor.off("animationcomplete", Actor.fireTransition);
							
}