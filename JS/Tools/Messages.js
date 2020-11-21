const CONST_MESSAGE_TYPE_EMPTY = "Empty";

var m_message_box = {};

export default class MessageBox
{
	
	static EnsureType(type)
	{
		
		if(!(type in MessageBox.m_message_box))
		{

			MessageBox.m_message_box[type] = [];

		}
		
	}
	
	static PostMessage(message)
	{
		
		MessageBox.EnsureType(message.Type());
		
		MessageBox.m_message_box[message.Type()].push(message);
		
	}

	static ReadMessage(type, discard, index)
	{
		
		MessageBox.EnsureType(type);
		
		if(index < 0 || index >= MessageBox.m_message_box[type].length)
		{

			return Message.Empty();

		} 

		var message = MessageBox.m_message_box[type][index];

		if(discard)
		{

			MessageBox.m_message_box[type].splice(index, 1);

		}

		return message;
		
	}
	
	static PullMessage(type)
	{
		
		return MessageBox.ReadMessage(type, true, 0);
		
	}
	
}

MessageBox.m_message_box = {};

export class Message
{
    
	constructor(type)
	{
		
    	this.type = type;
    
	}
	
	static Empty()
	{
		
		return new Message("Empty");
		
	}
	
	Type()
	{
		
		return this.type;
		
	}
	
	IsEmpty()
	{
		
		return (this.Type() == CONST_MESSAGE_TYPE_EMPTY);
		
	}
	
}