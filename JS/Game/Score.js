import MessageBox, {Message} from "../Tools/Messages.js";

const CONST_PICKUP_POINTS = 10;
const CONST_PICKUP_MULTIPLIER_INCREMENT = 0.1;

const CONST_SCORE_MESSAGE_CODE = "score";

export default class Score
{

	static WipeScore()
	{
		
		var message = MessageBox.PullMessage(CONST_SCORE_MESSAGE_CODE);
		while(!message.IsEmpty())
		{
		
			message = MessageBox.PullMessage(CONST_SCORE_MESSAGE_CODE);
			
		}
			
	}
	
	static ComputeScore()
	{
		
		var score = 0;
		var pickupMultiplier = 1;
		
		var message = MessageBox.PullMessage(CONST_SCORE_MESSAGE_CODE);
		while(!message.IsEmpty())
		{
			
			if(message.Score() < 0)
			{
				
				pickupMultiplier = 1;
				
			}
			
			if(message.Pickup())
			{
				
				score += (message.Score() * pickupMultiplier);
				
				pickupMultiplier += CONST_PICKUP_MULTIPLIER_INCREMENT;
				
			}
			else
			{
			
				score += (message.Score());
				
			}
			
			message = MessageBox.PullMessage(CONST_SCORE_MESSAGE_CODE);
			
		}
		
		return Math.max(0, Math.floor(score));
		
	}
	
}

export class ScorePickupMessage extends Message
{

	constructor()
	{
		
		super(CONST_SCORE_MESSAGE_CODE);
		
	}
	
	Score()
	{
		
		return CONST_PICKUP_POINTS;
		
	}
	
	Pickup()
	{
		
		return true;
		
	}
	
}

export class ScoreMessage extends Message
{
	
	constructor(score)
	{
		
		super(CONST_SCORE_MESSAGE_CODE);

		this.score = score;
		
	}
	
	Score()
	{
		
		return this.score;
		
	}
	
	Pickup()
	{
		
		return false;
		
	}
	
}