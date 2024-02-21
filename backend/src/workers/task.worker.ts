import { HealthcheckController } from "../controllers/healthcheck.controller";
import { DAYS_DUE_SOON, LIMIT_BATCH_WORKER } from "../config";
import { TaskService } from "../services/task.service";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const doWork = async (taskService: TaskService) => {
    if (HealthcheckController.databaseStatus) {
        await taskService.checkDueDateAndUpdateStatus(DAYS_DUE_SOON, LIMIT_BATCH_WORKER);
        await taskService.checkOverDueDateAndUpdateStatus(LIMIT_BATCH_WORKER);
        await delay(1000);
    }
};

export const worker = async (taskService: TaskService) => {
    // Worker runner
    // eslint-disable-next-line
    console.log(`Worker is initializing and starting now | Current time is ${new Date().toISOString()} | Days due soon: ${DAYS_DUE_SOON} | Limit batch worker: ${LIMIT_BATCH_WORKER}`);
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