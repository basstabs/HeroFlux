export default class Timer
{

	constructor(game)
	{
		
		this.game = null;
		
		this.start = 0;
		this.pause = 0;
		this.running = 0;

	}

	Hook(game)
	{
	
		this.game = game;
		
	}

	static Hook(game)
	{
	
		Timer.m_globalTimer.Hook(game);
	
	}

	Time()
	{
		
		return this.game.getTime();
		
	}
	
	static Time()
	{
		
		return Timer.m_globalTimer.Time();
		
	}
	
	Reset()
	{
		
		this.start = this.Time();
		this.running = this.start;
		this.pause = 0;
		
	}
	
	static Reset()
	{
		
		Timer.m_globalTimer.Reset();
		
	}
	
	LifetimeMilliseconds()
	{

		return this.Time() - this.start;

	}

	static LifetimeMilliseconds()
	{

		return Timer.m_globalTimer.LifetimeMilliseconds();

	}

	RunningMilliseconds()
	{

		if(this.pause > 0)
		{

			return this.pause - this.running;

		}

		return this.Time() - this.running;

	}

	RunningSeconds()
	{
	
		return (this.RunningMilliseconds() / 1000);
	
	}

	static RunningMilliseconds()
	{

		return Timer.m_globalTimer.RunningMilliseconds();

	}

	static RunningSeconds()
	{
	
		return Timer.m_globalTimer.RunningSeconds();

	}
	
	Pause()
	{

		this.pause = this.Time();

	}

	static Pause()
	{

		Timer.m_globalTimer.Pause();

	}

	Unpause()
	{

		this.running = this.Time() - this.RunningMilliseconds();
		this.pause = 0;

	}

	static Unpause()
	{

		Timer.m_globalTimer.Unpause();

	}
	
}

Timer.m_globalTimer = new Timer();