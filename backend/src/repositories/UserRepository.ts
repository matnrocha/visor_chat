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
}