import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { getEnvOrThrow } from '../config/env';

const JWT_SECRET = getEnvOrThrow('JWT_SECRET');
const JWT_EXPIRES_IN = '1d';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(
      '', // id gerado pelo db
      name,
      email,
      hashedPassword
    );

    const createdUser = await this.userRepository.create(user);
    const token = jwt.sign({ userId: createdUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { user: createdUser, token };
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async logout(token: string): Promise<void> {
    // tirar token no front
    console.log(`Token invalidated: ${token}`);
  }
}