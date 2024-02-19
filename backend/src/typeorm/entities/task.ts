import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'task' })
export class Task {
    @PrimaryColumn({ name: 'task_id', generated: true, type: 'int' })
    taskId: number;

    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @Column({ name: 'task_name', type: 'text' })
    taskName: string;

    @Column({ name: 'task_description', type: 'text' })
    taskDescription: string = '';

    @Column({ name: 'task_status', type: 'enum', enum: ['not_urgent', 'due_soon', 'overdue'] })
    taskStatus: string = 'not_urgent';

    @Column({ name: 'task_due_date', type: 'timestamp with time zone', nullable: true})
    taskDueDate: Date | null = null;

    @Column({ name: 'task_created', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    taskCreated: Date | null = null;

}
