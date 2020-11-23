import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";

import Logger from "../Tools/Logger.js";
import {Message} from "../Tools/Messages.js";
import Timer from "../Tools/Timer.js";
import SoundBoard from "../Tools/SoundBoard.js";

export const CONST_POOLSPRITE_MESSAGE_CODE = "PoolSprite";
export const CONST_SPAWN_MESSAGE_CODE = "spawn";

const CONST_TINT_HURT_COLOR = 0x880000;
const CONST_TINT_INVULN_COLOR = 0x8888ff;
const CONST_TINT_BASE_COLOR = 0xffffff;

const CONST_TINT_FLICKER_TIME = 80;

const CONST_TINT_HURT_DURATION = 500;

export class PoolSprite extends Phaser.GameObjects.Sprite
{

	constructor(scene, texture, time, audio)
	{
		
		super(scene, CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, texture);
		
		this.Pool();
		
		this.start = 0;
		this.time = time;
		
		this.audio = audio;
		
	}

	Pool()
	{

		this.start = 0;
		
		this.x = CONST_POOL_LOCATION_X;
		this.y = CONST_POOL_LOCATION_Y;
		
		this.setActive(false);
		this.setVisible(false);
		
	}
	
	Display(x, y)
	{
		
		this.setPosition(x, y);
		
		this.start = Timer.RunningMilliseconds();
		
		this.setActive(true);
		this.setVisible(true);
		
		SoundBoard.Play(this.audio);
		
	}
	
	update()
	{
		
		var t = (Timer.RunningMilliseconds() - this.start);
		if(t >= this.time)
		{
			
			this.Pool();
			
		}
		
	}
	
}

export default class PoolObject extends Phaser.Physics.Arcade.Sprite
{

	constructor(scene, texture, tracking, death_animation, maxHealth, code)
	{

		super(scene, CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, texture);
		
		this.scene = scene;
		
		this.tracking = tracking;
		
		this.Pool();
		
		this.type = null;
		this.start = 0;
		
		this.death_animation = death_animation;
	
		this.block_bounds_check = false;
		
		this.invulnerable = false;
		this.invuln_time = 0;
		this.invuln_start = 0;
		
		this.tint_start = 0;
		this.tint_flicker = 0;
		this.tint_color = CONST_TINT_BASE_COLOR;
		this.tint_duration = 0;
		this.tint_on = false; //Needed because Phaser does weird things to tint colors and I am too lazy to figure it out :P
		
		this.maxHealth = maxHealth;
		this.health = this.maxHealth;
				
		this.code = code;
		
		this.die = false;
		
	}

	Pool()
	{

		this.start = 0;
		
		this.x = CONST_POOL_LOCATION_X;
		this.y = CONST_POOL_LOCATION_Y;
		
		this.setActive(false);
		this.setVisible(false);
		
		this.StopTint();
		this.StopInvulnerability();
		
		this.scene.Deactivate(this);
		
		this.flipX = false;
		
	}
	
	SetBounds(json)
	{
		
		this.type = json.type;
		
		if(json.type == "circle")
		{
			
			this.setCircle(json.radius);
			this.setOffset(json.offsetX, json.offsetY);
			
			return;
			
		}
		
		if(json.type == "box")
		{
			
			this.setSize(json.width, json.height);
			this.setOffset(json.offsetX, json.offsetY);
			
			return;
			
		}
		
	}
	
	Launch(x, y)
	{
		
		this.setPosition(x, y);
		
		this.start = Timer.RunningMilliseconds();
		
		this.setActive(true);
		this.setVisible(true);
		
		this.health = this.maxHealth;
		
	}
	
	update()
	{

		if(this.tracking)
        {
			
			if(this.body.velocity.x >= 0)
			{
			
            	this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
				
				this.flipX = true;
				
			}
			else
			{
			
				this.rotation = -Math.atan2(this.body.velocity.y, -this.body.velocity.x);
			
			}
			
        }
		
		if(!this.block_bounds_check && !Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds()))
		{
			
			this.Pool();
			
		}
		
		this.UpdateTint();
		
	}
	
	StartTint(color, time)
	{
		
		this.tint_start = Timer.RunningMilliseconds();
		this.tint_color = color;
		this.tint_duration = time;
		this.tint_flicker = this.tint_start;
		
		this.tint_on = true;
		this.tint = this.tint_color;
		
	}
	
	StopTint()
	{
		
		this.tint_start = 0;
		this.tint_duration = 0;
		this.tint_flicker = 0;
		this.tint_color = CONST_TINT_BASE_COLOR;
		
		this.tint_on = false;
		this.tint = CONST_TINT_BASE_COLOR;
		
	}
	
	UpdateTint()
	{
		
		if(this.tint_duration > 0)
		{
			
			if((Timer.RunningMilliseconds() - this.tint_start) > this.tint_duration)
			{
				
				this.StopTint();
				
				return;
				
			}
			
			if((Timer.RunningMilliseconds() - this.tint_flicker) > CONST_TINT_FLICKER_TIME)
			{
				
				this.tint = (this.tint_on ? CONST_TINT_BASE_COLOR : this.tint_color);
				this.tint_flicker = Timer.RunningMilliseconds();
				this.tint_on = !this.tint_on;
				
			}
			
		}
		
	}
	
	SetInvulnerability(milliseconds)
	{
	
		this.invulnerable = true;
		
		this.invuln_time = milliseconds;
		this.invuln_start = Timer.RunningMilliseconds();
		
		this.StartTint(CONST_TINT_INVULN_COLOR, milliseconds);
		
	}
	
	StopInvulnerability()
	{
		
		this.invulnerable = false;
		this.invuln_time = 0;
		this.invuln_start = 0;
		
	}
	
	UpdateInvulnerability()
	{
		
		if(this.Invulnerable())
		{
			
			if((Timer.RunningMilliseconds() - this.invuln_start) > this.invuln_time)
			{
		
				this.invulnerable = false;
			
				this.invuln_time = 0;
				this.invuln_start = 0;
		
				this.tint = this.StopTint();
				
			}
		
		}
		
	}
	
	Invulnerable()
	{
		
		return this.invulnerable;
		
	}
	
	Handle(obj)
	{
			
		this.Hurt(obj.Value(), obj.death_instruction);
		
	}
	
	Die()
	{
		
		this.die = true;
		
	}
	
	Hurt(damage)
	{
	
		if(!this.Invulnerable() && !this.die)
		{
			
			this.health -= damage;
		
			this.StartTint(CONST_TINT_HURT_COLOR, CONST_TINT_HURT_DURATION);
			
			if(this.health <= 0)
			{
			
				this.Die();
			
			}
		
		}
		
	}
	
	Hostile()
	{
		
		return true;
		
	}
	
}

export class SpriteMessage extends Message
{
	
	constructor(key)
	{
		
		super(CONST_POOLSPRITE_MESSAGE_CODE);
		
		this.key = key;
		
		this.x = CONST_POOL_LOCATION_X;
		this.y = CONST_POOL_LOCATION_Y;
		
	}
	
	Display(x, y)
	{
		
		this.x = x;
		this.y = y;
		
	}
	
	Key()
	{
		
		return this.key;
		
	}
	
	X()
	{
		
		return this.x;
		
	}
	
	Y()
	{
		
		return this.y;
		
	}
	
}

export class PoolMessage extends Message
{

	constructor(key, xParam, yParam)
	{
		
		super(CONST_SPAWN_MESSAGE_CODE);
		
		this.key = key;
		this.xParam = xParam;
		this.yParam = yParam;
		
		this.x = CONST_POOL_LOCATION_X;
		this.y = CONST_POOL_LOCATION_Y;
		
		this.theta = 0;
	
		this.world = false;
		
	}
	
	SetWorld(world)
	{
	
		this.world = world;
	
	}
	
	World()
	{
	
		return this.world;
	
	}
	
	Launch(x, y, theta)
	{
		
		this.x = x;
		this.y = y;
		
		this.theta = theta;
		
	}
	
	Key()
	{
		
		return this.key;
		
	}
	
	XParam()
	{
		
		return this.xParam;
		
	}
	
	YParam()
	{
		
		return this.yParam;
		
	}
	
	X()
	{
		
		return this.x;
		
	}
	
	Y()
	{
		
		return this.y;
		
	}
	
	Theta()
	{
		
		return this.theta;
		
	}
	
}