import { API_ENDPOINT } from './config';
import axiosInstance from './AxioService';


class TaskService {
    createTask(taskName: string, description: string, due_date: string) {
        return axiosInstance
            .post(API_ENDPOINT.TASKS, {
                task_name: taskName,
                description,
                due_date
            });
    }
    patchTask(taskId: number, taskName: string, description: string, due_date: string) {
        return axiosInstance
            .patch(API_ENDPOINT.TASKS, {
                task_id: taskId,
                task_name: taskName,
                description,
                due_date
            });
    }
    getTask(params?: string, clickhouse?: string) {
        return axiosInstance
            .get(params ? API_ENDPOINT.TASKS + '?' + params : API_ENDPOINT.TASKS, { headers: { 'clickhouse': clickhouse || 'false' } });
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new TaskService();