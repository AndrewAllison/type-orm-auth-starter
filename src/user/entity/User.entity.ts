import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from './Role.entity';
import { UserRO } from '../dto/User.response';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => Role, role => role.users)
    @JoinTable()
    roles: Role[];

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdOn: Date;

    @UpdateDateColumn()
    updatedOn: Date;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<boolean> {
        return await bcrypt.compare(attempt, this.password);
    }

    toResponseObject(): UserRO {
        const { id, firstName, lastName, email, roles, updatedOn, createdOn } = this;
        return {
            id,
            firstName,
            lastName,
            email,
            createdOn,
            updatedOn,
            roles: roles ? roles.map(r => r.name) : [],
        };
    }
}
