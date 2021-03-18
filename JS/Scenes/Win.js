import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";
import UI from "../Base/UILayer.js";

import SoundBoard from "../Tools/SoundBoard.js";

import Score from "../Game/Score.js";
import Input from "../Game/Input.js";

import Title from "../Scenes/Title.js";
import Loader from "../Scenes/Loader.js";
import {CONST_PLAYER_PROPS, CONST_PLAYER_ACTORS, CONST_PLAYER_EFFECTS} from "../Scenes/LevelSelect.js";
import LevelPreloader from "../Scenes/LevelPreloader.js";
import Shmup from "../Scenes/Shmup.js";

import Timer from "../Tools/Timer.js";

import {CONST_WIN_SCREEN_DATA} from "../Constants.js";

const CONST_SCORE_SECONDS = 4;

export default class Win extends MenuScene
{
	
	constructor(data)
	{
	
		super("Win");
		
		this.score = 0;
		
	}
	
	init(data)
	{

	    var menu_data = this.cache.json.get("ContinueScreen");
	    menu_data = JSON.parse(JSON.stringify(menu_data));
		menu_data.background = "TitleBackground";

		menu_data.music = "ContinueMusic";
		
		super.init(menu_data);

		var level = this.cache.json.get("LevelData");
	
		this.score = Score.ComputeScore(level.level);
	
		var levelData = this.cache.json.get("Levels");
		this.next_index = levelData.findIndex(function(element)
		{
			
			return element.level == level.level;
			
		});
		this.next_index += 1;
		
		Loader.Unload(this, data);

	}
	
	create()
	{
		
		super.create();
		
		this.mission = this.textures.get("MissionImage");
		this.missionIndex = UI.AddSource(this.mission.source[0].source, {x: -0.5, y: 0.05, alpha: 1});
		UI.AnimateSource(this.missionIndex, "x", -0.5, 0.1, 500, false);
		
		this.complete = this.textures.get("CompleteImage");
		this.completeIndex = UI.AddSource(this.complete.source[0].source, {x: 1.5, y: 0.25, alpha: 1});
		UI.AnimateSource(this.completeIndex, "x", 1.1, 0.3, 1000, false);
		
		this.text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "Score: ", CONST_WIN_SCREEN_DATA.font);
		this.textIndex = UI.AddSource(this.text.canvas, {x: 0.35, y: 1, alpha: 0});
		UI.AnimateSource(this.textIndex, "y", 1, 0.6, 500, false);
		UI.AnimateSource(this.textIndex, "alpha", 0, 1, 500, false);
	    
		this.scoreText = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "0", CONST_WIN_SCREEN_DATA.font);
		this.scoreIndex = UI.AddSource(this.scoreText.canvas, {x: 0.5, y: 1, alpha: 0});
		UI.AnimateSource(this.scoreIndex, "y", 1, 0.6, 500, false);
		UI.AnimateSource(this.scoreIndex, "alpha", 0, 1, 500, false);
		
		this.start = Timer.RunningMilliseconds();
		
	}
	
	update()
	{
		
		super.update();
		
		var delta = Math.min(((Timer.RunningMilliseconds() - this.start) / 1000) / CONST_SCORE_SECONDS, 1);
		
		this.scoreText.setText(Math.floor(this.score * delta));
		
	}
	
	Hide()
	{
		
		super.Hide();
		
		UI.AnimateSource(this.missionIndex, "x", 0.1, 0.5, 500, false);
		
		UI.AnimateSource(this.completeIndex, "x", 0.3, 1.1, 500, false);
		
		UI.AnimateSource(this.textIndex, "y", 0.6, 1, 500, false);
		UI.AnimateSource(this.textIndex, "alpha", 1, 0, 500, false);

		UI.AnimateSource(this.scoreIndex, "y", 0.6, 1, 500, false);
		UI.AnimateSource(this.scoreIndex, "alpha", 1, 0, 500, false);
		
	}
	
	Continue()
	{
	    
		this.Hide();
		
		this.time.delayedCall(this.max_animation, function()
		{
			
			var data = this.cache.json.get("Levels");
		
			this.scene.remove("Win");
		
			if(this.next_index < data.length)
			{
				
				var json = JSON.parse(JSON.stringify(data[this.next_index]));
				json.props = json.props.concat(CONST_PLAYER_PROPS);
				json.actors = json.actors.concat(CONST_PLAYER_ACTORS);
				json.effects = json.effects.concat(CONST_PLAYER_EFFECTS);
			
				this.scene.add("LevelPreloader", LevelPreloader);
				this.Start("LevelPreloader", json);
		
				this.scene.add("Shmup", Shmup);
		
			}
			
		}, [], this);
		
	}
	
	Quit()
	{
	    
	    this.Hide();
	    
	    this.time.delayedCall(this.max_animation, function()
		{
				
			this.scene.remove("Win");
			this.scene.remove("GameOver");
				
			var title = new Title();
			this.scene.add("Title", title);
		
			this.Start("Title", {});
			
		}, [], this);
	    
	}
	
}