import Logger from "../Tools/Logger.js";
import Settings from "../Tools/Settings.js";

import Control from "../Game/Control.js";

export const CONST_ACTIONS = ["left", "right", "up", "down", "A", "B", "X", "Y", "L", "R", "confirm", "pause"];

class Input extends Control
{
	
	constructor()
	{
		
		super();
		
		this.key_input = new KeyInput();
		this.pad_input = new PadInput();
		
		this.pad = false;
		
	}
	
	static Initialize(input)
	{
		
		Input.m_input = new Input();
		
		PadInput.Initialize(input);
		KeyInput.Initialize(input);
		
	}
	
	static Access()
	{
		
		return Input.m_input;
		
	}
	
	static ChangeKey(command, key)
	{
	    
	    Input.m_input.key_input.ChangeKey(command, key);
	    
	}
	
	Active()
	{
		
		return (this.pad ? this.pad_input : this.key_input);
		
	}
	
	Movement()
	{
		
		return this.Active().Movement();
		
	}
	
	Left()
	{

		return this.Active().Left();

	}

	Right()
	{

		return this.Active().Right();

	}

	Up()
	{

		return this.Active().Up();

	}

	Down()
	{

		return this.Active().Down();

	}

	AButton()
	{
		
		return this.Active().AButton();
		
	}
	
	BButton()
	{
		
		return this.Active().BButton();
		
	}
	
	XButton()
	{
		
		return this.Active().XButton();
		
	}
	
	YButton()
	{
		
		return this.Active().YButton();
		
	}
	
	LButton()
	{
		
		return this.Active().LButton();
		
	}
	
	RButton()
	{
		
		return this.Active().RButton();
		
	}
	
	DialoguePress()
	{
		
		return this.Active().DialoguePress();
		
	}
	
	DialogueSkip()
	{
		
		return this.Active().DialogueSkip();
		
	}
	
}

class PadInput extends Control
{

	constructor()
	{
		
		super();
		
	}
	
	static Initialize(input)
	{
		
	}
	
}

class KeyInput extends Control
{

	constructor()
	{
		
		super();
		
		this.keys = {};

		for(var i = 0; i < CONST_ACTIONS.length; i++)
		{

			this.keys[CONST_ACTIONS[i]] = {};

		}

        this.input = null;

	}
	
	static Initialize(input)
	{

        Input.m_input.key_input.input = input;

		var keybinds = Settings.Instance().Access("keybinds");

		for(var i = 0; i < CONST_ACTIONS.length; i++)
		{

			var data = keybinds[CONST_ACTIONS[i]];

			Input.m_input.key_input.keys[CONST_ACTIONS[i]] = input.keyboard.addKey(data.key, true, true);

		}
		
	}

    ChangeKey(command, key)
    {
        
        this.keys[command] = this.input.keyboard.addKey(key, true, true);
        
    }

	Movement()
	{
		
		var velocity = super.Movement();
		
		if(this.Left())
		{

			velocity.x += -1;

		}

		if(this.Right())
		{

			velocity.x += 1;

		}


		if(this.Up())
		{

			velocity.y -= 1;

		}

    	if(this.Down())
		{
    
			velocity.y += 1;
        
		}
		
		return velocity;
		
	}
	
	Left()
	{

		return this.keys.left.isDown;

	}

	Right()
	{

		return this.keys.right.isDown;

	}

	Up()
	{

		return this.keys.up.isDown;

	}

	Down()
	{

		return this.keys.down.isDown;

	}

	AButton()
	{
		
		return this.keys.A.isDown;
		
	}
	
	BButton()
	{
		
		return this.keys.B.isDown;
		
	}
	
	XButton()
	{
		
		return this.keys.X.isDown;
		
	}
	
	YButton()
	{
		
		return this.keys.Y.isDown;
		
	}
	
	LButton()
	{
		
		return this.keys.L.isDown;
		
	}
	
	RButton()
	{
		
		return this.keys.R.isDown;
		
	}
	
	DialoguePress()
	{
		
		return Phaser.Input.Keyboard.JustDown(this.keys.confirm);
		
	}
	
	DialogueSkip()
	{
		
		return Phaser.Input.Keyboard.JustDown(this.keys.pause);
		
	}
	
}

Input.m_input = new Input();

export default Input