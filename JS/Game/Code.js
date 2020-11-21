const CONST_CODE_TEAM_BIT = 0;
const CONST_CODE_PICKUP_BIT = 1;
const CONST_CODE_ISPICKUP_BIT = 2;

const CONST_CODE_ENEMY_TEAM = 1;

export default class Code
{

	static Interact(code1, code2)
	{
	
		//Check if the codes are on opposite teams
		var team_mask = 2 ** CONST_CODE_TEAM_BIT;
		var team1 = (code1 & team_mask);
		var team2 = (code2 & team_mask);
		
		if(team1 === team2)
		{
		
			return false; //Objects on the same team do not interact
			
		}
		
		var pickup_mask = 2 ** CONST_CODE_PICKUP_BIT;
		var ispickup_mask = 2 ** CONST_CODE_ISPICKUP_BIT;
		var pickup1 = (code1 & pickup_mask);
		var pickup2 = (code2 & pickup_mask);
		var ispickup1 = (code1 & ispickup_mask);
		var ispickup2 = (code2 & ispickup_mask);
		
		if((!pickup2 && ispickup1) || (!pickup1 && ispickup2))
		{
		
			return false; //Non-pickup objects should not interact with pickups
		
		}
		
		return true;
		
	}
	
	static Enemy(code)
	{
	
		var team_mask = 2 ** CONST_CODE_TEAM_BIT;
		var team = (code & team_mask);
		
		return (team === CONST_CODE_ENEMY_TEAM);
	
	}
	
	static Friendly(code)
	{
	
		return !Code.Enemy(code);
		
	}
	
	static Pickup(code)
	{
		
		var pickup_mask = 2 ** CONST_CODE_PICKUP_BIT;
		var pickup = (code & pickup_mask);
		
		return (pickup === pickup_mask);
		
	}
	
}
