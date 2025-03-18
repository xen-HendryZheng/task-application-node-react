import { Task } from 'src/typeorm/entities/task';
import { ErrorCodes, StandardError } from '../libs/error';
import moment from 'moment';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { TaskLogService } from './task-log.service';
import { ClickHouseClient } from '@clickhouse/client';
import { ITaskResponse } from 'src/controllers/task.controller';
import { LIMIT_PER_PAGE_RECORD } from '../config';

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

  async getItems(userId: number, page?: number, sortByCreated?: "ASC" | "DESC" | undefined, sortByDue?: "ASC" | "DESC" | undefined , search?: string): Promise<[Number, Number, ITaskResponse[]]> {
    let selectQuery = `SELECT task_id, task_name, task_description, task_status, task_due_date, task_created FROM task WHERE user_id = ${userId}`;
    let totalCountQuery = `SELECT COUNT(*) as total FROM task WHERE user_id = ${userId}`;
    let orderBy = '';
    if (search) {
      selectQuery += ` AND task_name ILIKE '%${search}%'`;
      totalCountQuery += ` AND task_name ILIKE '%${search}%'`;
    }
    if (sortByCreated) {
      orderBy = ` task_created ${sortByCreated}`;
    }
    if (sortByDue) {
      orderBy = ` task_due_date ${sortByDue}`;
    }
    if (orderBy) {
      selectQuery += ` ORDER BY ${orderBy}`;
    }
    // Get Total Count before query
    const totalResultSet = await this.clickhouseClient.query({ query: totalCountQuery, format:'JSONEachRow'});
    const totalDataset = await totalResultSet.json() as any[];
    const totalRecord = Number(totalDataset[0].total) || 0;
    const totalPage = Math.ceil(totalRecord / LIMIT_PER_PAGE_RECORD);

    if (page) {
      const offset = (page - 1) * LIMIT_PER_PAGE_RECORD;
      selectQuery += ` LIMIT ${LIMIT_PER_PAGE_RECORD} OFFSET ${offset}`;
    } else {
      selectQuery += ` LIMIT ${LIMIT_PER_PAGE_RECORD}`;
    }
    const resultSet = await this.clickhouseClient.query({ query: selectQuery, format: 'JSONEachRow' });
    const dataset = await resultSet.json();
    return [totalRecord, totalPage, dataset as ITaskResponse[]];
  }

  async getItemsFromDBWithPagination(userId: number, page?: number, sortByCreated?: "ASC" | "DESC" | undefined, sortByDue?: "ASC" | "DESC" | undefined, search?: string): Promise<[Number, Number, ITaskResponse[]]> {
    const offset = page ? page * LIMIT_PER_PAGE_RECORD : 0;
    const limit = LIMIT_PER_PAGE_RECORD;
    const queryBuilder = this.taskRepository.createQueryBuilder('task');
    queryBuilder.where('task.userId = :userId', { userId });
    if (sortByCreated) {
      queryBuilder.orderBy('task.taskCreated', sortByCreated);
    }
    if (sortByDue) {
      queryBuilder.orderBy('task.taskDueDate', sortByDue);
    }
    if (search) {
      queryBuilder.andWhere('task.taskName ILIKE :search', { search: `%${search}%` });
    }
    const totalCount = await queryBuilder.getCount();
    const totalPage = Math.ceil(totalCount / LIMIT_PER_PAGE_RECORD);
    queryBuilder.offset(offset);
    queryBuilder.limit(limit);
    const tasks = await queryBuilder.getMany();
    return [totalCount, totalPage, tasks.map((task) => {
      return {
        task_id: task.taskId,
        task_name: task.taskName,
        task_description: task.taskDescription,
        task_due_date: moment(task.taskDueDate).format(),
        task_status: task.taskStatus,
        task_created: moment(task.taskCreated).format()
      };
    })];
  }

  async getItem(taskId: number, userId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { taskId, userId } });
    if (!task) {
      throw new StandardError(ErrorCodes.TASK_NOT_FOUND, 'Task not found');
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
