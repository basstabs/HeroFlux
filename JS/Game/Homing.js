import Kamikaze from "../Game/Kamikaze.js";

import Parametrizer from "../Tools/Parametrizer.js";
import Timer from "../Tools/Timer.js";

export default class Homing extends Kamikaze
{
	
	constructor(scene, texture, json, code, textureKey)
	{
		
		super(scene, texture, json, code, textureKey);
		
		this.last = 0;
		
	}
	
	update()
	{
		
		super.update();
		
		if((Timer.RunningMilliseconds() - this.last) >= this.aimed.delay)
		{
			
			var direction = this.scene.AimingTarget(this, this.code, this.aimed.actor, this.aimed.agent);
			direction.scale(this.aimed.speed);
			
			this.xParam = Parametrizer.ConstantFunction(direction.x);
			this.yParam = Parametrizer.ConstantFunction(direction.y);
		
			this.last = Timer.RunningMilliseconds();
			
		}
		
	}
	
}