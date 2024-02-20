import { TaskLog } from "src/typeorm/entities/task-log";
import { Repository } from "typeorm";

export class TaskLogService {

    private readonly taskLogRepository: Repository<TaskLog>;
    
    constructor(taskLogRepository: Repository<TaskLog>) {
        this.taskLogRepository = taskLogRepository;
    }

    async addLog(taskLog: Partial<TaskLog>): Promise<TaskLog> {
        const newLog = this.taskLogRepository.create(taskLog);
        return this.taskLogRepository.save(newLog);
    }
    
    async addLogBatch(taskLogs: Partial<TaskLog>[]): Promise<TaskLog[]> {
        const newLogs = this.taskLogRepository.create(taskLogs);
        return this.taskLogRepository.save(newLogs);
    }

    async getLogs(taskId: number): Promise<TaskLog[]> {
        return this.taskLogRepository.find({
            where: {
                taskId
            }
        });
    }

}