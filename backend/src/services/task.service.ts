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

  async getItems(userId: number): Promise<Task[]> {
    return this.taskRepository.find({ where: { userId } });
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
