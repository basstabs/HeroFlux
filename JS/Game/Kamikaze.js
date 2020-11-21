import Actor from "../Game/Actor.js";
import Code from "../Game/Code.js";

export default class Kamikaze extends Actor
{
	
	constructor(scene, texture, json, code)
	{
		
		super(scene, texture, json, code);
		
	}
	
	Handle(obj)
	{
		
		super.Handle(obj);

		if(Code.Pickup(obj.code))
		{
			
			this.Pool();
		
		}
		
	}
	
}