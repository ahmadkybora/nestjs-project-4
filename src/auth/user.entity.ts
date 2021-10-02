import { Task } from 'src/tasks/dto/task.entity.dto';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  username: string;

  password: string;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  @Exclude({ toPlainOnly: true })
  tasks: Task[];
}
