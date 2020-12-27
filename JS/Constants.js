export const CONST_APP_NAME = "Shmup";

export const CONST_LOADER_TEXT_DATA = {

	size: "16px",
	color: "#68b3ff"

};

export const CONST_PAUSE_TEXT_DATA = {
	
	size: "48px",
	color: "#8AF1FF"
	
}

export const CONST_UI_POWER_DATA = {

	x: 0.0025,
	y: -0.015,
	alpha: 1,
	size: "200px",
	color: "#8AF1FF",
	max_color: "#8AFF8A",
	low_color: "#F1F18A",
	out_color: "#F18A8A"

};

export const CONST_UI_POWERGAUGE_DATA = {

	x: -0.11,
	y: -0.265,
	alpha: 0.8

};

export const CONST_UI_ENEMY_DATA = {

	x: 0.9975,
	y: -0.015,
	alpha: 0,
	size: "200px",
	color: "#F18A8A",
	green: "#8AFF8A"

};

export const CONST_UI_ENEMYGAUGE_DATA = {

	x: 0.8433,
	y: -0.265,
	alpha: 0

};

export const CONST_DIALOGUE_SPEAKER_DATA = {
	
	rightStart: 1,
	rightTarget: 0.52,
	rightName: 0.45,
	rightNameText: 0.5,
	leftStart: -0.38,
	leftTarget: 0.1,
	leftName: 0.05,
	leftNameText: 0.1,
	time: 350,
	y: 0,
	size: "125px",
	nameSize: "125px",
	speed: 100
	
};

export const CONST_TITLE_SCREEN_DATA = {
	
	logo:
	{
		
		x: 1,
		y: 0,
		targetX: 0,
		alpha: 0
		
	},
	image:
	{
	
		x: 0.5,
		y: 0,
		alpha: 0
		
	},
	time: 500
	
};

export const CONST_FEATS_SCREEN_DATA = {
    
    name_data: {"x": 0.5, "y": 0.35, "alpha": 0},
    description_data: {"x": 0.5, "y": 0.45, "alpha": 0},
    reward_image_data: {"x": 0.5, "y": 0.67, "alpha": 0},
    reward_data: {"x": 0.57, "y": 0.7, "alpha": 0},
    font: {"fontFamily": "chunk", "fontSize": "128px", "color": "#DDDDDD", "wordWrap": { width: 3420 }, "align": "center"},
    unlocked_color: "#F9E113"
    
};

export const CONST_REMAP_SCREEN_DATA = {
    
    font: {"fontFamily": "chunk", "fontSize": "128px", "color": "#DDDDDD", "wordWrap": { width: 3420 }, "align": "center"},
    data: {
    
        "left": {"x": 0.3, "y": 0.35, "alpha": 0},
        "right": {"x": 0.3, "y": 0.475, "alpha": 0},
        "up": {"x": 0.3, "y": 0.1, "alpha": 0},
        "down": {"x": 0.3, "y": 0.225, "alpha": 0},
        "A": {"x": 0.8, "y": 0.1, "alpha": 0},
        "B": {"x": 0.8, "y": 0.225, "alpha": 0},
        "X": {"x": 0.8, "y": 0.35, "alpha": 0},
        "Y": {"x": 0.8, "y": 0.475, "alpha": 0},
        "L": {"x": 0.8, "y": 0.725, "alpha": 0},
        "R": {"x": 0.8, "y": 0.6, "alpha": 0},
        "confirm": {"x": 0.3, "y": 0.6, "alpha": 0},
        "pause": {"x": 0.3, "y": 0.725, "alpha": 0}
    
    },
    highlight: "#F9E113"
    
}

export const CONST_CURRENCY_DATA = {
    
    x: 0.07,
	y: 0.03,
	alpha: 0,
	font: {"fontFamily": "chunk", "fontSize": "128px", "color": "#8AF1FF"}
    
};

export const CONST_PICKUP_SPEED = 50;