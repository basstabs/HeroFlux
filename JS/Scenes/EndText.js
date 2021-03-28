import MenuScene from "../Base/MenuScene.js";
import {CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, CONST_UI_WIDTH, CONST_UI_HEIGHT} from "../Base/BaseConstants.js";
import UI from "../Base/UILayer.js";

import Congratulations from "../Scenes/Congratulations.js";

const CONST_END_TEXT = 
[

	"Fortunately, Kabadra and Horizon managed to destroy most of the debris from the alien ship.",
	"Well, Horizon did.",
	"Loss of life across both attacks was minimal, although property damage was severe.",
	"Most of Hero Corp. was freed from the effects of the reconstruction engine when I destroyed it, although some of them died with Fang when the invaders attacked the base.",
	"Hero Corp. was livid that Villain Corp. had used the imminent invasion to launch a surprise attack, but they were too weakened to retaliate.",
	"Villain Corp. was decimated by Hero Corp. resistance and the initial alien force. Neither side will be ready to fight any time soon.",
	"So far there's no sign of further invaders, but we'll be ready for them. Or rather, I'll be ready.",
	"The brass at Hero Corp. initially thanked me for saving their asses, but nothing's ever that straightforward.",
	"Penny told me they were pissed that I disobeyed orders and destroyed the reconstruction engine.",
	"No doubt they're quietly plotting some way to get back at me without having to acknowledge its existence publicly, but...",
	"I didn't stick around for the politics."
	
];

const CONST_END_TEXT_FONT = {"fontFamily": "chunk", "fontSize": "128px", "color": "#DDDDDD", "wordWrap": { width: 3420 }, "align": "center"};

export default class EndText extends MenuScene
{
	
	constructor()
	{
	
		super("EndText");
		
		this.current_index = 0;
		this.animating = true;
		
	}
	
	init()
	{
		
		var data = this.cache.json.get("EndTextScreen");
		
		super.init(data);
		
	}
	
	create()
	{
		
		super.create();
	
		this.text = this.add.text(CONST_POOL_LOCATION_X, CONST_POOL_LOCATION_Y, "", CONST_END_TEXT_FONT);
		this.index = UI.AddSource(this.text.canvas, {"x": 0.5, "y": 0.3, "alpha": 0});
		
		this.Select(this.current_index);
		
	}
	
	Select(index)
	{

		this.current_index = index;
		
	    this.text.setText(CONST_END_TEXT[index]);
	    UI.UpdateSource(this.index, null, {x: 0.5 - ((this.text.displayWidth / 2) / CONST_UI_WIDTH)});
		UI.AnimateSource(this.index, "alpha", 0, 1, 500, false);
		
		this.time.delayedCall(500, function()
		{
			
			this.animating = false;
			
		}, [], this);
	}
	
	Continue()
	{
		
		if(!this.animating)
		{
			
			this.animating = true;
		
			this.current_index += 1;
			UI.AnimateSource(this.index, "alpha", 1, 0, 500, false);
		
			if(this.current_index < CONST_END_TEXT.length)
			{
			
				this.time.delayedCall(500, function()
				{
		
					this.Select(this.current_index);
		
				}, [], this);

			}
			else
			{
			
				this.Hide();
				
				UI.AnimateSource(this.index, "alpha", 1, 0, 500);
				
				this.time.delayedCall(this.max_animation, function()
				{
				
					this.scene.remove("EndText");
					this.scene.add("Congratulations", Congratulations);
		
					this.Start("Congratulations");
				
				}, [], this);
			
			}
			
		}
		
	}
	
}