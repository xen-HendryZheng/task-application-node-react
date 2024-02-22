import { TaskService } from '../../src/services/task.service';
import { Between, Repository } from 'typeorm';
import { TaskLogService } from '../../src/services/task-log.service';
import { Task } from '../../src/typeorm/entities/task';
import { BaseResultSet, ClickHouseClient } from '@clickhouse/client';
import { DAYS_DUE_SOON, LIMIT_BATCH_WORKER } from '../../src/config';
import moment from 'moment';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: Repository<Task>;
  let mockTaskLogService: TaskLogService;
  let mockClickHouseClient: ClickHouseClient;

  beforeEach(() => {
    mockTaskRepository = {} as Repository<Task>;
    mockTaskLogService = {} as TaskLogService;
    mockClickHouseClient = {} as ClickHouseClient;
    taskService = new TaskService(mockTaskRepository, mockTaskLogService, mockClickHouseClient);
  });

  describe('addItem', () => {
    it('should add a new task item', async () => {
      const mockItem = {
        taskName: 'Test Task',
        taskDescription: 'This is a test task',
        taskStatus: 'pending',
        taskDueDate: new Date(),
        taskCreated: new Date(),
        taskUpdated: new Date(),
      };
      const mockNewTask: Task = {
        taskId: 1,
        userId: 1,
        user: {} as any,
        ...mockItem,
      }
      mockTaskRepository.create = jest.fn().mockReturnValue(mockNewTask);
      mockTaskRepository.save = jest.fn().mockResolvedValue(mockNewTask);

      const result = await taskService.addItem(mockItem);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(mockItem);
      expect(mockTaskRepository.save).toHaveBeenCalledWith(mockNewTask);
      expect(result).toEqual(mockNewTask);
    });
  });

  describe('getItems', () => {
    it('should return a list of task items with pagination', async () => {
      const mockUserId = 1;
      const mockPage = 1;
      const mockSortByCreated = 'ASC';
      const mockSortByDue = 'DESC';
      const mockSearch = 'test';

      const mockSelectQuery = `SELECT task_id, task_name, task_description, task_status, task_due_date, task_created FROM task WHERE user_id = ${mockUserId} AND task_name ILIKE '%${mockSearch}%' ORDER BY  task_created ${mockSortByCreated}, task_due_date ${mockSortByDue} LIMIT 100 OFFSET 0`;
      const mockTotalCountQuery = `SELECT COUNT(*) as total FROM task WHERE user_id = ${mockUserId} AND task_name ILIKE '%${mockSearch}%'`;
      const mockTotalRecord = 10;
      const mockTotalPage = 1;
      const mockDataset = [
        {
          task_id: 1,
          task_name: 'Test Task',
          task_description: 'This is a test task',
          task_status: 'pending',
          task_due_date: new Date(),
          task_created: new Date(),
        },
      ];

      const mockResultSet: BaseResultSet<unknown> = {
        text: () => Promise.resolve(''),
        stream: jest.fn(),
        close: jest.fn(),
        query_id: '',
        json: jest.fn().mockResolvedValueOnce([{ mockDataset }]),
      };


      const mockResultSetTotalRecord: BaseResultSet<unknown> = {
        text: () => Promise.resolve(''),
        stream: jest.fn(),
        close: jest.fn(),
        query_id: '',
        json: jest.fn().mockResolvedValueOnce([{ total: mockTotalRecord }]),
      };
      mockClickHouseClient.query = jest.fn().mockResolvedValueOnce(mockResultSetTotalRecord).mockResolvedValueOnce(mockResultSet);

      const [totalRecord, totalPage, taskResponse] = await taskService.getItems(
        mockUserId,
        mockPage,
        mockSortByCreated,
        mockSortByDue,
        mockSearch
      );
      expect(mockClickHouseClient.query).toHaveBeenCalledWith({
        query: mockTotalCountQuery,
        format: 'JSONEachRow',
      });
      expect(mockClickHouseClient.query).toHaveBeenLastCalledWith({
        query: mockSelectQuery,
        format: 'JSONEachRow',
      });
      expect(totalRecord).toEqual(mockTotalRecord);
      expect(totalPage).toEqual(mockTotalPage);
      expect(taskResponse.length).toEqual(1);
    });
  });

  describe('getItemsFromDBWithPagination', () => {
    it('should return a list of task items with pagination', async () => {
      const mockUserId = 1;
      const mockPage = 1;
      const mockSortByCreated = 'ASC';
      const mockSortByDue = 'DESC';
      const mockSearch = 'test';
      const mockTotalRecord = 10;
      const mockTotalPage = 1;
      const mockDataset = [
        {
          task_id: 1,
          task_name: 'Test Task',
          task_description: 'This is a test task',
          task_status: 'pending',
          task_due_date: new Date(),
          task_created: new Date(),
        },
      ];
      mockTaskRepository.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValueOnce(mockTotalRecord),
        getMany: jest.fn().mockResolvedValueOnce(mockDataset),
      });

      const [totalRecord, totalPage, taskResponse] = await taskService.getItemsFromDBWithPagination(
        mockUserId,
        mockPage,
        mockSortByCreated,
        mockSortByDue,
        mockSearch
      );
      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(totalRecord).toEqual(mockTotalRecord);
      expect(totalPage).toEqual(mockTotalPage);
      expect(taskResponse.length).toEqual(1);
    });
  });
  
  describe('checkDueDateAndUpdateStatus', () => {
    it('should check due date and update task status', async () => {
      const mockTaskId = 1;
      const mockTask: Task = {
        taskId: mockTaskId,
        userId: 1,
        user: {} as any,
        taskName: 'Test Task',
        taskDescription: 'This is a test task',
        taskStatus: 'not_urgent',
        taskDueDate: new Date(),
        taskCreated: new Date(),
        taskUpdated: new Date(),
      };
      const mockUpdatedTask: Task = {
        ...mockTask,
        taskStatus: 'due_soon',
      };
      mockTaskRepository.find = jest.fn().mockResolvedValue([mockTask]);
      mockTaskRepository.save = jest.fn().mockResolvedValue(mockUpdatedTask);
      mockTaskLogService.addLogBatch = jest.fn().mockResolvedValue([{} as any]);
      const result = await taskService.checkDueDateAndUpdateStatus(mockTaskId, LIMIT_BATCH_WORKER);

      expect(mockTaskRepository.find).toHaveBeenCalled();
      expect(mockTaskRepository.save).toHaveBeenCalledWith([mockUpdatedTask]);
      expect(result.length).toEqual(1);
    });
  });

});