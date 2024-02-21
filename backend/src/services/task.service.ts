import { Task } from 'src/typeorm/entities/task';
import { ErrorCodes, StandardError } from '../libs/error';
import moment from 'moment';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TaskLogService } from './task-log.service';
import { ClickHouseClient } from '@clickhouse/client';
import { ITaskResponse } from 'src/controllers/task.controller';

export class TaskService {
  private readonly taskRepository: Repository<Task>;
  private readonly taskLogService: TaskLogService;
  private readonly clickhouseClient: ClickHouseClient;

  constructor(taskRepository: Repository<Task>, taskLogService: TaskLogService, clickhouseClient: ClickHouseClient) {
    this.taskRepository = taskRepository;
    this.taskLogService = taskLogService;
    this.clickhouseClient = clickhouseClient;
  }

  addItem(item: Partial<Task>): Promise<Task> {
    const newItem = this.taskRepository.create(item);
    return this.taskRepository.save(newItem);
  }

  async getItems(userId: number, sortByCreated?: "ASC" | "DESC", sortByDue?: "ASC" | "DESC", search?: string): Promise<ITaskResponse[]> {
    let selectQuery = `SELECT task_id, task_name, task_description, task_status, task_due_date, task_created FROM task WHERE user_id = ${userId}`;
    if (search) {
      selectQuery += ` AND task_name ILIKE '%${search}%'`;
    }
    if (sortByCreated) {
      selectQuery += ` ORDER BY task_created ${sortByCreated}`;
    }
    if (sortByDue) {
      selectQuery += ` ORDER BY task_due_date ${sortByDue}`;
    }
    console.log(selectQuery);
    const resultSet = await this.clickhouseClient.query({ query: selectQuery, format: 'JSONEachRow' });
    const dataset = await resultSet.json();
    return dataset as ITaskResponse[];
  }

  async getItemsFromDB(userId: number, sortByCreated?: "ASC" | "DESC", sortByDue?: "ASC" | "DESC", search?: string): Promise<ITaskResponse[]> {
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
    const result = await query.getMany();
    return result.map(item => {
      return {
        task_id: item.taskId,
        task_name: item.taskName,
        task_description: item.taskDescription,
        task_due_date: moment(item.taskDueDate).format(),
        task_status: item.taskStatus,
        task_created: moment(item.taskCreated).format()
      }
    });
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

  async checkDueDateAndUpdateStatus(daysToCompare: number, limitPerBatch: number): Promise<Task[]> {
    const dueDate = moment().add(daysToCompare, 'days').toDate();
    const tasks = await this.taskRepository.find({ where: { taskStatus: 'not_urgent', taskDueDate: Between(new Date(), dueDate) }, take: limitPerBatch });
    const updatedTasks = tasks.map((task) => {
      task.taskStatus = 'due_soon';
      return task;
    });
    // Insert to task log
    const taskLogs = updatedTasks.map((task) => {
      return {
        taskId: task.taskId,
        beforeStatus: 'not_urgent',
        afterStatus: task.taskStatus,
        message: `Task status changed to ${task.taskStatus} because due date is ${daysToCompare} days from now(${new Date()})`,
        logCreated: new Date(),
        logCreatedBy: 'system-worker'
      };
    });

    await this.taskRepository.save(updatedTasks);

    // Insert to task log async - publish and forget
    this.taskLogService.addLogBatch(taskLogs);

    return updatedTasks;
  }

  async checkOverDueDateAndUpdateStatus(limitPerBatch: number): Promise<Task[]> {
    const dueDate = moment().toDate();
    const tasks = await this.taskRepository.find({ where: { taskDueDate: LessThanOrEqual(dueDate) }, take: limitPerBatch });
    const updatedTasks = tasks.map((task) => {
      task.taskStatus = 'overdue';
      return task;
    });
    // Insert to task log
    const taskLogs = updatedTasks.map((task) => {
      return {
        taskId: task.taskId,
        beforeStatus: 'due_soon',
        afterStatus: task.taskStatus,
        message: `Task status changed to ${task.taskStatus} because due date is ${task.taskDueDate}`,
        logCreated: new Date(),
        logCreatedBy: 'system-worker'
      };
    });

    await this.taskRepository.save(updatedTasks);

    // Insert to task log async - publish and forget
    this.taskLogService.addLogBatch(taskLogs);

    return updatedTasks;
  }
}
