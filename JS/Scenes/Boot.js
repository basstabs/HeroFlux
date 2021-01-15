import BaseScene from "../Base/Scene.js";

import Loader from "../Scenes/Loader.js";

export default class Boot extends BaseScene
{
	
	constructor()
	{
	
		super("Boot");
		
	}
	
	preload()
	{
		
		super.preload();
		
		this.load.image("Loading", "DB/Images/Menus/Loading.png");
		this.load.image("LoadingFrame", "DB/Images/Menus/LoadingFrame.png");
		this.load.image("LoadingBar", "DB/Images/Menus/LoadingBar.png");
		
		this.load.json("LoadingMessages", "DB/Data/Menus/LoadingMessages.json");
		
	}
	
	create()
	{

		var preload_data = [];
		preload_data["next_scene"] = "Title";
		
		preload_data["assets"] = [];
		
		//Universal Menu Assets
		preload_data["assets"].push({type: "image", id: "CurrencyImage", url: "DB/Images/Menus/Currency.png"});
		preload_data["assets"].push({type: "json", id: "SaveDataBase", url: "DB/Data/SaveDataBase.json"});
		
		//Title Screen Assets
		preload_data["assets"].push({type: "image", id: "TitleBackground", url: "DB/Images/Menus/TitleBackground.png"});
		preload_data["assets"].push({type: "image", id: "Logo", url: "DB/Images/Menus/Logo.png"});
		preload_data["assets"].push({type: "image", id: "TitleImage", url: "DB/Images/Menus/TitleImage.png"});
		preload_data["assets"].push({type: "json", id: "TitleScreen", url: "DB/Data/Menus/TitleScreen.json"});
		preload_data["assets"].push({type: "music", id: "TitleMusic", url: "DB/Music/TitleMusic.mp3"});
		preload_data["assets"].push({type: "sound", id: "SelectAudio", url: "DB/Sound/Select.wav"});
		
		//Options Screen Assets
		preload_data["assets"].push({type: "image", id: "OptionsSliderImage", url: "DB/Images/Menus/OptionsSlider.png"});
		preload_data["assets"].push({type: "image", id: "OptionsPointerImage", url: "DB/Images/Menus/OptionsPointer.png"});
		preload_data["assets"].push({type: "json", id: "OptionsScreen", url: "DB/Data/Menus/OptionsScreen.json"});
		
		//Remap Screen Assets
		preload_data["assets"].push({type: "json", id: "RemapScreen", url: "DB/Data/Menus/RemapScreen.json"});
		
		//Level Select Assets
		preload_data["assets"].push({type: "json", id: "Levels", url: "DB/Data/Levels.json"});
		preload_data["assets"].push({type: "json", id: "LevelSelectScreen", url: "DB/Data/Menus/LevelSelect.json"});
		preload_data["assets"].push({type: "image", id: "LevelSelectImage", url: "DB/Images/Menus/LevelSelectImage.png"});
		
		//Feats Assets
		preload_data["assets"].push({type: "json", id: "Feats", url: "DB/Data/Feats.json"});
		preload_data["assets"].push({type: "json", id: "FeatsScreen", url: "DB/Data/Menus/FeatsScreen.json"});
		
		//Game Over/Continue Assets
		preload_data["assets"].push({type: "image", id: "GameOverImage", url: "DB/Images/GameOver/FangGameOver.png"});
		preload_data["assets"].push({type: "json", id: "ContinueScreen", url: "DB/Data/Menus/ContinueScreen.json"});
		preload_data["assets"].push({type: "music", id: "GameOverMusic", url: "DB/Music/GameOverMusic.mp3"});
		preload_data["assets"].push({type: "music", id: "ContinueMusic", url: "DB/Music/ContinueMusic.mp3"});
		
		//Universal Game Assets
		preload_data["assets"].push({type: "image", id: "Warning", url: "DB/Images/Warning.png"});
		preload_data["assets"].push({type: "image", id: "DialogueBox", url: "DB/Images/DialogueBox.png"});
		preload_data["assets"].push({type: "image", id: "NameBox", url: "DB/Images/NameBox.png"});
		preload_data["assets"].push({type: "sound", id: "WarningAudio", url: "DB/Sound/Warning.wav"});
		preload_data["assets"].push({type: "sound", id: "TypeAudio", url: "DB/Sound/Type.wav"});
		preload_data["assets"].push({type: "sound", id: "SpawnAudio", url: "DB/Sound/SpawnAudio.wav"});
		preload_data["assets"].push({type: "image", id: "PowerGauge", url: "DB/Images/PowerGauge.png"});
		preload_data["assets"].push({type: "image", id: "EnemyGauge", url: "DB/Images/EnemyGauge.png"});
		preload_data["assets"].push({type: "image", id: "LifeBar", url: "DB/Images/LifeBar.png"});
		preload_data["assets"].push({type: "image", id: "LifeMarker", url: "DB/Images/LifeBarMarker.png"});
		
		var preloader = new Loader("Preloader");
		this.scene.add("Preloader", preloader);
		
		this.Start("Preloader", preload_data);
		
	}
	
}