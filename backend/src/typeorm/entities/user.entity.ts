import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
    @PrimaryColumn({ name: 'user_id', generated: true, type: 'int' })
    userId: string;

    @Index({unique: true})
    @Column({ name: 'user_email', type: 'text' })
    userEmail = '';

    @Column({ name: 'user_password', type: 'text' })
    userPassword = '';

    @Column({ name: 'user_last_login', type: 'timestamp with time zone', nullable: true })
    userLastLogin: Date | null = null;

    @CreateDateColumn({ name: 'user_created', type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP'  })
    userCreated: Date | null = null;
}
