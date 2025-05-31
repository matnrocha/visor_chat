export class Message {
    constructor(
      public id: string,
      public sessionId: string,
      public content: string,
      public role: 'user' | 'model' | 'system',
      public modelType: string,
      public timestamp?: Date
    ) {}
  }