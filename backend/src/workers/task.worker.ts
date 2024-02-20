import { DAYS_DUE_SOON, LIMIT_BATCH_WORKER } from "../config";
import { TaskService } from "../services/task.service";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const doWork = async (taskService: TaskService) => {
    await taskService.checkDueDateAndUpdateStatus(DAYS_DUE_SOON, LIMIT_BATCH_WORKER);
    await taskService.checkOverDueDateAndUpdateStatus(LIMIT_BATCH_WORKER);
    await delay(1000);
};

export const worker = async (taskService: TaskService) => {
    // Worker runner
    // eslint-disable-next-line
    console.log(`Current time is ${new Date()} | Worker is initializing and starting now`);
    while (true) {
        try {
            await doWork(taskService); // eslint-disable-line
        } catch (err) {
            console.error(err, 'error in worker');
        } finally {
            // console.info('done');
        }
    }
};