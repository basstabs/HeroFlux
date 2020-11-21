import BaseScene from "../Base/Scene.js";

export default class GameScene extends BaseScene
{
	
	constructor(type)
	{
	
		super(type);
		
	}

	create()
	{
		
		Logger.LogError("Attempting to call abstract create method.");
		
	}
	
}