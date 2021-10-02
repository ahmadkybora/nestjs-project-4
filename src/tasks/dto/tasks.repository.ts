import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './create-task.dto';
import { Task } from './task.entity.dto';
import { TaskStatus } from '../task-status.enum';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(_filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = _filterDto;
    const query = this.createQueryBuilder('tasks');
    query.where({ user });

    if (status) {
      query.andWhere('tasks.status = :status', { status: 'OPEN' });
    }
    if (search) {
      query.andWhere(
        'LOWER(tasks.title) LIKE lower(:search) OR LOWER(tasks.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(task);
    return task;
  }
}
