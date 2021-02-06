import GameScene from "../Base/GameScene.js";
import {PoolSprite, SpriteMessage, PoolMessage, CONST_POOLSPRITE_MESSAGE_CODE, CONST_SPAWN_MESSAGE_CODE} from "../Base/PoolObject.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH} from "../Base/BaseConstants.js";
import UI from "../Base/UILayer.js";

import Logger from "../Tools/Logger.js";
import Timer from "../Tools/Timer.js";
import MessageBox from "../Tools/Messages.js";
import Parametrizer from "../Tools/Parametrizer.js";
import SoundBoard from "../Tools/SoundBoard.js";

import Code from "../Game/Code.js";
import Level, {CONST_WIN_MESSAGE_CODE, CONST_DIALOGUEENTER_MESSAGE_CODE, CONST_DIALOGUEEXIT_MESSAGE_CODE} from "../Game/Level.js";
import Input from "../Game/Input.js";
import Actor from "../Game/Actor.js";
import Kamikaze from "../Game/Kamikaze.js";
import Agent, {CONST_AGENT_NORMAL, CONST_AGENT_SCRIPT} from "../Game/Agent.js";
import Prop from "../Game/Prop.js";
import Weapon from "../Game/Weapon.js";
import Player, {CONST_PLAYER_SPAWN, CONST_PLAYER_SPAWN_STATE, CONST_PLAYER_DIALOGUE, CONST_PLAYERPAUSE_MESSAGE_CODE, CONST_PLAYERDEATH_MESSAGE_CODE } from "../Game/Player.js";
import SaveData from "../Game/SaveData.js";

import Pause from "../Scenes/Pause.js";
import GameOver from "../Scenes/GameOver.js";
import Win from "../Scenes/Win.js";

import {CONST_UI_POWER_DATA, CONST_UI_POWERGAUGE_DATA, CONST_UI_ENEMYGAUGE_DATA, CONST_UI_ENEMY_DATA} from "../Constants.js";

export const CONST_UI_LIFE_WIDTH = 360;
export const CONST_UI_LIFE_HEIGHT = 15;
export const CONST_UI_LIFE_PADDING = 8;
const CONST_UI_LIFE_X = 60;

const CONST_PLAYER_KEY = "Player";

const CONST_SCREEN_FADEOUT = 3000;

export default class Shmup extends GameScene
{
	
	constructor()
	{
	
		super("Shmup");
		
		this.level = null;
		
		this.params = {}; //Dictionary of Key => Parametrized Function pairs
		
		this.effect_keys = [];
		this.effects = {}; //Dictionary of Key => PoolSprite Pool pairs
		
		this.objects = {}; //Dictionary of Key => PoolObject Pool pairs
		
		this.active = null;
		
		this.prop_meta = [];
		this.actor_meta = [];
		this.agent_meta = [];

		this.player = null;
		
		this.ui_powerGauge = null;
		this.ui_powerGauge_index = -1;
		
		this.ui_power = null;
		this.ui_power_index = -1;
		
		this.ui_enemyGauge = null;
		this.ui_enemyGauge_index = -1;
		
		this.ui_enemyPower = null;
		this.ui_enemyPower_index = -1;
		
		this.life_bar = null;
		this.life = null;
		this.life_markers = null;
		
		this.hooked_enemy = null;
		
		this.screenTransition = false;
		this.win = false;
		
	}
	
	init(data)
	{
		
		this.remove_data = data;
		this.original_data = JSON.parse(JSON.stringify(data));
		
	}
	
	create()
	{
		
		this.CleanMessages();
		
		this.active = this.physics.add.group({runChildUpdate: true, collideWorldBounds: false});
		
		Input.Initialize(this.input);
		
		this.data = this.PrepareData();
		
		this.CreateLevel(this.data.level);
		
		this.CreatePlayer(this.data.player);
		
		this.CreateAgents(this.data.agents);
		
		this.CreateActors(this.data.actors);
		
		this.CreateProps(this.data.props);
		
		this.CreateEffects(this.data.effects);
		
		this.CreateUI();
		
		Timer.Reset();
		this.level.Start();
	
		this.player.ChangeState(CONST_PLAYER_SPAWN, CONST_PLAYER_SPAWN_STATE);
		
		this.active.add(this.player);
		this.SetCollisions();
		
	}

	CleanMessages()
	{
		
		//Remove all spawn messages in case they are left over from a previous level
		var message = MessageBox.PullMessage(CONST_SPAWN_MESSAGE_CODE);
        while(!message.IsEmpty())
        {
			
			message = MessageBox.PullMessage(CONST_SPAWN_MESSAGE_CODE);
			
		}
		
		//Determine if new effects need to be displayed
		message = MessageBox.PullMessage(CONST_POOLSPRITE_MESSAGE_CODE);
		while(!message.IsEmpty())
		{
		
			message = MessageBox.PullMessage(CONST_POOLSPRITE_MESSAGE_CODE);
			
		}
		
	}
	
	PrepareData()
	{
		
		var cache = this.cache.json.get("LevelData");
		var json = JSON.parse(JSON.stringify(cache));
		
		for(var i = 0; i < json.props.length; i++)
		{
			
			json.props[i].prop = this.cache.json.get("Props/" + json.props[i].prop);
			
		}
		
		for(var i = 0; i < json.actors.length; i++)
		{
			
			json.actors[i].actor = this.cache.json.get("Actors/" + json.actors[i].actor);
			
		}
		
		for(var i = 0; i < json.agents.length; i++)
		{
			
			json.agents[i].agent = this.cache.json.get("Agents/" + json.agents[i].agent);
			
		}
		
		for(var i= 0; i < json.effects.length; i++)
		{
			
			json.effects[i].effect = this.cache.json.get("Effects/" + json.effects[i].effect);
			
		}
		
		json.player = this.cache.json.get("PlayerData");
		
		json.level = this.cache.json.get(json.level);
		
		return JSON.parse(JSON.stringify(json));
		
	}
	
	LoadParam(param)
	{
		
		if(!this.params.hasOwnProperty(param))
		{
		
			this.params[param] = Parametrizer.CreateParametrization(param);
			
		}
		
		return this.params[param];
		
	}

	AimingTarget(obj, code, actor, agent)
	{
	
		var isActive = function(obj)
		{
		
			return obj.active;
		
		};
	
		var objects = [];
	
		if(actor)
		{
		
			for(var i = 0; i < this.actor_meta.length; i++)
			{
		
				if(Code.Interact(code, this.actor_meta[i].code))
				{
			
					objects = objects.concat(this.objects[this.actor_meta[i].key].getChildren().filter(isActive));
			
				}
		
			}
	
		}
		
		if(agent)
		{
		
			for(var i = 0; i < this.agent_meta.length; i++)
			{
		
				if(Code.Interact(code, this.agent_meta[i].code))
				{
			
					objects = objects.concat(this.objects[this.agent_meta[i].key].getChildren().filter(isActive));
			
				}
			
			}
	
		}
		
		var target = this.physics.closest(obj, objects);
	
		var direction = new Phaser.Math.Vector2((Code.Friendly() ? 1 : -1), 0);
		if(target)
		{
		
			var direction = new Phaser.Math.Vector2(target.x - obj.x, target.y - obj.y);
			direction.normalize();
		
		}
		
		return direction;
	
	}

	CreateLevel(json)
	{
		
		for(var i = 0; i < json.level.stages.length; i++)
		{
			
			json.level.stages[i].background_param = this.LoadParam(json.level.stages[i].background_param);
		
		}
		
		this.level = new Level(this, json.background, json.warning, json.level);
		
	}
	
	CreatePlayer(player)
	{
	
		this.objects[CONST_PLAYER_KEY] = this.physics.add.group({runChildUpdate: false, collideWorldBounds: true});
		
		var texture = this.textures.get(player.texture);
		
		var json = player.agent;
		
		for(var i = 0; i < json.weapons.length; i++)
		{
		
			json.weapons[i].weapon = this.cache.json.get(json.weapons[i].weapon);
		
		}
	
		SaveData.ModifyPlayer(this, player);
		
		this.player = new Player(this, texture, player.code, player);
		this.objects[CONST_PLAYER_KEY].add(this.player, true);
		
		this.player.SetBounds(json.bounds);
		this.player.SetControl(this, json.control);
		
		this.agent_meta[0] = {};
		this.agent_meta[0].key = CONST_PLAYER_KEY;
		this.agent_meta[0].code = player.code;
		
	}
		
	CreateAgents(agents)
	{

		for(var i = 0; i < agents.length; i++)
		{
			
			var agent = agents[i].agent;
			
			this.objects[agent.key] = this.physics.add.group({runChildUpdate: true, collideWorldBounds: agent.collide});
			
			var texture = this.textures.get(agent.texture);
			
			var json = agent.agent;
			
			for(var j = 0; j < json.weapons.length; j++)
			{
				
				json.weapons[j].weapon = this.cache.json.get(json.weapons[j].weapon);
				
			}
			
			for(var j = 0; j < agents[i].poolSize; j++)
			{
				
				var newAgent = new Agent(this, agent.key, texture, agent.code, json);
				this.objects[agent.key].add(newAgent, true);
				
				newAgent.SetBounds(json.bounds);
				
				newAgent.SetControl(this, json.control);
				
			}
			
			//Player is i = 0
			this.agent_meta[i + 1] = {};
			this.agent_meta[i + 1].key = agent.key;
			this.agent_meta[i + 1].code = agent.code;
			
		}
		
	}
	
	CreateActors(actors)
	{
		
		for(var i = 0; i < actors.length; i++)
		{
			
			var actor = actors[i].actor;
			
			this.objects[actor.key] = this.physics.add.group({runChildUpdate: true});
			
			var texture = this.textures.get(actor.texture);
			
			var json = actor.actor;
			
			for(var j = 0; j < json.weapons.length; j++)
			{
				
				json.weapons[j].weapon = this.cache.json.get(json.weapons[j].weapon);
				
			}
			
			for(var j = 0; j < actors[i].poolSize; j++)
			{
				
				var newActor = (actor.kamikaze ? new Kamikaze(this, texture, json, actor.code) : new Actor(this, texture, json, actor.code));
				this.objects[actor.key].add(newActor, true);
				
				newActor.SetBounds(json.bounds);
				
			}
			
			this.actor_meta[i] = {};
			this.actor_meta[i].key = actor.key;
			this.actor_meta[i].code = actor.code;
			
		}
		
	}
	
	CreateProps(props)
	{

		for(var i = 0; i < props.length; i++)
		{
			
			var prop = props[i].prop;
			
			this.objects[prop.key] = this.physics.add.group({runChildUpdate: true});
			
			var texture = this.textures.get(prop.texture);
			
			for(var j = 0; j < props[i].poolSize; j++) //Create a pool for each type of bullet
			{
				
				var newProp = new Prop(this, texture, prop.tracking, prop.value, prop.hostile, 0, prop.death, prop.death_instruction, prop.code);
				this.objects[prop.key].add(newProp, true);
				
				newProp.SetBounds(prop.bounds);
				
			}
			
			this.prop_meta[i] = {};
			this.prop_meta[i].key = prop.key;
			this.prop_meta[i].code = prop.code;
	
		}
		
	}
	
	CreateUI()
	{
		
		//Player UI
		this.ui_powerGauge = this.textures.get("PowerGauge");
		
		this.ui_powerGauge_index = UI.AddSource(this.ui_powerGauge.source[0].source, CONST_UI_POWERGAUGE_DATA);
		
		this.ui_power = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, this.player.Power().toString(), {fontFamily: "silkscreen", fontSize: CONST_UI_POWER_DATA.size, color: CONST_UI_POWER_DATA.color});
		this.ui_power.setOrigin(1, 0.5);
		
		this.ui_power_index = UI.AddSource(this.ui_power.canvas, CONST_UI_POWER_DATA);
		
		//Enemy UI
		this.ui_enemyGauge = this.textures.get("EnemyGauge");
		
		this.ui_enemyGauge_index = UI.AddSource(this.ui_enemyGauge.source[0].source, CONST_UI_ENEMYGAUGE_DATA);
		
		this.ui_enemyPower = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "500", {fontFamily: "silkscreen", fontSize: CONST_UI_ENEMY_DATA.size, color: CONST_UI_ENEMY_DATA.color});
		this.ui_enemyPower.setOrigin(1, 0.5);
		
		this.ui_enemyPower_index = UI.AddSource(this.ui_enemyPower.canvas, CONST_UI_ENEMY_DATA);
		
		this.life_bar = this.add.image(CONST_UI_LIFE_X, 0, "LifeBar");
		this.life_bar.setOrigin(0, 0);
		this.life_bar.setVisible(false);
		
		this.life = this.add.sprite(CONST_UI_LIFE_X + (this.life_bar.displayWidth / 2), 0, "Life");
		this.life.setOrigin(0.5, 0);
		this.life.anims.play("Life-Idle");
		this.life.setVisible(false);
	
		this.life_markers = this.add.group();
		
	}
	
	SetCollisions()
	{
	
		/*var meta = this.agent_meta.concat(this.actor_meta);
	
		for(var i = 0; i < meta.length; i++)
		{
		
			for(var j = i + 1; j < meta.length; j++)
			{
			
				if(Code.Interact(meta[i].code, meta[j].code))
				{
				
					this.physics.add.overlap(this.objects[meta[i].key], this.objects[meta[j].key], HandleActorOverlap, ProcessOverlap);
				
				}
			
			}
		
			for(var j = 0; j < this.prop_meta.length; j++)
			{
			
				if(Code.Interact(meta[i].code, this.prop_meta[j].code))
				{
				
					this.physics.add.overlap(this.objects[meta[i].key], this.objects[this.prop_meta[j].key], HandlePropOverlap, ProcessOverlap);
				
				}
			
			}
		
		}
		*/
		
		this.physics.add.overlap(this.active.children.entries, false, HandleOverlap, ProcessOverlap);
		
	}
	
	Deactivate(obj)
	{
		
		this.active.remove(obj);
		
	}
	
	CreateEffects(effects)
	{

		for(var i = 0; i < effects.length; i++)
		{
			
			var effect = effects[i].effect;
			
			this.effects[effect.key] = this.add.group({runChildUpdate: true});
			
			var texture = this.textures.get(effect.texture);
			
			for(var j = 0; j < effects[i].poolSize; j++) //Create a pool for each effect type
			{
				
				var duration = this.anims.get(effect.key).duration;
				var newEffect = new PoolSprite(this, texture, duration, effect.audio);
				this.effects[effect.key].add(newEffect, true);
				
			}
			
			this.effect_keys[i] = effect.key;
			
		}
		
	}
	
	update()
	{
		
		if(!this.win)
		{
		
			this.level.Update();
		
			this.UpdatePlayer();
		
			this.ProcessMessages();
		
		}
		
		this.UpdateUI();
		
	}
	
	UpdatePlayer()
	{
	
		if(!this.player.active)
		{
		
			if(this.player.Power() >= this.player.death_power)
			{
			
				this.active.add(this.player);
				
				this.player.PowerUp(-this.player.death_power);
			
				this.player.ChangeState(CONST_PLAYER_SPAWN, CONST_PLAYER_SPAWN_STATE);
			
			}
			else
			{
			
				this.GameOver();
			
			}
		
		}
	
		//Determine if dialogue messages need to be processed
		var message = MessageBox.PullMessage(CONST_DIALOGUEENTER_MESSAGE_CODE);
        if(!message.IsEmpty())
		{
			
			var data = {update: false, enter: {}, exit: {}, duration: 0, animation: ""};
			this.player.ChangeState(CONST_PLAYER_DIALOGUE, data);
			
		}
		
		
		message = MessageBox.PullMessage(CONST_DIALOGUEEXIT_MESSAGE_CODE);
		if(!message.IsEmpty())
		{
		
			var data = {update: false, enter: {}, exit: {}, duration: 0, animation: ""};
			this.player.ChangeState(CONST_AGENT_NORMAL, data);
			
		}
		
		//Determine if the player wants to pause the game
		message = MessageBox.PullMessage(CONST_PLAYERPAUSE_MESSAGE_CODE);
		if(!message.IsEmpty())
		{
		
			this.Pause();
			
		}
		
	}
	
	ProcessMessages()
	{
		
		//Determine if new objects need to be fired
		var message = MessageBox.PullMessage(CONST_SPAWN_MESSAGE_CODE);
        while(!message.IsEmpty())
        {
        
        	var obj = this.objects[message.Key()].getFirst(false);
			
			if(obj)
			{
				
				var scaleX = (message.World() ? this.physics.world.bounds.width : 1);
				var scaleY = (message.World() ? this.physics.world.bounds.height : 1);
				
				obj.Launch(message.X() * scaleX, message.Y() * scaleY, this.LoadParam(message.XParam()), this.LoadParam(message.YParam()), message.Theta(), message.Key() + "-Idle");
				obj.anims.play(message.Key() + "-Idle");
				obj.anims.setRepeat(-1);
				
				this.active.add(obj, false);
				
			}
			else
			{
			
				Logger.LogWarning(message.Key() + " ran out of usable elements.");
				
			
			}

			message = MessageBox.PullMessage(CONST_SPAWN_MESSAGE_CODE);
			
		}
		
		//Determine if new effects need to be displayed
		message = MessageBox.PullMessage(CONST_POOLSPRITE_MESSAGE_CODE);
        while(!message.IsEmpty())
        {

			var effect = this.effects[message.Key()].getFirst(false);
			
			if(effect)
			{
				
				effect.Display(message.X(), message.Y());
				effect.anims.play(message.Key());
				effect.anims.setRepeat(0);
				
			}
			else
			{
			
				Logger.LogWarning(message.Key() + " ran out of usable elements.");
				
			}
			
        	message = MessageBox.PullMessage(CONST_POOLSPRITE_MESSAGE_CODE);

        }
		
		//Determine if the level is complete
		message = MessageBox.PullMessage(CONST_WIN_MESSAGE_CODE);
		if(!message.IsEmpty())
		{
			
			this.Win();
			
		}
		
	}

	HookEnemy(agent, markers)
	{
		
		this.hooked_enemy = agent;
		
		UI.AnimateSource(this.ui_enemyGauge_index, "alpha", 0, CONST_UI_POWERGAUGE_DATA.alpha, 0, false);
		UI.AnimateSource(this.ui_enemyPower_index, "alpha", 0, 1, 0, false);
		
		for(var i = 0; i < markers.length; i++)
		{
			
			this.life_markers.add(this.add.image(CONST_UI_LIFE_X + (CONST_UI_LIFE_WIDTH / 2) - (((CONST_UI_LIFE_WIDTH / 2) - CONST_UI_LIFE_PADDING) * markers[i]), 0, "LifeMarker").setOrigin(0.5, 0));
			this.life_markers.add(this.add.image(CONST_UI_LIFE_X + (CONST_UI_LIFE_WIDTH / 2) + (((CONST_UI_LIFE_WIDTH / 2) - CONST_UI_LIFE_PADDING) * markers[i]), 0, "LifeMarker").setOrigin(0.5, 0));
			
		}
		
		this.life.setVisible(true);
		this.life_bar.setVisible(true);
		
	}
	
	UnhookEnemy()
	{
		
		this.hooked_enemy = null;
		
		UI.AnimateSource(this.ui_enemyGauge_index, "alpha", CONST_UI_POWERGAUGE_DATA.alpha, 0, 0, false);
		UI.AnimateSource(this.ui_enemyPower_index, "alpha", 1, 0, 0, false);
		
		this.life_markers.clear(false, true);
		
		this.life.setVisible(false);
		this.life_bar.setVisible(false);
		
	}
	
	UpdateUI()
	{
	
		this.ui_power.setText(this.player.Power().toString());
	
		this.ui_power.setColor(CONST_UI_POWER_DATA.color);
		if(this.player.Power() == this.player.max_power)
		{
			
			this.ui_power.setColor(CONST_UI_POWER_DATA.max_color);
			
		}
		else if(this.player.Power() <= 0)
		{
		
			this.ui_power.setColor(CONST_UI_POWER_DATA.out_color);
			
		}
		else if(this.player.Power() <= 0.2 * this.player.max_power)
		{
			
			this.ui_power.setColor(CONST_UI_POWER_DATA.low_color);
			
		}
		
		if(this.hooked_enemy)
		{
			
			this.ui_enemyPower.setText(this.hooked_enemy.Power().toString());
			
			var enemy_health = this.hooked_enemy.health / this.hooked_enemy.maxHealth;
			this.life.setScale(enemy_health, 1);
			
		}
		else
		{
			
			this.ui_enemyPower.setText("0");
			
		}
	
		UI.UpdateSource(this.ui_enemyPower_index, null, {x: CONST_UI_ENEMY_DATA.x - (this.ui_enemyPower.displayWidth / CONST_UI_WIDTH)});
		
		UI.Update();
		UI.Draw();
	
	}
	
	GameOver()
	{
	
		if(!this.screenTransition)
		{
			
			this.cameras.main.once('camerafadeoutcomplete', function(camera)
			{
				
				this.scene.remove("Shmup");

				var image = null;
				var message = MessageBox.PullMessage(CONST_PLAYERDEATH_MESSAGE_CODE);
				while(!message.IsEmpty())
				{
					
					image = message.Image();
					message = MessageBox.PullMessage(CONST_PLAYERDEATH_MESSAGE_CODE);
					
				}
				
				var data = {image: image, remove: this.RemoveData()};
			
				this.scene.add("GameOver", GameOver);
				
				this.Start("GameOver", data);
			
			}, this);
		
			this.cameras.main.fadeOut(CONST_SCREEN_FADEOUT, 0, 0, 0);
		
			this.screenTransition = true;
		
		}
		
	}
	
	Win()
	{
		
		this.win = true;
		this.player.setCollideWorldBounds(false);
		
		var data = {update: true, exit: {}, enter: {xParam: this.LoadParam(this.player.x + "+(" + CONST_PLAYER_SPAWN_STATE.enter.xParam + "*t)"), yParam: this.LoadParam(this.player.y + "+(" + CONST_PLAYER_SPAWN_STATE.enter.yParam + "*t)")}, duration: CONST_SCREEN_FADEOUT, animation: "Player-Spawn"};
		this.player.ChangeState(CONST_AGENT_SCRIPT, data);
		
		SoundBoard.Play("SpawnAudio");
		
		if(!this.screenTransition)
		{
		
			this.cameras.main.once('camerafadeoutcomplete', function(camera)
			{
				
				this.scene.remove("Shmup");
				
				var data = this.RemoveData();
			
				this.scene.add("Win", Win);
				
				this.Start("Win", data);
			
			}, this);
		
			this.cameras.main.fadeOut(CONST_SCREEN_FADEOUT, 0, 0, 0);
			
			this.screenTransition = true;
			
		}
		
		UI.AnimateSource(this.ui_powerGauge_index, "alpha", 1, 0, CONST_SCREEN_FADEOUT, true);
		UI.AnimateSource(this.ui_power_index, "alpha", 1, 0, CONST_SCREEN_FADEOUT, true);
		
	}
	
	Pause()
	{
		
		Timer.Pause();
		
		this.scene.pause();
		
		this.scene.add("Pause", Pause);
		this.scene.launch("Pause");
		
		Logger.LogDebug(Timer.RunningMilliseconds());
		
		this.events.on("resume", function()
		{
			
			Timer.Unpause();
		
			Input.Initialize(this.input);
			
		}, this);
	}

	RemoveData()
	{
		
		var json = this.cache.json.get("LevelData");
		this.remove_data.push({type: "json", id: "LevelData"});
		
		for(var i = 0; i < json.props.length; i++)
		{
			
			this.remove_data.push({type: "json", id: "Props/" + json.props[i].prop});
			
		}
		
		for(var i = 0; i < json.actors.length; i++)
		{
			
			this.remove_data.push({type: "json", id: "Actors/" + json.actors[i].actor});
			
		}
		
		for(var i = 0; i < json.agents.length; i++)
		{
			
			this.remove_data.push({type: "json", id: "Agents/" + json.agents[i].agent});
			
		}
		
		for(var i= 0; i < json.effects.length; i++)
		{
			
			this.remove_data.push({type: "json", id: "Effects/" + json.effects[i].effect});
			
		}
		
		this.remove_data.push({type: "json", id: "PlayerData"});
		this.remove_data.push({type: "json", id: json.level});
		
		this.remove_data.original = this.original_data;
		
		return this.remove_data;
		
	}
	
}

function HandleOverlap(obj1, obj2)
{

	obj1.Handle(obj2);
	obj2.Handle(obj1);
	
}

function ProcessOverlap(obj1, obj2)
{
	
	return (Code.Interact(obj1.code, obj2.code) && obj1.active && obj2.active && !obj1.die && !obj2.die && (!obj2.Invulnerable() || !obj1.Hostile()) && (!obj1.Invulnerable() || !obj2.Hostile()));
		
}