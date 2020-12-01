import BaseScene from "../Base/Scene.js";

import SoundBoard from "../Tools/SoundBoard.js";

export default class MenuSceen extends BaseScene
{
	
	constructor(type)
	{
	
		super(type);
		
	}
	
	init(data)
	{
		
	}
	
	preload()
	{
		
		super.preload();
		
		SoundBoard.Initialize(this);
		
	}
	
	create()
	{
		
	}
	
	update()
	{

	}

}