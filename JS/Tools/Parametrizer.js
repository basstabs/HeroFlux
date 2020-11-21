import Logger from "../Tools/Logger.js";

const CONST_PARAMETRIZER_ADDITION_SYMBOL = "+";
const CONST_PARAMETRIZER_MULTIPLICATION_SYMBOL = "*";

const CONST_PARAMETRIZER_PIECEWISE_DELIMITER = "=";
const CONST_PARAMETRIZER_RANDOM_DELIMITER = "=";

function Parametrizer()
{

}

Parametrizer.function_array = [];

Parametrizer.function_array[0] = {};
Parametrizer.function_array[0].code = "sin";
Parametrizer.function_array[0].func = Math.sin;

Parametrizer.function_array[1] = {};
Parametrizer.function_array[1].code = "cos";
Parametrizer.function_array[1].func = Math.cos;

//Linear combination over time
Parametrizer.LinearCombination = function(start, end, time)
{
	
	return function(t)
	{
	
		return start + ((end - start) * (Math.min(1, t / time)));
		
	};
	
}

//Random float 0 inclusive, 1 exclusive.
Parametrizer.Random = function()
{

	return Math.random();

}

//Random integer between min inclusive, max exclusive
Parametrizer.RandomInteger = function(min, max)
{

	return Math.floor(Parametrizer.RandomFloat(min, max));

}

//Random float between min inclusive, max exclusive
Parametrizer.RandomFloat = function(min, max)
{

	return min + (Parametrizer.Random() * (max - min));

}

Parametrizer.ConstantFunction = function(c)
{

	return function(time){ return c; };

}

Parametrizer.ParametrizeString = function(paramString)
{

	//Allow for the use of time as a variable in expressions.
	if(paramString == "t")
	{

		return function(time) { return time; };

	}

	//Trim outside parentheses
	if(paramString.charAt(0) == "(" && paramString.charAt(paramString.length - 1) == ")")
	{

		return Parametrizer.ParametrizeString(paramString.substring(1, paramString.length - 1));

	}

	//If there's an addition symbol, handle that case separately
	if(paramString.indexOf(CONST_PARAMETRIZER_ADDITION_SYMBOL) > -1)
	{
        
		var func = Parametrizer.AdditionParametrization(paramString);

		//Check if the method returned a function, if not, then we need to resolve it some other way
		if(func != null)
		{

			return func;

		}

	}

	//If there's a multiplication symbol, handle that case separately
	if(paramString.indexOf(CONST_PARAMETRIZER_MULTIPLICATION_SYMBOL) > -1)
	{

		var func = Parametrizer.MultiplicationParametrization(paramString);

		//Check if the method returned a function, if not, then we need to resolve it some other way
		if(func != null)
		{

			return func;

		}

	}

	//Return a constant function for numbers
	var numberConversion = parseFloat(paramString);
	if(!isNaN(paramString) && !isNaN(numberConversion))
	{

		return Parametrizer.ConstantFunction(numberConversion);

	}

	//Negate the resulting parametrization
	if(paramString.charAt(0) == '-')
	{

		var func = Parametrizer.ParametrizeString(paramString.substring(1));
		return function(time){ return -func(time); };

	}

	//Handle random number generation
	if(paramString.charAt(0) == 'r')
	{

		var integer = (paramString.charAt(1) == 'i');

		paramString = paramString.substring(2);

		var terms = paramString.split(CONST_PARAMETRIZER_RANDOM_DELIMITER);

		var min = parseFloat(terms[0]);
		var max = parseFloat(terms[1]);

		if(isNaN(min) || isNaN(max))
		{

			Logger.LogError("Random parametrization expected numerical parameters. Parameters: " + paramString);

			return Parametrizer.ConstantFunction(0);

		}

		return Parametrizer.ConstantFunction((integer ? Parametrizer.RandomInteger(Math.floor(min), Math.floor(max)) : Parametrizer.RandomFloat(min, max)));

	}

	//Invert the parametrization, logging an error whenever it is zero
	if(paramString.indexOf("1/") == 0)
	{

		var func = Parametrizer.ParametrizeString(paramString.substring(2));
		return function(time)
		{

			var value = func(time);

			if(value == 0)
			{

				Logger.LogError("Parametrization attempted to divide by 0.");

				return 0;

			}

			return 1 / value;

		};

	}

	//Process any appearances of predefined functions
	for(var i = 0; i < Parametrizer.function_array.length; i++)
	{

		if(paramString.indexOf(Parametrizer.function_array[i].code + '(') == 0 && paramString.charAt(paramString.length - 1) == ')')
		{

			paramString = paramString.substring(4, paramString.length - 1);
			var func = Parametrizer.ParametrizeString(paramString);

			return function(time) { return Parametrizer.function_array[i].func(func(time)); }

		}

	}

	Logger.LogError("Could not parametrize string. Parameters: " + paramString);

	return Parametrizer.ConstantFunction(0);

}

Parametrizer.PiecewiseParametrization = function(paramString)
{

	if(!paramString.charAt(0) == 'p')
	{

		Logger.LogError("Expected 'p' to lead parameters for piecewise parametrization. Parameters: " + paramString);

		return Parametrizer.ConstantFunction(0);

	}

	paramString = paramString.substring(1);
	var terms = paramString.split(CONST_PARAMETRIZER_PIECEWISE_DELIMITER);

	var data = [];
	data[0] = {};
	data[0].time = 0;
	data[0].func = Parametrizer.ParametrizeString(terms[0]);

	var numTerms = Math.floor((terms.length  - 1) / 2);
	var oldTime = 0;

	for(var i = 1; i <= numTerms; i++)
	{

		data[i] = {};
		data[i].time = parseFloat(terms[(2 * i) - 1]);
		data[i].func = Parametrizer.ParametrizeString(terms[2 * i]);

		if(data[i].time <= oldTime)
		{

			Logger.LogError("Piecewise parametrizations require increasing times. Parameters: " + paramString);

			return Parametrizer.ConstantFunction(0);

		}

		oldTime = data[i].time;

	}

    var resetTime = 0;
    if(terms.length % 2 == 0)
    {
    
        resetTime = parseFloat(terms[terms.length - 1]);
        
    }
    
	return function(time)
	{

        var t = time;
        
        //Wrap around time
        if(resetTime > 0 && t > resetTime)
        {
            
            while(t > resetTime)
            {
                
                t -= resetTime;
                
            }
            
        }
        
		var index = 0;
		while(index < data.length - 1 && data[index + 1].time <= t)
		{

			index += 1;

		}

		return data[index].func(t - data[index].time);

	};

}

Parametrizer.AdditionParametrization = function(paramString)
{

	var terms = Parametrizer.ParenthesesSymbolSplit(paramString, CONST_PARAMETRIZER_ADDITION_SYMBOL);

	if(terms.length <= 1)
	{

		//All addition is inside the parentheses, so we should ignore it
		return null;

	}

	for(var i = 0; i < terms.length; i++)
	{

		terms[i] = Parametrizer.ParametrizeString(terms[i]);

	}

	return function(time)
		{

			var sum = 0;

			for(var i = 0; i < terms.length; i++)
			{

				sum += terms[i](time);

			}

			return sum;

		};

}

Parametrizer.MultiplicationParametrization = function(paramString)
{

	var terms = Parametrizer.ParenthesesSymbolSplit(paramString, CONST_PARAMETRIZER_MULTIPLICATION_SYMBOL);

	if(terms.length <= 1)
	{

		//All multip[lication is inside the parentheses, so we should ignore it
		return null;

	}

	for(var i = 0; i < terms.length; i++)
	{

		terms[i] = Parametrizer.ParametrizeString(terms[i]);

	}

	return function(time)
		{

			var product = 1;

			for(var i = 0; i < terms.length; i++)
			{

				product *= terms[i](time);

			}

			return product;

		};

}

Parametrizer.CreateParametrization = function(paramString)
{

	paramString = paramString.toLowerCase();
	paramString = paramString.replace(/\s+/g, '');

	//Handle Piecewise
	if(paramString.charAt(0) == 'p')
	{

		return Parametrizer.PiecewiseParametrization(paramString);

	}
    
	return Parametrizer.ParametrizeString(paramString);

}

Parametrizer.ParenthesesSymbolSplit = function(str, symbol)
{

	var total_split = str.split(symbol);

	var split = [];
	var splitCount = 0;

	var numLeft = 0;
	var numRight = 0;

	var lastIndex = -1;

	for(var i = 0; i < total_split.length; i++)
	{

		numLeft += total_split[i].split("(").length;
		numRight += total_split[i].split(")").length;

		if(numLeft == numRight)
		{

			split[splitCount] = "";

			for(var j = lastIndex + 1; j <= i; j++)
			{

				split[splitCount] += total_split[j] + symbol;

			}

			split[splitCount] = split[splitCount].substring(0, split[splitCount].length - 1);

			lastIndex = i;
			splitCount += 1;

		}

	}

	return split;

}

export default Parametrizer;