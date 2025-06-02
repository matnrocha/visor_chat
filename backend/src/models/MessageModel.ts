import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  sessionId: { type: String, required: true },
  content:   { type: String, required: true },
  role:      { type: String, enum: ['user', 'model', 'system'], required: true },
  modelType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const MessageModel = model('Message', messageSchema);