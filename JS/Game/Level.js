import {PoolMessage} from "../Base/PoolObject.js";
import UI from "../Base/UILayer.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y} from "../Base/BaseConstants.js";

import MessageBox, {Message} from "../Tools/Messages.js";
import Timer from "../Tools/Timer.js";
import Logger from "../Tools/Logger.js";
import SoundBoard from "../Tools/SoundBoard.js";

import {MoveMessage, CONST_AGENTDEATH_MESSAGE_SUFFIX} from "../Game/Agent.js";
import {CONST_AISTART_MESSAGE_SUFFIX} from "../Game/BossAI.js";

import {CONST_DIALOGUE_SPEAKER_DATA} from "../Constants.js";

export const CONST_WIN_MESSAGE_CODE = "Win";
export const CONST_DIALOGUEENTER_MESSAGE_CODE = "DialogueStart";
export const CONST_DIALOGUEEXIT_MESSAGE_CODE = "DialogueExit";
export const CONST_DIALOGUEADVANCE_MESSAGE_CODE = "DialogueAdvance";
export const CONST_DIALOGUESKIP_MESSAGE_CODE = "DialogueSkip";

const CONST_STAGE_WAVE_TYPE = "wave";
const CONST_STAGE_DIALOGUE_TYPE = "dialogue";
const CONST_STAGE_SCRIPTED_TYPE = "scripted";
const CONST_STAGE_FIGHT_TYPE = "fight";

const CONST_STAGE_WARNING_TIME = 2;
const CONST_STAGE_WARNING_WIDTH = 0.035; //Warning image W+H divided by UI Layer W and H
const CONST_STAGE_WARNING_HEIGHT = 0.05926;

export default class Level
{
	
	constructor(scene, background, warning, json)
	{
		
		this.background = scene.add.tileSprite(0, 0, 0, 0, background);
		this.background.setOrigin(0, 0);
		
		this.warning = warning;
		
		this.ui_indices = {};
		
		this.ui_indices.leftSpeaker_index = UI.AddSource(null, {x: CONST_DIALOGUE_SPEAKER_DATA.leftStart, y: CONST_DIALOGUE_SPEAKER_DATA.y, alpha: 1});
		this.ui_indices.rightSpeaker_index = UI.AddSource(null, {x: CONST_DIALOGUE_SPEAKER_DATA.rightStart, y: CONST_DIALOGUE_SPEAKER_DATA.y, alpha: 1});
		
		var dialogueBox = scene.textures.get("DialogueBox");
		this.ui_indices.dialogue_index = UI.AddSource(dialogueBox.source[0].source, {x: 0, y: 1, alpha: 1});
		this.ui_indices.text_index = UI.AddSource(null, {x: 0.05, y: 1, alpha: 1});
		
		var nameBox = scene.textures.get("NameBox");
		this.ui_indices.name_index = UI.AddSource(nameBox.source[0].source, {x: 0, y: -0.12, alpha: 1});
		this.ui_indices.nameText_index = UI.AddSource(null, {x: 0, y: -0.12, alpha: 1});
		
		this.stages = [];
		for(var i = 0; i < json.stages.length; i++)
		{
			
			this.stages[i] = Level.CreateStage(scene, warning, json.stages[i], this.ui_indices);
			
		}
		
		this.current_stage = 0;
		
		this.start = 0;
		
	}
	
	static CreateStage(scene, warn, json, ui)
	{
	
		var warning = scene.textures.get("Warning").source[0].source;
		
		switch (json.type)
		{
		
			case CONST_STAGE_WAVE_TYPE:
				return new WaveStage(json, warn, warning);
				break;
		
			case CONST_STAGE_DIALOGUE_TYPE:
				return new DialogueStage(json, scene, ui);
				break;
				
			case CONST_STAGE_SCRIPTED_TYPE:
				return new ScriptedStage(json);
				break;
				
			case CONST_STAGE_FIGHT_TYPE:
				return new FightStage(json);
				break;
				
		}
	
		Logger.LogWarning("Unable to create stage of type " + json.type);
	
	}
	
	Start()
	{
	
		this.current_stage = 0;
		this.stages[this.current_stage].Start();
		
	}
	
	Update()
	{
		
		if(this.current_stage < this.stages.length)
		{
			
			var backgroundShift = this.stages[this.current_stage].Update();

			this.background.tilePositionX += backgroundShift;
			this.background.tilePositionX = Math.round(this.background.tilePositionX);
		
			if(this.stages[this.current_stage].Next())
			{
			
				this.current_stage += 1;
			
				if(this.current_stage == this.stages.length)
				{
				
					MessageBox.PostMessage(new Message(CONST_WIN_MESSAGE_CODE));
				
				}
				else
				{
			
					this.stages[this.current_stage].Start();
				
				}
			
			}
			
		}
		
	}
	
}

class Stage
{
	
	constructor(json)
	{
		
		this.background_param = json.background_param;
		
		this.start = 0;
		
		this.music = json.music;
		
		this.box_index = -1;
		this.character_index = -1;
		
	}
	
	Start()
	{
		
		this.start = Timer.RunningMilliseconds();
		
		SoundBoard.Music(this.music);
		
	}
	
	Update()
	{
		
		var t = (Timer.RunningMilliseconds() - this.start) / 1000;
		
		return this.background_param(t);
		
	}
	
	Next()
	{
	}
	
}

class DialogueStage extends Stage
{

	constructor(json, scene, ui)
	{
		
		super(json);
	
		this.script_index = 0;
		this.line_index = 0;
		
		this.script = json.script.slice();
		this.speaker_index = -1;
		
		this.done = false;
		
		this.ui = ui;
		
		this.scene = scene;
		
		this.leftUsed = null;
		this.rightUsed = null;
		
		this.line = "";
		this.words = [];
		this.typed_text = "";
		this.last_type = 0;
		
		this.animating = false;
		this.ending = false;
		
	}
	
	Start()
	{
		
		super.Start();
		
		var right = this.script[this.script_index].right;
		
		this.text = this.scene.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", {fontFamily: "chunk", fontSize: CONST_DIALOGUE_SPEAKER_DATA.size, color: "#FFFFFF", wordWrap: { width: 3420 }});
		this.text.setOrigin(0, 0);
		this.nameText = this.scene.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", {fontFamily: "chunk", fontSize: CONST_DIALOGUE_SPEAKER_DATA.nameSize, color: "#FFFFFF"});
		this.text.setOrigin(0, 0);
		
		UI.UpdateSource(this.ui.text_index, this.text.canvas, null);
		UI.UpdateSource(this.ui.nameText_index, this.nameText.canvas, null);
		
		this.DisplaySpeaker(right);
		
		this.nameText.setText(this.script[this.script_index].name);
		this.text.setColor(this.script[this.script_index].color);
		this.nameText.setColor(this.script[this.script_index].color);
		
		UI.AnimateSource(this.ui.dialogue_index, "y", 1, 0.5, CONST_DIALOGUE_SPEAKER_DATA.time, false);
		UI.AnimateSource(this.ui.text_index, "y", 1, 0.55, CONST_DIALOGUE_SPEAKER_DATA.time, false);
		
		UI.UpdateSource(this.ui.name_index, null, {x: (right ? CONST_DIALOGUE_SPEAKER_DATA.rightName : CONST_DIALOGUE_SPEAKER_DATA.leftName)});
		UI.UpdateSource(this.ui.nameText_index, null, {x: (right ? CONST_DIALOGUE_SPEAKER_DATA.rightNameText : CONST_DIALOGUE_SPEAKER_DATA.leftNameText)});
		
		UI.AnimateSource(this.ui.name_index, "y", -0.12, 0.35, CONST_DIALOGUE_SPEAKER_DATA.time, false);
		UI.AnimateSource(this.ui.nameText_index, "y", -0.12, 0.375, CONST_DIALOGUE_SPEAKER_DATA.time, false);
		
		this.animating = true;
		
		this.scene.time.delayedCall(CONST_DIALOGUE_SPEAKER_DATA.time, function()
		{
			
			MessageBox.PostMessage(new Message(CONST_DIALOGUEENTER_MESSAGE_CODE));
			
			this.ShowText();
			
			this.animating = false;
			
		}, [], this); //Wait for the animations to complete before entering the dialogue stage
		
	}
	
	DisplaySpeaker(right)
	{
		
		var speakerImage = this.scene.textures.get(this.script[this.script_index].speaker);
		var params = {x: (right ? CONST_DIALOGUE_SPEAKER_DATA.rightStart : CONST_DIALOGUE_SPEAKER_DATA.leftStart), y: CONST_DIALOGUE_SPEAKER_DATA.y, alpha: 1};
		UI.UpdateSource((right ? this.ui.rightSpeaker_index : this.ui.leftSpeaker_index), speakerImage.source[0].source, params);
		
		UI.AnimateSource((right ? this.ui.rightSpeaker_index : this.ui.leftSpeaker_index), "x", (right ? CONST_DIALOGUE_SPEAKER_DATA.rightStart : CONST_DIALOGUE_SPEAKER_DATA.leftStart), (right ? CONST_DIALOGUE_SPEAKER_DATA.rightTarget : CONST_DIALOGUE_SPEAKER_DATA.leftTarget), CONST_DIALOGUE_SPEAKER_DATA.time, false);
		
		if(right)
		{
			
			this.rightUsed = this.script[this.script_index].speaker;
			
		}
		else
		{
			
			this.leftUsed = this.script[this.script_index].speaker;
			
		}
		
	}
	
	Update()
	{
		
		var message = MessageBox.PullMessage(CONST_DIALOGUEADVANCE_MESSAGE_CODE);
        if(!message.IsEmpty() && this.script_index < this.script.length)
		{
			
			if(!this.animating)
			{
				
				SoundBoard.Play("SelectAudio");
				
				this.Advance();
			
			}
			
		}
		
		message = MessageBox.PullMessage(CONST_DIALOGUESKIP_MESSAGE_CODE);
		if(!message.IsEmpty())
		{
			
			SoundBoard.Play("SelectAudio");
			
			this.EndDialogue();
			
		}
		
		this.UpdateText();
		
		return super.Update();
		
	}
	
	HideText()
	{
		
		this.line_index = 0;
		
		this.text.setText("");
		
	}
	
	ShowText()
	{
		
		if(this.script_index < this.script.length)
		{
			
			this.line = this.script[this.script_index].lines[this.line_index];
			this.words = this.line.split(" ");
		
			this.typed_text = this.words[0] + " ";
			this.words = this.words.slice(1);
		
			this.last_type = Timer.RunningMilliseconds();
		
			this.text.setColor(this.script[this.script_index].color);
			this.text.setText(this.typed_text);
			
		}
		
	}
	
	UpdateText()
	{
		
		if(this.words.length > 0)
		{
			
			if(Timer.RunningMilliseconds() - this.last_type >= CONST_DIALOGUE_SPEAKER_DATA.speed)
			{
			
				this.typed_text += this.words[0] + " ";
				this.words = this.words.slice(1);
			
				this.last_type = Timer.RunningMilliseconds();
			
				SoundBoard.Play("TypeAudio");
				
			}
		
			this.text.setText(this.typed_text);
		
		}
		
	}
	
	Advance()
	{
		
		if(this.words.length > 0)
		{
			
			this.words = [];
			this.text.setText(this.line);
			
			return;
			
		}
		
		this.line_index += 1;
		
		if(this.line_index >= this.script[this.script_index].lines.length)
		{
			
			this.HideText();
			
			var lastRight = this.script[this.script_index].right;
			
			this.script_index += 1;
			
			if(this.script_index >= this.script.length)
			{
				
				this.EndDialogue();
				
				return;
				
			}
						
			this.nameText.setText(this.script[this.script_index].name);
			this.nameText.setColor(this.script[this.script_index].color);
			
			var right = this.script[this.script_index].right;
			var speaker = this.script[this.script_index].speaker;
			var animateSpeaker = false;
			
			this.animating = true;
			
			if(right && (this.rightUsed !== speaker))
			{
			
				if(this.rightUsed)
				{
					
					UI.AnimateSource(this.ui.rightSpeaker_index, "x", CONST_DIALOGUE_SPEAKER_DATA.rightTarget, CONST_DIALOGUE_SPEAKER_DATA.rightStart, CONST_DIALOGUE_SPEAKER_DATA.time, false);
				
				}
					
				animateSpeaker = true;
				
			}
			else if(!right && (this.leftUsed !== speaker))
			{
				
				if(this.leftUsed)
				{
					
					UI.AnimateSource(this.ui.leftSpeaker_index, "x", CONST_DIALOGUE_SPEAKER_DATA.leftTarget, CONST_DIALOGUE_SPEAKER_DATA.leftStart, CONST_DIALOGUE_SPEAKER_DATA.time, false);
				
				}
				
				animateSpeaker = true;
				
			}
		
			if(right != lastRight)
			{
				
				UI.AnimateSource(this.ui.name_index, "x", (lastRight ? CONST_DIALOGUE_SPEAKER_DATA.rightName : CONST_DIALOGUE_SPEAKER_DATA.leftName), (lastRight ? CONST_DIALOGUE_SPEAKER_DATA.leftName : CONST_DIALOGUE_SPEAKER_DATA.rightName), CONST_DIALOGUE_SPEAKER_DATA.time, false);
				UI.AnimateSource(this.ui.nameText_index, "x", (lastRight ? CONST_DIALOGUE_SPEAKER_DATA.rightNameText : CONST_DIALOGUE_SPEAKER_DATA.leftNameText), (lastRight ? CONST_DIALOGUE_SPEAKER_DATA.leftNameText : CONST_DIALOGUE_SPEAKER_DATA.rightNameText), CONST_DIALOGUE_SPEAKER_DATA.time, false);
				
			}
			
			if(animateSpeaker)
			{
			
				if((right && !this.rightUsed) || (!right && !this.leftUsed))
				{
					
					this.DisplaySpeaker(right);
					
					this.scene.time.delayedCall(CONST_DIALOGUE_SPEAKER_DATA.time, function()
					{
			
						this.ShowText();
			
						this.animating = false;
						
					}, [], this); //Wait for the animations to complete before updating text
					
				}
				else
				{
				
					this.scene.time.delayedCall(CONST_DIALOGUE_SPEAKER_DATA.time, function()
					{

						this.DisplaySpeaker(right);
					
						this.scene.time.delayedCall(CONST_DIALOGUE_SPEAKER_DATA.time, function()
						{
			
							this.ShowText();
			
							this.animating = false;
							
						}, [], this); //Wait for the animations to complete before updating text
						
					}, [], this);
				
				}
				
			}
			else
			{
				
				this.scene.time.delayedCall(CONST_DIALOGUE_SPEAKER_DATA.time, function()
				{
			
					this.ShowText();
			
					this.animating = false;
					
				}, [], this); //Wait for the animations to complete before updating text
				
			}
			
		}
		else
		{
		
			this.ShowText();
			
		}
		
	}
	
	Next()
	{
		
		return this.done;
		
	}
	
	EndDialogue()
	{
		
		if(!this.ending)
		{
			
			this.ending = true;
		
			if(this.leftUsed)
			{
			
				UI.AnimateSource(this.ui.leftSpeaker_index, "x", CONST_DIALOGUE_SPEAKER_DATA.leftTarget, CONST_DIALOGUE_SPEAKER_DATA.leftStart, CONST_DIALOGUE_SPEAKER_DATA.time, false);
			
			}
		
			if(this.rightUsed)
			{
			
				UI.AnimateSource(this.ui.rightSpeaker_index, "x", CONST_DIALOGUE_SPEAKER_DATA.rightTarget, CONST_DIALOGUE_SPEAKER_DATA.rightStart, CONST_DIALOGUE_SPEAKER_DATA.time, false);
			
			}
		
			UI.AnimateSource(this.ui.dialogue_index, "y", 0.5, 1, CONST_DIALOGUE_SPEAKER_DATA.time, false);
			UI.AnimateSource(this.ui.text_index, "y", 0.5, 1, CONST_DIALOGUE_SPEAKER_DATA.time, false);
	
			UI.AnimateSource(this.ui.name_index, "y", 0.35, -0.12, CONST_DIALOGUE_SPEAKER_DATA.time, false);
			UI.AnimateSource(this.ui.nameText_index, "y", 0.375, -0.12, CONST_DIALOGUE_SPEAKER_DATA.time, false);
		
			this.scene.time.delayedCall(CONST_DIALOGUE_SPEAKER_DATA.time, function()
			{
			
				UI.UpdateSource(this.ui.leftSpeaker_index, null, null);
				UI.UpdateSource(this.ui.rightSpeaker_index, null, null);
			
				MessageBox.PostMessage(new Message(CONST_DIALOGUEEXIT_MESSAGE_CODE));
			
				this.done = true;
			
			}, [], this); //Wait for the animations to complete before ending the dialogue stage
		
		}
		
	}
	
}

class WaveStage extends Stage
{

	constructor(json, warn, warning)
	{
	
		super(json);
	
		this.duration = json.data.duration;
	
		this.spawners = [];
		for(var i = 0; i < json.data.spawners.length; i++)
		{
			
			this.spawners[i] = new Spawner(json.data.spawners[i], warn, warning);
			
		}
		
	}

	Update()
	{
		
		var t = (Timer.RunningMilliseconds() - this.start) / 1000;
		
		for(var i = 0; i < this.spawners.length; i++)
		{
			
			this.spawners[i].Spawn(t);
			
		}
		
		return super.Update();
		
	}
	
	Next()
	{
		
		var t = (Timer.RunningMilliseconds() - this.start) / 1000;
		
		return t >= this.duration;
		
	}
	
}

class FightStage extends Stage
{

	constructor(json)
	{
		
		super(json);
		
		this.launch = json.launch;
		
		this.finish = json.finish;
		
	}
	
	Start()
	{
		
		super.Start();
		
		for(var i = 0; i < this.launch.length; i++)
		{
			
			for(var j = 0; j < this.launch[i].count; j++)
			{
				
				MessageBox.PostMessage(new Message(this.launch[i].key + CONST_AISTART_MESSAGE_SUFFIX));
				
			}
			
		}
		
	}
	
	Update()
	{
		
		var message = null;
		
		for(var i = 0; i < this.finish.length; i++)
		{
			
			message = MessageBox.PullMessage(this.finish[i].key + CONST_AGENTDEATH_MESSAGE_SUFFIX);
			while(!message.IsEmpty())
			{
				
				this.finish[i].count = (this.finish[i].count ? this.finish[i].count + 1 : 1); //Set the count property if it has not been done yet
				
				message = MessageBox.PullMessage(this.finish[i].key + CONST_AGENTDEATH_MESSAGE_SUFFIX);
				
			}
			
		}
		
		return super.Update();
		
	}
	
	Next()
	{
		
		for(var i = 0; i < this.finish.length; i++)
		{
			
			if(!this.finish[i].count || this.finish[i].count < this.finish[i].required)
			{
			
				return false;
				
			}
			
		}
		
		return true;
		
	}
	
}

class ScriptedStage extends Stage
{

	constructor(json)
	{
		
		super(json);
		
		this.duration = json.duration;
		
		this.player = json.player;
		
		this.spawns = json.spawns;
		
	}
	
	Start()
	{
		
		super.Start();
		
		for(var i = 0; i < this.spawns.length; i++)
		{
			
			var message = new PoolMessage(this.spawns[i].key, this.spawns[i].xParam, this.spawns[i].yParam);
			message.SetWorld(true);
			message.Launch(this.spawns[i].x, this.spawns[i].y, this.duration);
			MessageBox.PostMessage(message);
			
		}
		
		var playerMessage = new MoveMessage("Player", this.player.x, this.player.y, this.duration);
		MessageBox.PostMessage(playerMessage);
		
	}
	
	Update()
	{
		
		return super.Update();
		
	}
	
	Next()
	{
		
		var t = (Timer.RunningMilliseconds() - this.start) / 1000;
		
		return t >= this.duration;
		
	}
	
}

class Spawner
{
	
	constructor(json, warn, warning)
	{
		
		this.keys = json.keys.slice();
		this.current_key = 0;
		
		this.start_time = json.start;
		this.delay = json.delay;
		this.last_spawn = 0;
		
		this.count = json.count;
		this.spawns = 0;
		
		this.x = json.x;
		this.y = json.y;
		this.theta = json.theta;
		this.xParam = json.xParam;
		this.yParam = json.yParam;
	
		this.trigger_warnings = warn;
		this.warn = false;
		this.warning = warning;
		
	}
	
	Spawn(t)
	{
		
		if(this.trigger_warnings && !this.warn && t > this.start_time - CONST_STAGE_WARNING_TIME)
		{
			
			this.warn = true;
			
			var x = Math.min(this.x, 1 - CONST_STAGE_WARNING_WIDTH);
			var y = Math.min(this.y, 1 - CONST_STAGE_WARNING_HEIGHT);
			
			if(this.x >= 1 || this.x <= 0)
			{
				
				y -= CONST_STAGE_WARNING_HEIGHT / 2;
				
			}
			else
			{
				
				x -= CONST_STAGE_WARNING_WIDTH / 2;
				
			}
			
			var warningIndex = UI.AddSource(this.warning, {x: x, y: y, alpha: 1});
			
			UI.AnimateSource(warningIndex, "alpha", 1, 0, CONST_STAGE_WARNING_TIME * 250, true);
			
			SoundBoard.Play("WarningAudio");
			
		}
		
		if(t > this.start_time && this.spawns < this.count)
		{
			
			if((Timer.RunningMilliseconds() - this.last_spawn) / 1000 > this.delay)
			{

				var message = new PoolMessage(this.keys[this.current_key], this.xParam, this.yParam);
				message.SetWorld(true);
				message.Launch(this.x, this.y, this.theta);
				MessageBox.PostMessage(message);
				
				this.current_key = (this.current_key += 1) % this.keys.length;
				
				this.last_spawn = Timer.RunningMilliseconds();
				this.spawns += 1;
				
				return true;
				
			}
			
		}
		
		return false;
		
	}
	
}