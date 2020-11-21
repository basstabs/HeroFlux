export default class MathLibrary
{

	static RandomChance(chance)
	{
	
		var roll = MathLibrary.RandomFloat(0,1);
		
		return (roll < chance);
	
	}
	
	//[min, max)
	static RandomFloat(min, max)
	{

		return min + (Math.random() * (max - min));

	}

	//Min inclusive, max exclusive
	static RandomInteger(min, max)
	{

		return Math.floor(MathLibrary.RandomFloat(min, max));

	}

}