export class ChatSession {
    constructor(
      public id: string,
      public userId: string,
      public modelType: string,
      public title: string,
      public createdAt?: Date,
      public updatedAt?: Date
    ) {}
  }