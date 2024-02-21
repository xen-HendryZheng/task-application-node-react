import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'task' })
export class Task {
    @PrimaryColumn({ name: 'task_id', generated: true, type: 'int' })
    taskId: number;

    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'task_name', type: 'text' })
    taskName: string;

    @Column({ name: 'task_description', type: 'text' })
    taskDescription: string = '';

    @Column({ name: 'task_status', type: 'enum', enum: ['not_urgent', 'due_soon', 'overdue'] })
    taskStatus: string = 'not_urgent';

    @Column({ name: 'task_due_date', type: 'timestamp with time zone', nullable: true })
    taskDueDate: Date | null = null;

    @Column({ name: 'task_created', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    taskCreated: Date | null = null;

    @Column({ name: 'task_updated', type: 'timestamp with time zone', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
    taskUpdated: Date | null = null;

}
