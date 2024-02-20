import { Task } from 'src/typeorm/entities/task';
import { AppDataSource } from '../data-source';
import { ErrorCodes, StandardError } from '../libs/error';
import moment from 'moment';
import { Repository } from 'typeorm';

export class TaskService {
  private taskRepository: Repository<Task>;

  constructor(taskRepository: Repository<Task>) {
    this.taskRepository = taskRepository;
  }

  addItem(item: Partial<Task>): Promise<Task> {
    const newItem = this.taskRepository.create(item);
    return this.taskRepository.save(newItem);
  }

  async getItems(userId: number, sortByCreated?: "ASC" | "DESC", sortByDue?:  "ASC" | "DESC", search?: string): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId });
    if (sortByCreated) {
      query.orderBy('task.taskCreated', sortByCreated);
    }
    if (sortByDue) {
      query.orderBy('task.taskDueDate', sortByDue);
    }
    if (search) {
      query.andWhere('task.taskName ILIKE :search', { search: `%${search}%` });
    }
    return query.getMany();
  }

  async getItem(taskId: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { taskId, userId } });
    if (!task) {
      throw new StandardError('Task not found', ErrorCodes.TASK_NOT_FOUND);
    }
    return task;
  }

  async patchItem(taskId: number, userId: number, item: Partial<Task>): Promise<Task> {
    const task = await this.getItem(taskId, userId);
    const updatedTask = { ...task, ...item };
    return this.taskRepository.save(updatedTask);
  }
}
