export default class SaveData
{
	
	constructor()
	{
		
		this.total_power = 0;
		
		this.total_kills = 0;
		
		this.scores = {}; //Dictionary of key => integer pairs
		
		this.ccs = {}; //Dictionary of key => boolean pairs
		
		this.unlocks = [];
		
	}
	
	LoadPlayerData(base)
	{
		
		var player = {};
		
		var total_power = window.localStorage.getItem("PlayerTotalPower");
		if(total_power !== null)
		{
			
			player.total_power = parseInt(total_power);
			
		}
		else
		{
		
			player.total_power = 0;
			
		}
		
		var total_kills = window.localStorage.getItem("PlayerTotalKills");
		if(total_kills !== null)
		{
		    
		    player.total_kills = parseInt(total_kills);
		    
		}
		else
		{
		
		    player.total_kills = 0;
		    
		}
		
		var scores = window.localStorage.getItem("PlayerScores");
		if(scores !== null)
		{
		
			player.scores = JSON.parse(scores);
			
		}
		else
		{
			
			player.scores = base.scores;
			
		}
		
		var ccs = window.localStorage.getItem("PlayerCCs");
		if(ccs !== null)
		{
		    
		    player.ccs = JSON.parse(ccs);
		    
		}
		else
		{
		    
		    player.ccs = base.ccs;
		    
		}
		
		var unlocks = window.localStorage.getItem("PlayerUnlocks");
		if(unlocks !== null)
		{
		
			player.unlocks = JSON.parse(unlocks);
			
		}
		else
		{
			
			player.unlocks = base.unlocks;
			
		}
		
		return player;
		
	}
	
	SavePlayerData()
	{
		
		window.localStorage.setItem("PlayerTotalPower", this.total_power);
		
		window.localStorage.setItem("PlayerTotalKills", this.total_kills);
		
		window.localStorage.setItem("PlayerScores", JSON.stringify(this.scores));
		
		window.localStorage.setItem("PlayerCCs", JSON.stringify(this.ccs));
		
		window.localStorage.setItem("PlayerUnlocks", JSON.stringify(this.unlocks));
		
	}
	
	static SavePlayerData()
	{
		
		SaveData.m_save.SavePlayerData();
		
	}
	
	LoadData(scene)
	{
		
		var baseData = JSON.parse(JSON.stringify(scene.cache.json.get("SaveDataBase")));
		
		var playerData = this.LoadPlayerData(baseData);
		
		this.total_power = playerData.total_power;
		this.total_kills = playerData.total_kills;
		
		for(var i = 0; i < baseData.unlocks.length; i++)
		{
			
			this.unlocks[i] = new Unlock(baseData.unlocks[i].key, baseData.unlocks[i].cost, (playerData.unlocks[i].open ? true : false));
			
		}
		
		this.scores = playerData.scores;
		this.ccs = playerData.ccs;
		
	}
	
	static LoadData(scene)
	{
		
		SaveData.m_save.LoadData(scene);
		
	}
	
	CurrentPower()
	{
		
		var pow = this.total_power;
		
		//Remove power for unlocked items
		for(var i = 0; i < this.unlocks.length; i++)
		{
			
			if(this.unlocks[i].Open())
			{
				
				pow -= this.unlocks[i].Cost();
				
			}
			
		}
		
		return pow;
		
	}
	
	static CurrentPower()
	{
		
		return SaveData.m_save.CurrentPower();
		
	}
	
	CurrentKills()
	{
	    
	    return this.total_kills;
	    
	}
	
	static CurrentKills()
	{
	    
	    
	    return SaveData.m_save.CurrentKills();
	    
	}
	
	AddKill()
	{
	    
	    this.total_kills += 1;
	    
	}
	
	static AddKill()
	{
	    
	    SaveData.m_save.AddKill();
	    
	}
	
	AddPower(power)
	{
		
		this.total_power += power;
		
	}
	
	static AddPower(power)
	{
		
		SaveData.m_save.AddPower(power);
		
	}
	
	SetScore(level, score)
	{
		
		this.scores[level] = (this.scores[level] ? Math.max(score, this.scores[level]) : score);
		
		this.SavePlayerData();
		
	}
	
	static SetScore(level, score)
	{
		
		SaveData.m_save.SetScore(level, score);
		
	}
	
	Score(level)
	{
		
		return 1;
		//return (this.scores[level] ? this.scores[level] : 0);
		
	}
	
	static Score(level)
	{
		
		return SaveData.m_save.Score(level);
		
	}
	
	static CC(level)
	{
	    
	    SaveData.m_save.CC(level);
	    
	}
	
	CC(level)
	{
	    
	    this.ccs[level] = true;
	    
	}
	
	HasCCed(level)
	{
	    
	    return this.ccs[level];
	    
	}
	
	static HasCCed(level)
	{
	    
	    return SaveData.m_save.HasCCed(level);
	    
	}
	
	LockCost(key)
	{
	    
	    var unlock = this.unlocks.find(function(unlock)
	    {
	        
	        return unlock.Key() === key;
	        
	    });
	    
	    return unlock.Cost();
	    
	}
	
    static LockCost(key)
    {
        
        return SaveData.m_save.LockCost(key);
        
    }
	
	OpenLock(key)
	{
		
		for(var i = 0; i < this.unlocks.length; i++)
		{
			
			if(this.unlocks[i].Key() === key)
			{
				
				this.unlocks[i].Unlock();
				
				this.SavePlayerData();
				
				return;
				
			}
			
		}
		
	}
	
	static OpenLock(key)
	{
		
		SaveData.m_save.OpenLock(key);
		
	}
	
}

SaveData.m_save = new SaveData();

class Unlock
{
	
	constructor(key, cost, open)
	{
		
		this.cost = cost;
		this.open = open;
		
		this.key = key;
		
	}
	
	Unlock()
	{
		
		this.open = true;
		
	}
	
	Open()
	{
		
		return this.open;
		
	}
	
	Cost()
	{
		
		return this.cost;
		
	}
	
	Key()
	{
		
		return this.key;
		
	}
	
}