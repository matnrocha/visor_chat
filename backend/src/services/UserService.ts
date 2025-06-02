import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateUserProfile(
    id: string,
    updates: Partial<Pick<User, 'name' | 'email'>>
  ): Promise<User | null> {
    return this.userRepository.update(id, updates);
  } 

  async deleteUserAccount(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}