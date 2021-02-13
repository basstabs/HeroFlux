import {CONST_GAME_CONTAINER, CONST_UI_CONTAINER} from "../Base/BaseConstants.js";

import Logger from "../Tools/Logger.js";
import Timer from "../Tools/Timer.js";

export default class UI
{

	constructor()
	{
	
		this.canvas = document.getElementById(CONST_UI_CONTAINER);
		this.context = this.canvas.getContext("2d");
		
		this.sources = [];
		
		this.animations = [];
		
	}

	static Clear()
	{
	
		UI.m_ui.Clear();
		
	}

	Clear()
	{
	
		this.sources = [];
		this.animations = [];
		
	}

	static Initialize()
	{
	
		UI.m_ui = new UI();
	
	}

	static AddSource(source, parameters)
	{
	
		return UI.m_ui.AddSource(source, parameters);
	
	}

	AddSource(source, parameters)
	{
	
		this.sources.push({source: source, x: parameters.x, y: parameters.y, alpha: parameters.alpha, display: true});
	
		return this.sources.length - 1; //Return an index for accessing the added elements
		
	}

	static RemoveSource(index)
	{
		
		UI.m_ui.RemoveSource(index);
		
	}
	
	RemoveSource(index)
	{
		
		this.sources[index].source = null; //Keeps the entry in the array, but removes the image so it is never used
		
	}
	
	static UpdateSource(index, source, parameters)
	{
	
		UI.m_ui.UpdateSource(index, source, parameters);
	
	}

	UpdateSource(index, source, parameters)
	{
	
		if(index < 0 || index >= this.sources.length)
		{
		
			Logger.LogError("Attempting to update index " + index + " with only " + this.sources.length + " sources.");
			return;
		
		}
	
		if(source || !parameters)
		{
		
			this.sources[index].source = source;
		
		}
		
		if(parameters && "x" in parameters)
		{
			
			this.sources[index].x = parameters.x;
			
		}
		
		if(parameters && "y" in parameters)
		{
			
			this.sources[index].y = parameters.y;
			
		}
		
		if(parameters && "alpha" in parameters)
		{
			
			this.sources[index].alpha = parameters.alpha;
			
		}
	
	}

	static Update()
	{
		
		UI.m_ui.Update();
		
	}
	
	Update()
	{
		
		for(var i = 0; i < this.animations.length; i++)
		{
			
			this.animations[i].anim.Update();
			
			this.sources[this.animations[i].index][this.animations[i].key] = this.animations[i].anim.Value();
			
		}
	
		this.animations = this.animations.filter(function(anim)
		{
			
			if(anim.anim.timeElapsed >= 1)
			{
				
				if(anim.anim.remove)
				{
					
					this.RemoveSource(anim.index);
					
				}
				
				return false;
				
			}
			
			return true;
			
		}, this);
		
	}
	
	static AnimateSource(index, key, old, target, time, remove)
	{
		
		UI.m_ui.AnimateSource(index, key, old, target, time, remove);
		
	}
	
	AnimateSource(index, key, old, target, time, remove)
	{
		
	
		var animation = new Animation(old, target, time, remove);
		animation.Start();
		
		this.animations.push({anim: animation, index: index, key: key});
		
		
	}
	
	static Resize(width, height)
	{
	
		UI.m_ui.Resize(width, height);
	
	}

	Resize(width, height)
	{
	
		var game = document.getElementById(CONST_GAME_CONTAINER);
		
		var bounds = game.parentElement.getBoundingClientRect();
		
		this.canvas.style.width = width + "px";
		this.canvas.style.height = height + "px";
		
		this.canvas.style.marginLeft = ((bounds.width - width) / 2) + "px";
		this.canvas.style.marginTop = ((bounds.height - height) / 2) + "px";
				
		this.Draw();
		
	}
	
	static Draw()
	{
	
		UI.m_ui.Draw();
	
	}

	Draw()
	{
	
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		for(var i = 0; i < this.sources.length; i++)
		{
		
			if(this.sources[i] && this.sources[i].source && this.sources[i].display)
			{
				
				this.context.globalAlpha = this.sources[i].alpha;
				this.context.drawImage(this.sources[i].source, this.sources[i].x * this.canvas.width, this.sources[i].y * this.canvas.height);
		
			}
			
		}
	
	}

	Stash()
	{
		
		for(var i = 0; i < this.sources.length; i++)
		{
			
			this.sources[i].display = false;
			
		}
		
	}
	
	static Stash()
	{
		
		UI.m_ui.Stash();
		
	}
	
	Unstash()
	{
		
		for(var i = 0; i < this.sources.length; i++)
		{
			
			this.sources[i].display = true;
			
		}
		
		this.Draw();
		
	}
	
	static Unstash()
	{
		
		 UI.m_ui.Unstash();
		
	}
	
}

class Animation
{
	
	constructor(old, target, time, remove)
	{
		
		this.old = old;
		this.target = target;
		this.time = time;
		
		this.start = 0;
		this.timeElapsed = 0;
		
		this.remove = remove;
		
	}
	
	Start()
	{
		
		this.start = Timer.RunningMilliseconds();
		
	}
	
	Update()
	{
		
		this.timeElapsed = Math.min((Timer.RunningMilliseconds() - this.start) / this.time, 1);
		
	}
	
	Value()
	{
		
		return this.old + ((this.target - this.old) * this.timeElapsed);
		
	}
	
}
	
UI.m_ui = null;