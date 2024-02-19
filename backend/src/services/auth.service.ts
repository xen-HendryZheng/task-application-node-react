import { User } from '../typeorm/entities/user.entity';
import { ErrorCodeMap, ErrorCodeTypeorm, ErrorCodes, StandardError } from '../libs/error';
import { AppDataSource } from '../data-source';
import { comparePassword, hashPassword } from '../libs/bcrypt';
import { getUserSession } from '../libs/context-session';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async getUser(): Promise<[User, Error]> {
        const userSession = await getUserSession();
        const user = await this.userRepository.findOne({
            where: {
                userId: userSession.user_id
            },
        });
        if (user) {
            return [user, null];
        } else {
            return [null, new StandardError(ErrorCodes.USER_NOT_FOUND)]
        }
    }

    async login(email: string, password: string): Promise<[User, Error]> {
        const user = await this.userRepository.findOne({
            where: {
                userEmail: email
            },
        });
        if (user) {
            const isMatched = await comparePassword(password, user.userPassword);
            if (isMatched) {
                return [user, null];
            } else {
                return [null, new StandardError(ErrorCodes.INVALID_CREDENTIALS, null, { email })]
            }
        } else {
            return [null, new StandardError(ErrorCodes.USER_NOT_FOUND, null, { email })]
        }
    }

    async register(email: string, password: string): Promise<User> {
        try {
            const hashedPassword = await hashPassword(password);
            const newUser = this.userRepository.create({ userEmail: email, userPassword: hashedPassword, userCreated: new Date() });
            const user = await this.userRepository.save(newUser);
            return user;
        } catch (err: any) {
            if (err.code) {
                const errorCodeMap = ErrorCodeTypeorm[err.code] || undefined;
                if (errorCodeMap) {
                    throw new StandardError(errorCodeMap, `Email ${email} has been registered. Please login with your email and password`, null, { email });
                }
            }
            return null;
        }

    }
}
