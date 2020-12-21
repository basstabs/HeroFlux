import PoolObject from "../Base/PoolObject.js";

import Timer from "../Tools/Timer.js";
import SoundBoard from "../Tools/SoundBoard.js";
import Logger from "../Tools/Logger.js";
import MessageBox, {Message} from "../Tools/Messages.js";
import Parametrizer from "../Tools/Parametrizer.js";

import Input from "../Game/Input.js";
import BossAI from "../Game/BossAI.js";
import Code from "../Game/Code.js";
import Weapon from "../Game/Weapon.js";
import SaveData from "../Game/SaveData.js";
import {ScoreMessage} from "../Game/Score.js";

export const CONST_AGENT_NORMAL = "normal";
const CONST_AGENT_FIRE = "fire";
const CONST_AGENT_CONTINUOUSFIRE = "continuous";
const CONST_AGENT_DEATH = "death";
export const CONST_AGENT_SCRIPT = "script";
const CONST_AGENT_CHARGE = "charge";

export const CONST_MOVE_MESSAGE_SUFFIX = "_moveto";
export const CONST_AGENTDEATH_MESSAGE_SUFFIX = "_agentdeath";

export default class Agent extends PoolObject
{
	
	constructor(scene, key, texture, code, json)
	{

		super(scene, texture, false, json.death, json.max_health, code);
		
    	this.control = null;
		
		this.horizontalVelocity = json.hVel;
		this.verticalVelocity = json.vVel;

		this.currentState = CONST_AGENT_NORMAL;
    
		this.weapons = [];
		for(var i = 0; i < json.weapons.length; i++)
		{
			
			this.weapons[i] = new Weapon(scene, code, json.weapons[i].weapon, json.weapons[i].audio);
			
		}
		
		this.actions = json.actions;
		
		this.stage_start = 0;
		this.stage_duration = 0;
		this.stage_animation = null;
		
		this.xParam = null;
		this.yParam = null;
		
		this.fire_animation = null;
		this.fire_weapon = null;
		this.fire_move = false;
		
		this.continuous_started = false;
		this.continuous_code = 0;
		
		this.death_collide = false;
		
		this.default_death = json.default_death;
		this.death_instruction = json.death_instruction;
		
		this.damage = json.damage;
	
		this.max_power = json.power;
		this.power = this.max_power;
		this.empty = json.empty;
		
		this.charge_power = -1;
		this.charge_speed = -1;
		
		this.idle = key + "-Idle";
		
		this.score = json.score;
		
		this.key = key;
		
	}
	
	SetControl(scene, data)
	{
    
    	this.control = Agent.ControlFactory(scene, data);
    
		this.control.Hook(this);
		
	}

	MoveTo(x, y, time, invuln, animation)
	{
		
		var xParam = Parametrizer.LinearCombination(this.x, x, time);
		var yParam = Parametrizer.LinearCombination(this.y, y, time);
	
		var data = {update: true, exit: {}, enter: {xParam: xParam, yParam: yParam, invuln: invuln}, duration: time * 1000, animation: (animation ? animation : this.idle)};
				
		this.ChangeState(CONST_AGENT_SCRIPT, data);
		
	}
	
	Launch(x, y, xParam, yParam, theta, idle)
	{
		
		super.Launch(x, y);
		
		if(xParam && yParam)
		{
			
			//Use theta for duration because I'm suuuuuuuper bad and lazy at programming
			var data = {update: true, exit: {}, enter: {xParam: xParam, yParam: yParam, invuln: true}, duration: theta * 1000, animation: idle};
				
			this.ChangeState(CONST_AGENT_SCRIPT, data);
		
		}
		
	}
	
	Pool()
	{
		
		super.Pool();

		MessageBox.PostMessage(new Message(this.key + CONST_AGENTDEATH_MESSAGE_SUFFIX));
		
	}
	
	update()
	{
		
		this.control.Update();
		
		this.Update();
		
	}
	
	Update()
	{
		
		switch (this.currentState)
		{
		
			case CONST_AGENT_NORMAL:
				this.NormalUpdate();
				break;
			
			case CONST_AGENT_CONTINUOUSFIRE:
				this.ContinuousFireUpdate();
				break;
				
			case CONST_AGENT_FIRE:
				this.FireUpdate();
				break;

			case CONST_AGENT_DEATH:
				this.DeathUpdate();
				break;
				
			case CONST_AGENT_SCRIPT:
				this.ScriptedUpdate();
				break;
				
			case CONST_AGENT_CHARGE:
				this.ChargeUpdate();
				
		}
	
		this.UpdateInvulnerability();
		
		//Determine if the agent needs to scripted move
		var message = MessageBox.PullMessage(this.key + CONST_MOVE_MESSAGE_SUFFIX);
		if(!message.IsEmpty())
		{
		
			this.MoveTo(message.X(), message.Y(), message.Time(), true);
			
		}
		
		super.update();
		
	}

	ExitState(data)
	{
	
		switch (this.currentState)
		{
		
			case CONST_AGENT_NORMAL:
				this.NormalExit(data);
				break;
				
			case CONST_AGENT_CONTINUOUSFIRE:
				this.ContinuousFireExit(data);
				break;
				
			case CONST_AGENT_FIRE:
				this.FireExit(data);
				break;
				
			case CONST_AGENT_DEATH:
				this.DeathExit(data);
				break;
				
			case CONST_AGENT_SCRIPT:
				this.ScriptedExit(data);
				break;
				
			case CONST_AGENT_CHARGE:
				this.ChargeExit(data);
				break;
			
		}
	
	}

	EnterState(newState, data)
	{
	
		switch (newState)
		{
		
			case CONST_AGENT_NORMAL:
				this.NormalEnter(data);
				break;
				
			case CONST_AGENT_CONTINUOUSFIRE:
				this.ContinuousFireEnter(data);
				break;
				
			case CONST_AGENT_FIRE:
				this.FireEnter(data);
				break;
				
			case CONST_AGENT_DEATH:
				this.DeathEnter(data);
				break;
				
			case CONST_AGENT_SCRIPT:
				this.ScriptedEnter(data);
				break;
			
			case CONST_AGENT_CHARGE:
				this.ChargeEnter(data);
				break;
			
		}
	
	}
	
	ChangeState(newState, data)
	{

		this.ExitState(data.exit);
		
		this.stage_start = Timer.RunningMilliseconds();
		this.stage_duration = data.duration;
		this.stage_animation = data.animation;
		
		this.EnterState(newState, data.enter);
		
		this.currentState = newState;

		if(data.update)
		{
			
			this.Update();
			
		}
		
	}

	MovementUpdate()
	{
		
		this.setVelocityX(0);
		this.setVelocityY(0);
		
		var velocity = this.control.Movement();
		
		this.setVelocityX(velocity.x * this.horizontalVelocity);
		this.setVelocityY(velocity.y * this.verticalVelocity);
		
	}
	
	NormalUpdate()
	{

		//Switch states if necessary
		for(var i = 0; i < this.actions.length; i++)
		{
			
			if(this.control.Code(this.actions[i].code) && this.weapons[this.actions[i].weapon].Ready())
			{
				
				var data = {update: true, exit: {}, enter: {weapon_index: this.actions[i].weapon, move: this.actions[i].move, code: this.actions[i].code, transition: this.actions[i].transition}, duration: this.anims.animationManager.get(this.actions[i].animation).duration * this.actions[i].multiplier, animation: this.actions[i].animation};
				
				this.ChangeState((this.actions[i].continuous ? CONST_AGENT_CONTINUOUSFIRE : CONST_AGENT_FIRE), data);
				
				return;
				
			}
			
		}
		
		//Perform state actions
		this.MovementUpdate();

		this.anims.play(this.idle, true);
		
	}

	NormalExit(data)
	{
		
	}
	
	NormalEnter(data)
	{
		
	}
	
	ScriptedUpdate()
	{
		
		//Switch States if necessary
		if(Timer.RunningMilliseconds() - this.stage_start >= this.stage_duration)
		{
			
			var data = {update: false, exit: {}, enter: {}, duration: 0, animation: ""};
			
			this.ChangeState(CONST_AGENT_NORMAL, data);
			
			return;
			
		}
		
		//Perform State Actions
		var t = (Timer.RunningMilliseconds() - this.stage_start) / 1000;
	
		this.x = this.xParam(t);
		this.y = this.yParam(t);
		
		this.anims.play(this.stage_animation, true);
		
	}
	
	ScriptedExit(data)
	{
	
		this.xParam = null;
		this.yParam = null;
		
	}
	
	ScriptedEnter(data)
	{
		
		this.xParam = data.xParam;
		this.yParam = data.yParam;
		
		this.setVelocityX(0);
		this.setVelocityY(0);
		
		if(data.invuln)
		{
		
			this.SetInvulnerability(this.stage_duration);
		
		}
		
	}
	
	ContinuousFireUpdate()
	{
		
		if(this.continuous_started)
		{
			
			var weapon = this.weapons[this.fire_weapon];
			
			//Switch states if necessary
			if(!this.control.Code(this.continuous_code) || weapon.Cost() > this.power)
			{
			
				var data = {update: false, exit: {}, enter: {}, duration: 0, animation: ""};
			
				this.ChangeState(CONST_AGENT_NORMAL, data);
			
				return;
			
			}
		
			if(weapon.Ready())
			{
				
				weapon.Fire(this.x, this.y);
				this.power -= weapon.Cost();
				
			}
			
			this.anims.play(this.stage_animation, true);
			
		}
		
		//Perform state actions
		if(this.fire_move)
		{
			
			this.MovementUpdate();
			
		}
		else
		{
		
			this.setVelocityX(0);
			this.setVelocityY(0);
			
		}
		
	}
	
	ContinuousFireExit(data)
	{
		
		var weapon = this.weapons[this.fire_weapon];
		
		if(weapon.Cost() > this.power)
		{

			SoundBoard.Play(this.empty);
			
		}
		
	}
	
	ContinuousFireEnter(data)
	{
		
		this.fire_weapon = data.weapon_index;
		this.fire_move = data.move;
		
		this.continuous_started = false;
		this.continuous_code = data.code;
		
		var continuousTransition = function()
		{
			
			this.continuous_started = true;
			
			this.anims.play(this.stage_animation);
			
			this.off("animationcomplete", continuousTransition);
			
		}
		
		this.anims.play(data.transition).on("animationcomplete", continuousTransition, this);
		
	}
	
	FireUpdate()
	{
		
		//Switch states if necessary
		if(Timer.RunningMilliseconds() - this.stage_start >= this.stage_duration && this.weapons[this.fire_weapon].Ready())
		{
			
			var data = {update: false, exit: {}, enter: {}, duration: 0, animation: ""};
			
			this.ChangeState(CONST_AGENT_NORMAL, data);
			
			return;
			
		}
		
		//Perform state actions
		if(this.fire_move)
		{
			
			this.MovementUpdate();
			
		}
		else
		{
		
			this.setVelocityX(0);
			this.setVelocityY(0);
			
		}
		
		this.anims.play(this.stage_animation, true);
		
	}
	
	FireExit(data)
	{
		
		var weapon = this.weapons[this.fire_weapon];
		
		if(this.power >= weapon.Cost())
		{
		
			weapon.Fire(this.x, this.y);
			this.power -= weapon.Cost();
			
		}
		else
		{
			
			if(this.empty)
			{
				
				SoundBoard.Play(this.empty);
				
			}
			
		}
		
	}
	
	FireEnter(data)
	{
		
		this.fire_weapon = data.weapon_index;
		this.fire_move = data.move;
		
	}
	
	DeathUpdate()
	{
	
		var t = (Timer.RunningMilliseconds() - this.stage_start) / 1000;
	
		this.setVelocityX(this.xParam(t));
		this.setVelocityY(this.yParam(t));
	
	}
	
	DeathExit(data)
	{
	
		this.xParam = null;
		this.yParam = null;
	
		this.setCollideWorldBounds(this.death_collide);
		this.death_collide = false;
		
		this.die = false;
		
	}
	
	DeathEnter(data)
	{
	
		this.xParam = this.scene.LoadParam(data.xParam);
		this.yParam = this.scene.LoadParam(data.yParam);
	
		this.death_collide = this.collideWorldBounds;
		this.setCollideWorldBounds(false);
		
		this.die = true;
	
		var deathTransition = function()
		{
						
			this.off("animationcomplete", deathTransition);
			
			this.anims.play(this.stage_animation);
			
		}
		
		this.anims.play(data.transition).on("animationcomplete", deathTransition, this);

		if(data.audio)
		{
			
			SoundBoard.Play(data.audio);
			
		}
		
	}
	
	ChargeUpdate()
	{
		
		//Switch states if necessary
		if(this.power >= this.max_power)
		{
			
			var data = {update: false, exit: {}, enter: {}, duration: 0, animation: ""};
			
			this.ChangeState(CONST_AGENT_NORMAL, data);
			
			return;
			
		}
		
		//Perform state actions
		var t = (Timer.RunningMilliseconds() - this.stage_start) / 1000;
		
		this.power = Math.floor(Math.min(this.charge_power + (t * this.charge_speed), this.max_power));
		
	}
	
	ChargeExit(data)
	{

		this.charge_power = -1;
		this.charge_speed = -1;
		
	}
	
	ChargeEnter(data)
	{
		
		this.charge_power = this.power;
		this.charge_speed = data.speed;
		
		var chargeTransition = function()
		{
						
			this.off("animationcomplete", chargeTransition);
			
			this.anims.play(this.stage_animation);
			
		}
		
		this.anims.play(data.transition).on("animationcomplete", chargeTransition, this);
		
	}
	
	Value()
	{
	
		return this.Damage();
	
	}
	
	Damage()
	{
		
		return this.damage;
		
	}
	
	Handle(obj)
	{
	
		if(!obj.Hostile())
		{
		
			this.PowerUp(obj.Value());
		
		}
		else
		{
		
			super.Handle(obj);
		
		}
		
	}
	
	Hurt(damage, death)
	{
		
		super.Hurt(damage);
		
		if(this.health <= 0)
		{
			
			this.Die();
			
			var data = {};
			if(death)
			{
					
				data = {enter: {xParam: death.xParam, yParam: death.yParam, audio: death.audio, transition: death.transition, image: death.image}, exit: {}, duration: 0, animation: death.animation};
					
			}
			else
			{
					
				data = {enter: {xParam: this.default_death.xParam, yParam: this.default_death.yParam, audio: this.default_death.audio, transition: this.default_death.transition}, exit: {}, duration: 0, animation: this.default_death.animation};
					
			}

			this.ChangeState(CONST_AGENT_DEATH, data);
			
		}
		
	}
	
	PowerUp(power)
	{
			
		this.power = Math.max(0, Math.min(this.max_power, this.power + power));
			
	}
	
	Power()
	{
	
		return this.power;
	
	}
	
	MaxPower()
	{
	
		return this.max_power;
	
	}
	
	Die()
	{
		
		if(!this.die)
		{
			
			this.control.Shutdown();
			
			MessageBox.PostMessage(new ScoreMessage(this.score));
		
			if(Code.Enemy(this.code))
		    {
			
			    SaveData.AddKill();
			
		    }
			
		}
		
		super.Die();
		
	}
	
	Normal()
	{
		
		return this.currentState === CONST_AGENT_NORMAL;
		
	}
	
	static ControlFactory(scene, data)
	{

		if(data.type == "input")
		{

			return Input.Access();

		}

		if(data.type == "ai")
		{
			
			return new BossAI(scene, data);
			
		}
		
	}
	
}

export class MoveMessage extends Message
{
	
	constructor(key, x, y, time)
	{
		
		super(key + CONST_MOVE_MESSAGE_SUFFIX);
		
		this.x = x;
		this.y = y;
		this.time = time;
		
	}
	
	X()
	{
		
		return this.x;
		
	}
	
	Y()
	{
		
		return this.y;
		
	}
	
	Time()
	{
		
		return this.time;
		
	}
	
}