import { Request, Response, NextFunction, Router } from 'express';
import { getUserSession } from '../libs/context-session';
import { authenticateToken } from '../middlewares/auth.middleware';
import moment from 'moment';
import { TaskService } from 'src/services/task.service';

export interface ITaskResponse {
    task_id: number;
    task_name: string;
    task_description: string;
    task_due_date: string;
    task_status: string;
    task_created: string;
}

export class TaskController {
    private readonly taskService: TaskService;
    private router: Router;

    constructor(taskService: TaskService) {
        this.taskService = taskService;
        this.router = Router();
        this.router.post('/', authenticateToken, this.createTask.bind(this));
        this.router.get('/', authenticateToken, this.getTasks.bind(this));
        this.router.patch('/', authenticateToken, this.patchItems.bind(this));

    }

    getRouter(): Router {
        return this.router;
    }

    public async createTask(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { task_name, description, due_date, status } = req.body;
            const user = await getUserSession() as any;
            const item = await this.taskService.addItem({
                userId: user.user_id,
                taskName: task_name,
                taskDescription: description,
                taskDueDate: due_date,
                taskStatus: status,
                taskCreated: new Date()
            });
            const response: ITaskResponse = {
                task_id: item.taskId,
                task_name: item.taskName,
                task_description: item.taskDescription,
                task_due_date: moment(item.taskDueDate).format(),
                task_status: item.taskStatus,
                task_created: moment(item.taskCreated).format()
            }
            return res.status(201).json(response);
        } catch (err) {
            return next(err);
        }

    }
    public async getTasks(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { sortByCreated, sortByDue, search = '', page = 0 } = req.query;
            const { clickhouse } = req.headers;
            const user = await getUserSession() as any;
            if (clickhouse === 'true') {
                const [totalRecord, totalPage, results] = await this.taskService.getItems(user.user_id, page as number, sortByCreated as "ASC" | "DESC", sortByDue as "ASC" | "DESC", decodeURIComponent(search as string));
                return res.status(200).json({
                    total_record: totalRecord,
                    total_page: totalPage,
                    tasks: results
                });
            } else {
                const [totalRecord, totalPage, results] = await this.taskService.getItemsFromDBWithPagination(user.user_id, page as number, sortByCreated as "ASC" | "DESC", sortByDue as "ASC" | "DESC", decodeURIComponent(search as string));
                return res.status(200).json({
                    total_record: totalRecord,
                    total_page: totalPage,
                    tasks: results
                });

            }
        } catch (err) {
            return next(err);

        }
    }

    public async patchItems(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { task_id, task_name, task_description, task_due_date, task_status } = req.body;
            const user = await getUserSession() as any;
            const item = await this.taskService.patchItem(task_id, user.user_id, {
                taskName: task_name,
                taskDescription: task_description,
                taskDueDate: task_due_date,
                taskStatus: task_status
            });
            const response: ITaskResponse = {
                task_id: item.taskId,
                task_name: item.taskName,
                task_description: item.taskDescription,
                task_due_date: moment(item.taskDueDate).format(),
                task_status: item.taskStatus,
                task_created: moment(item.taskCreated).format()
            }
            return res.status(200).json(response);
        } catch (err) {
            return next(err);
        }
    }
}
