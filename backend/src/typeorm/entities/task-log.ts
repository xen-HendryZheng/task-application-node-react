import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'task_log' })
export class TaskLog {
    @PrimaryColumn({ name: 'task_log_id', generated: true, type: 'int' })
    taskLogId: number;

    @Column({ name: 'task_id', type: 'int' })
    taskId: number;

    @Column({ name: 'message', type: 'text' })
    message: string;

    @Column({ name: 'log_created_by', type: 'text' })
    logCreatedBy: string;

    @Column({ name: 'before_status', type: 'enum', enum: ['not_urgent', 'due_soon', 'overdue'] })
    beforeStatus: string;

    @Column({ name: 'after_status', type: 'enum', enum: ['not_urgent', 'due_soon', 'overdue'] })
    afterStatus: string;

    @Column({ name: 'log_created', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    logCreated: Date | null = null;

}