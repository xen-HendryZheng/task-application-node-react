import { AuthController } from "./controllers/auth.controller";
import { HealthcheckController } from "./controllers/healthcheck.controller";
import { TaskController } from "./controllers/task.controller";
import { AppDataSource } from "./data-source";
import { AuthService } from "./services/auth.service";
import { TaskService } from "./services/task.service";
import { Task } from "./typeorm/entities/task";
// import { worker } from "./workers/auction.worker";

export async function init(): Promise<Record<string, any>> {

    // initialize repo
    const taskRepository = AppDataSource.getRepository(Task);
    // initialize service
    const authService = new AuthService();
    const taskService = new TaskService(taskRepository);

    // Initialize controllers
    const authController = new AuthController(authService);
    const taskController = new TaskController(taskService);
    const healthcheckController = new HealthcheckController();
    
    // Init Worker
    

    return { authController, healthcheckController,taskController };
}