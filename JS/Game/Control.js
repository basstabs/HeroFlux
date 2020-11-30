import Logger from "../Tools/Logger.js";

const CONST_CONTROL_CODE_BITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default class Control
{

	constructor()
	{
		
		this.control_functions = [this.Left, this.Right, this.Up, this.Down, this.AButton, this.BButton, this.XButton, this.YButton, this.LButton, this.RButton];
		
	}
	
	Hook(agent)
	{
		
	}
	
	Update()
	{
		
	}
	
	Movement()
	{
		
		return {x: 0, y: 0};
		
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
	
	AButton()
	{
		
		return false;
		
	}
	
	BButton()
	{
		
		return false;
		
	}
	
	XButton()
	{
		
		return false;
		
	}
	
	YButton()
	{
		
		return false;
		
	}
	
	LButton()
	{
		
		return false;
		
	}
	
	RButton()
	{
		
		return false;
		
	}
	
	Code(code)
	{
		
		for(var i = 0; i < CONST_CONTROL_CODE_BITS.length; i++)
		{
			
			var mask = 2 ** CONST_CONTROL_CODE_BITS[i];
			
			if((mask & code) && !this.control_functions[i].call(this))
			{
			
				return false;
				
			}
			
		}
		
		return true;
		
	}
	
	Shutdown()
	{
		
	}
	
}