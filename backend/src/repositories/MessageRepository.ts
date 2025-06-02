import { Message } from '../entities/Message';
import { MessageModel } from '../models/MessageModel';

export class MessageRepository {

  async findById(id: string): Promise<Message | null> {

    const message = await MessageModel.findById(id);
    
    if (!message) return null;

    return new Message(
        message._id.toString(),
        message.sessionId,
        message.content,
        message.role,
        message.modelType,
        message.timestamp
    );
  }

  async findBySessionId(sessionId: string): Promise<Message[]> {

    const messages = await MessageModel.find({ sessionId });

    return messages.map(m => new Message(
      m._id.toString(),
      m.sessionId,
      m.content,
      m.role,
      m.modelType,
      m.timestamp
    ));
  }

  async create(message: Message): Promise<Message> {

    const newMessage = await MessageModel.create({
      sessionId: message.sessionId,
      content: message.content,
      role: message.role,
      modelType: message.modelType
    });

    return new Message(
      newMessage._id.toString(),
      newMessage.sessionId,
      newMessage.content,
      newMessage.role,
      newMessage.modelType,
      newMessage.timestamp
    );
  }
}