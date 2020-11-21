import {CONST_APP_NAME} from "../Constants.js";

const CONST_LOGGER_ERROR_COLOR = "color:red;";
const CONST_LOGGER_WARNING_COLOR = "color:orange;";
const CONST_LOGGER_DEBUG_COLOR = "color:green;";
const CONST_LOGGER_INFO_COLOR = "color:blue;";

export default class Logger
{

	static Log(text, css)
	{

		console.log("%c - " + CONST_APP_NAME + " " + text, css);

	}

	static LogError(err)
	{

		Logger.Log("Error: " + err, CONST_LOGGER_ERROR_COLOR);

	}

	static LogWarning(warn)
	{

		Logger.Log("Warning: " + warn, CONST_LOGGER_WARNING_COLOR);

	}

	static LogDebug(debug)
	{

		Logger.Log("Debug: " + debug, CONST_LOGGER_DEBUG_COLOR);

	}

	static LogInfo(info)
	{

		Logger.Log("Info: " + info, CONST_LOGGER_INFO_COLOR);

	}

}