import Timer from "../Tools/Timer.js";
import MathLibrary from "../Tools/Math.js";
import MessageBox from "../Tools/Messages.js";

import Control from "../Game/Control.js";

export const CONST_AISTART_MESSAGE_SUFFIX = "_aistart";

export default class AI extends Control
{

	constructor(json)
	{
		
		super();

		this.agent = null;
		
		this.currentAction = {};
		this.currentState = -1;
		
		this.actions = json.actions;
		
		this.default = json.default;
		
		this.started = false;

		this.state_start = 0;
		this.state_duration = 0;
		
		this.current_code = -1;
		
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
		
		return this.current_code === code;
		
	}
	
	RunState(state)
	{
		
		if(state.state == "moveto")
		{
		
			this.agent.MoveTo(state.x, state.y, state.time, state.invuln);
			
			return;
			
		}
		
		var duration = 0;
		var animation = this.agent.key + "-" + state.animation;
		
		if(state.duration)
		{
			
			duration = state.duration;
			
		}
		
		if(state.durationAnimation)
		{
			
			duration = this.agent.anims.animationManager.get(animation).duration;
			
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
		
		this.currentState = 0;
		this.RunState(this.currentAction.states[0])
		
	}
	
	Update()
	{
		
				
		if(!this.started)
		{
			
			var message = MessageBox.PullMessage(this.agent.key + CONST_AISTART_MESSAGE_SUFFIX);
			if(!message.IsEmpty())
			{
				
				this.started = true;
				
				this.ChooseAction();
				
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
	
}