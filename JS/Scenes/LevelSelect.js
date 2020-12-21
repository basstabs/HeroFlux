import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";
import Config from "../Base/Config.js";
import UI from "../Base/UILayer.js";

import Settings from "../Tools/Settings.js";
import SoundBoard from "../Tools/SoundBoard.js";

import SaveData from "../Game/SaveData.js";

import Title from "../Scenes/Title.js";
import LevelPreloader from "../Scenes/LevelPreloader.js";
import Shmup from "../Scenes/Shmup.js";
import Win from "../Scenes/Win.js";
import GameOver from "../Scenes/GameOver.js";

const CONST_LEVELSELECT_DISPLAYSTART_X = 1.1;

const CONST_LEVELSELECT_START_X = 0.3;
const CONST_LEVELSELECT_START_Y = 0.025;
const CONST_LEVELSELECT_STEP_X = 0.05;
const CONST_LEVELSELECT_STEP_Y = 0.1;

const CONST_LEVELSELECT_SCOREOFFSET_X = 0.2;
const CONST_LEVELSELECT_SCOREOFFSET_Y = 0.06;

const CONST_LEVELSELECT_ACTIVE_FONT = {fontFamily: "chunk", fontSize: "125px", color: "#8AF1FF", highlight: "#F9E113"};
const CONST_LEVELSELECT_DISABLED_FONT = {fontFamily: "chunk", fontSize: "125px", color: "#444444"};
const CONST_LEVELSELECT_SCORE_FONT = {fontFamily: "silkscreen", fontSize: "80px", color: "#44FF44"};

const CONST_PLAYER_PROPS = [{prop: "Laser", poolSize: 15}, {prop: "Beam", poolSize: 30}, {prop: "MiniFireball", poolSize: 15}, {prop: "Pickup", poolSize: 30}];
const CONST_PLAYER_ACTORS = [{actor: "Fireball", poolSize: 4}];
const CONST_PLAYER_EFFECTS = [{effect: "Laser-Death", poolSize: 15}, {effect: "Beam-Death", poolSize: 15}, {effect: "Fireball-Death", poolSize: 4}, {effect: "Pickup-Death", poolSize: 10}, {effect: "MiniFireball-Death", poolSize: 15}];

export default class Options extends MenuScene
{
	
	constructor()
	{
	
		super("LevelSelect");
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("LevelSelectScreen");
		data = JSON.parse(JSON.stringify(data));
		
		var levelData = this.cache.json.get("Levels");
		
		var time = data.items[0].display.animations[0].time;
		
		var alphaAnimation = {};
		alphaAnimation.key = "alpha";
		alphaAnimation.start = 0;
		alphaAnimation.target = 1;
		alphaAnimation.time = time;
		
		for(var i = 0; i < levelData.length; i++)
		{
			
			var newItem = {};
			
			newItem.x = CONST_LEVELSELECT_START_X + (i * CONST_LEVELSELECT_STEP_X);
			newItem.y = CONST_LEVELSELECT_START_Y + (i * CONST_LEVELSELECT_STEP_Y);
			
			var active = false;
			
			if(SaveData.Score(levelData[i].level) > 0)
			{
				
				var scoreItem = {};
				
				scoreItem.text = "Score: " + SaveData.Score(levelData[i].level);
				scoreItem.font = CONST_LEVELSELECT_SCORE_FONT;
				
				scoreItem.display = {};
				scoreItem.display.start = {};
				scoreItem.display.start.x = newItem.x + CONST_LEVELSELECT_SCOREOFFSET_X;
				scoreItem.display.start.y = -0.1;
				scoreItem.display.start.alpha = 0;
			
				scoreItem.display.animations = [];
			
				var yAnimation = {};
				yAnimation.key = "y";
				yAnimation.start = -0.1;
				yAnimation.target = newItem.y + CONST_LEVELSELECT_SCOREOFFSET_Y;
				yAnimation.time = time * 1.25;
			
				scoreItem.display.animations.push(yAnimation);
				scoreItem.display.animations.push(alphaAnimation);
				
				data.text.push(scoreItem);
				
				active = true;
				
			}
			
			active = active || ((i <= 0) || (SaveData.Score(levelData[i - 1].level) > 0));
			
			if(active)
			{
				
				newItem.type = "text";
			
				newItem.text = {};
				newItem.text.text = levelData[i].title;
				newItem.text.font = CONST_LEVELSELECT_ACTIVE_FONT;
			
				newItem.method = "Play";
				newItem.arg = i;
			
			}
			else
			{
				
				newItem.text = "???";
				newItem.font = CONST_LEVELSELECT_DISABLED_FONT;
				
			}
			
			newItem.display = {};
			newItem.display.start = {};
			newItem.display.start.x = CONST_LEVELSELECT_DISPLAYSTART_X;
			newItem.display.start.y = newItem.y;
			newItem.display.start.alpha = 0;
			
			newItem.display.animations = [];
			
			var xAnimation = {};
			xAnimation.key = "x";
			xAnimation.start = CONST_LEVELSELECT_DISPLAYSTART_X;
			xAnimation.target = newItem.x;
			xAnimation.time = time;
			
			newItem.display.animations.push(xAnimation);
			newItem.display.animations.push(alphaAnimation);
			
			if(active)
			{
				
				data.items.push(newItem);
			
			}
			else
			{
			
				data.text.push(newItem);
				
			}
			
		}
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
		
		this.image = this.textures.get("LevelSelectImage");
		this.imageIndex = UI.AddSource(this.image.source[0].source, {x: 0, y: -0.5, alpha: 0});
		UI.AnimateSource(this.imageIndex, "alpha", 0, 1, 500, false);
		UI.AnimateSource(this.imageIndex, "y", -0.5, 0.1, 500, false);
		
	}
	
	Hide()
	{
		
		super.Hide();
		
		UI.AnimateSource(this.imageIndex, "alpha", 1, 0, 500, true);
		UI.AnimateSource(this.imageIndex, "y", 0.1, -0.5, 500, true);
		
	}
	
	Play(index)
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			var data = this.cache.json.get("Levels");
		
			this.scene.remove("LevelSelect");
			
			var json = JSON.parse(JSON.stringify(data[index]));
			json.props = json.props.concat(CONST_PLAYER_PROPS);
			json.actors = json.actors.concat(CONST_PLAYER_ACTORS);
			json.effects = json.effects.concat(CONST_PLAYER_EFFECTS);
			
			this.scene.add("LevelPreloader", LevelPreloader);
			this.Start("LevelPreloader", json);
		
			this.scene.add("Shmup", Shmup);
			this.scene.add("Win", Win);
			this.scene.add("GameOver", GameOver);
		
		}, [], this);
		
	}
	
	Back()
	{
		
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			this.scene.remove("LevelSelect");
			this.scene.add("Title", Title);
		
			this.Start("Title");
		
		}, [], this);

	}
	
}