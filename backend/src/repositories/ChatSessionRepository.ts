import { ChatSession } from '../entities/ChatSession';
import { ChatSessionModel } from '../models/ChatSessionModel';

export class ChatSessionRepository {

  async create(session: ChatSession): Promise<ChatSession> {
    const newSession = await ChatSessionModel.create({
      userId: session.userId,
      modelType: session.modelType,
      title: session.title
    });
    return new ChatSession(
      newSession._id.toString(),
      newSession.userId,
      newSession.modelType,
      newSession.title,
      newSession.createdAt,
      newSession.updatedAt
    );
  }

  async findById(id: string): Promise<ChatSession | null> {
    const session = await ChatSessionModel.findById(id);
    if (!session) return null;
    return new ChatSession(
      session._id.toString(),
      session.userId,
      session.modelType,
      session.title,
      session.createdAt,
      session.updatedAt
    );
  }

  async findByUserId(userId: string): Promise<ChatSession[]> {
    const sessions = await ChatSessionModel.find({ userId });
    return sessions.map(s => new ChatSession(
      s._id.toString(),
      s.userId,
      s.modelType,
      s.title,
      s.createdAt,
      s.updatedAt
    ));
  }

  async updateTitle(id: string, title: string): Promise<boolean> {
    const result = await ChatSessionModel.updateOne(
      { _id: id },
      { title, updatedAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async updateModel(id: string, modelType: string): Promise<boolean> {
    const result = await ChatSessionModel.updateOne(
        { _id: id },
        { modelType, updatedAt: new Date() }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ChatSessionModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}