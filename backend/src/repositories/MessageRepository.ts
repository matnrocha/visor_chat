import { Message } from '../entities/Message';
import { MessageModel } from '../models/MessageModel';

export class MessageRepository {
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

  async delete(id: string): Promise<boolean> {
    const result = await MessageModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}