import { User } from '../entities/User';
import { UserModel } from '../models/UserModel';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {

    const user = await UserModel.findOne({ email });

    return user ? new User(
      user._id.toString(),
      user.name,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    ) : null;
  }

  async create(user: User): Promise<User> {

    const newUser = await UserModel.create({
      name: user.name,
      email: user.email,
      password: user.password
    });

    return new User(
      newUser._id.toString(),
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.createdAt,
      newUser.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {

    const user = await UserModel.findById(id);
    if (!user) return null;

    return new User(
      user._id.toString(),
      user.name,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    );
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updates, updatedAt: new Date() },
      { new: true }
    );

    return user ? new User(
      user._id.toString(),
      user.name,
      user.email,
      user.password,
      user.createdAt,
      user.updatedAt
    ) : null;
  }

  async delete(id: string): Promise<boolean> {
    
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}