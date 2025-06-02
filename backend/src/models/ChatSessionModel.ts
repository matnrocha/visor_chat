import { Schema, model } from 'mongoose';

const chatSessionSchema = new Schema({
  userId:    { type: String, required: true },
  modelType: { type: String, required: true },
  title:     { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ChatSessionModel = model('ChatSession', chatSessionSchema);