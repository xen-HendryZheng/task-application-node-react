import { AuthController } from "./controllers/auth.controller";
import { HealthcheckController } from "./controllers/healthcheck.controller";
import { TaskController } from "./controllers/task.controller";
import { AppDataSource } from "./data-source";
import { AuthService } from "./services/auth.service";
import { TaskLogService } from "./services/task-log.service";
import { TaskService } from "./services/task.service";
import { Task } from "./typeorm/entities/task";
import { TaskLog } from "./typeorm/entities/task-log";
import { worker } from "./workers/task.worker";

export async function init(): Promise<Record<string, any>> {

    // initialize repo
    const taskRepository = AppDataSource.getRepository(Task);
    const taskLogRepository = AppDataSource.getRepository(TaskLog);
    // initialize service
    const authService = new AuthService();
    const taskLogService = new TaskLogService(taskLogRepository)
    const taskService = new TaskService(taskRepository, taskLogService);

    // Initialize controllers
    const authController = new AuthController(authService);
    const taskController = new TaskController(taskService);
    const healthcheckController = new HealthcheckController();
    
    // Init Worker
    worker(taskService);
    

    return { authController, healthcheckController,taskController };
}