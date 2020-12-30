import Timer from "../Tools/Timer.js";
import MathLibrary from "../Tools/Math.js";
import MessageBox from "../Tools/Messages.js";

import Control from "../Game/Control.js";
import {CONST_AGENT_CHARGE} from "../Game/Agent.js";

export const CONST_AISTART_MESSAGE_SUFFIX = "_aistart";

export default class AI extends Control
{

	constructor(scene, json)
	{
		
		super();

		this.agent = null;
		
		this.currentAction = {};
		this.currentState = -1;
		
		this.actions = json.actions;
		
		this.default = json.default;
		this.activate = json.activate;
		
		this.started = false;

		this.state_start = 0;
		this.state_duration = 0;
		
		this.current_code = -1;
		
		this.scene = scene;
		
		this.markers = json.markers;
		
	}

	Hook(agent)
	{
		
		this.agent = agent;
		
	}
	
	Left()
	{

		return false;

	}

	Right()
	{

		return false;

	}

	Up()
	{

		return false;

	}

	Down()
	{

		return false;

	}
	
	Code(code)
	{
		
		if(this.agent.currentState === CONST_AGENT_CHARGE)
		{
		    
		    return this.agent.power < this.agent.max_power;
		    
		}
		
		return this.current_code === code;
		
	}
	
	RunState(state)
	{
		
		var duration = 0;
		var animation = this.agent.key + "-" + (state.animation ? state.animation : "Idle");
		
		if(state.duration)
		{
			
			duration = state.duration;
			
		}
		
		if(state.durationAnimation)
		{
			
			duration = this.agent.anims.animationManager.get(animation).duration;
			
		}
			
		
		if(state.state == "moveto")
		{
		
			
			if(state.durationAnimation)
			{
				
				duration = duration / 1000; //Duration is given in seconds for Moveto and milliseconds for everything else, but animation counts are always in milliseconds
				
			}
			
			this.agent.MoveTo(state.x, state.y, duration, state.invuln, animation);
			
			return;
			
		}
		
		if(state.enter.code)
		{
			
			this.current_code = state.enter.code;
			
		}
		
		var data = {update: true, exit: state.exit, enter: state.enter, duration: duration, animation: animation};
		
		this.agent.ChangeState(state.state, data);
		
	}
	
	ChooseAction()
	{
		
		if(!this.started && this.activate)
		{
			
			this.currentAction = this.activate;
			
		}
		else
		{
		
			var actions = this.actions.filter(function(action)
			{
			
				return ((this.agent.health <= action.maxHP) && (this.agent.health >= action.minHP)) && ((this.agent.power <= action.maxPower) && (this.agent.power >= action.minPower));
			
			}, this);
		
			if(actions.length > 0)
			{
			
				var index = MathLibrary.RandomInteger(0, actions.length);
			
				this.currentAction = actions[index];

			}
			else
			{
		
				this.currentAction = this.default;
			
			}
		
		}
		
		this.currentState = 0;
		this.RunState(this.currentAction.states[0]);
		
	}
	
	Update()
	{
		
				
		if(!this.started)
		{
			
			this.scene.HookEnemy(this.agent, this.markers);
			
			var message = MessageBox.PullMessage(this.agent.key + CONST_AISTART_MESSAGE_SUFFIX);
			if(!message.IsEmpty())
			{
				
				this.ChooseAction();
				
				this.started = true;
				
			}
			
		}
		
		if((this.agent.Normal() || (this.agent.stage_duration > 0 && (Timer.RunningMilliseconds() - this.agent.stage_start) >= this.agent.stage_duration)) && this.started)
		{
			
			this.currentState += 1;
			
			if(this.currentState >= this.currentAction.states.length)
			{
				
				this.currentAction = {};
				this.currentState = -1;
				
				this.ChooseAction();
				
			}
			else
			{
			
				this.RunState(this.currentAction.states[this.currentState]);
				
			}
			
		}
		
	}
	
	Shutdown()
	{
		
		this.scene.UnhookEnemy();
		
	}
	
}