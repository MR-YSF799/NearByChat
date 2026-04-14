import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
//userRepository : C'est ton outil pour "discuter" avec SQL sans écrire de SQL
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Trouver un utilisateur par nom d'utilisateur (pour le login)
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // Trouver un utilisateur par ID
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Créer un utilisateur
  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);// preparer l'objet 
    return this.userRepository.save(newUser);// sauvgarde reelle 
  }
}
