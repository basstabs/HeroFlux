import Timer from "../Tools/Timer.js";
import SoundBoard from "../Tools/SoundBoard.js";
import MessageBox, {Message} from "../Tools/Messages.js";

import Agent, {CONST_AGENT_NORMAL, CONST_AGENT_SCRIPT} from "../Game/Agent.js";
import {CONST_DIALOGUEADVANCE_MESSAGE_CODE, CONST_DIALOGUESKIP_MESSAGE_CODE} from "../Game/Level.js";
import {ScorePickupMessage} from "../Game/Score.js";
import SaveData from "../Game/SaveData.js";

export const CONST_PLAYER_SPAWN = "spawn_state";
export const CONST_PLAYER_DIALOGUE = "dialogue_state";

export const CONST_PLAYERPAUSE_MESSAGE_CODE = "pause";
export const CONST_PLAYERDEATH_MESSAGE_CODE = "playerdeath";

export const CONST_PLAYER_SPAWN_STATE = {

	update: false,
	enter: {
	
		x: -135,
		y: 135,
		xParam: "300",
		yParam: "0",
		audio: "SpawnAudio"
	
	},
	exit: {
	},
	duration: 0,
	animation: "Player-Spawn"

};

const CONST_PLAYER_SPAWN_X = 200;

const CONST_PLAYER_INVULNTIME = 3000;

export default class Player extends Agent
{

	constructor(shmup, texture, code, json)
	{
	
		super(shmup, "Player", texture, code, json.agent);
	
		this.death_power = json.death;
		this.super_power = json.super;
	
		this.power = json.start;
	
		this.spawn_xParam = null;
		this.spawn_yParam = null;
		
	}
	
	update()
	{
	
		switch (this.currentState)
		{
		
			case CONST_PLAYER_SPAWN:
				this.SpawnUpdate();
				break;
		
			case CONST_PLAYER_DIALOGUE:
				this.DialogueUpdate();
				break;
				
		}
	
		if(this.control.DialogueSkip() && this.currentState != CONST_PLAYER_DIALOGUE)
		{
			
			MessageBox.PostMessage(new Message(CONST_PLAYERPAUSE_MESSAGE_CODE));
			
		}
		
		super.update();
	
	}

	ExitState(data)
	{
	
		switch (this.currentState)
		{
		
			case CONST_PLAYER_SPAWN:
				this.SpawnExit(data);
				break;
			
			case CONST_PLAYER_DIALOGUE:
				this.DialogueExit(data);
				break;
				
			default:
				super.ExitState(data);
				break;
					
		}
	
	}

	EnterState(newState, data)
	{
	
		switch (newState)
		{
		
			case CONST_PLAYER_SPAWN:
				this.SpawnEnter(data);
				break;
		
			case CONST_PLAYER_DIALOGUE:
				this.DialogueEnter(data);
				break;
				
			default:
				super.EnterState(newState, data);
				break;
		
		}
	
	}

	SpawnUpdate()
	{

		var t = (Timer.RunningMilliseconds() - this.stage_start) / 1000;
	
		this.setVelocityX(this.spawn_xParam(t));
		this.setVelocityY(this.spawn_yParam(t));
		
		this.anims.play(this.stage_animation, true);
	
		if(this.x >= CONST_PLAYER_SPAWN_X)
		{
			
			var data = {update: false, enter: {}, exit: {}, duration: 0, animation: ""};
			this.ChangeState(CONST_AGENT_NORMAL, data);
			
		}
		
	}

	SpawnEnter(data)
	{
	
		this.SetInvulnerability(1000000); //Big number to cover whole spawn animations
	
		this.spawn_xParam = this.scene.LoadParam(data.xParam);
		this.spawn_yParam = this.scene.LoadParam(data.yParam);
	
		this.Launch(data.x, data.y);
		
		this.setCollideWorldBounds(false);
		this.block_bounds_check = true;
	
		SoundBoard.Play(data.audio);
		
	}

	SpawnExit(data)
	{
	
		this.SetInvulnerability(CONST_PLAYER_INVULNTIME);
		
		this.setCollideWorldBounds(true);
		this.block_bounds_check = false;
		
	}

	DialogueUpdate()
	{

		//Update Dialogue
		if(this.control.DialoguePress())
		{
			
			MessageBox.PostMessage(new Message(CONST_DIALOGUEADVANCE_MESSAGE_CODE));
			
		}
		
		if(this.control.DialogueSkip())
		{
			
			MessageBox.PostMessage(new Message(CONST_DIALOGUESKIP_MESSAGE_CODE));
			
		}
		
		//Perform state actions
		this.setVelocityX(0);
		this.setVelocityY(0);
		
		this.anims.play("Player-Idle", true);
		
	}

	InDialogue()
	{
		
		return this.currentState === CONST_PLAYER_DIALOGUE;
		
	}
	
	DialogueExit(data)
	{
		
	}
	
	DialogueEnter(data)
	{
		
	}

	DeathEnter(data)
	{
		
		super.DeathEnter(data);
		
		if(data.image)
		{
			
			MessageBox.PostMessage(new PlayerDeathMessage(data.image));
			
		}
		
	}
	
	Hurt(damage, death)
	{
		
		if(this.currentState === CONST_PLAYER_DIALOGUE || this.currentState === CONST_PLAYER_SPAWN)
		{
			
			return;
			
		}
		
		super.Hurt(damage, death);
		
	}
	
	PowerUp(power)
	{
		
		super.PowerUp(power);
		
		if(power > 0)
		{
			
			MessageBox.PostMessage(new ScorePickupMessage());
			
			SaveData.AddPower(power);
			
		}
		
	}
	
}

class PlayerDeathMessage extends Message
{
	
	constructor(image)
	{
		
		super(CONST_PLAYERDEATH_MESSAGE_CODE);
		
		this.image = image;
		
	}
	
	Image()
	{
		
		return this.image;
		
	}
	
}