import * as bycrpt from 'bcryptjs';
import { SALT_ROUNDS } from '../config';

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await bycrpt.hash(password, SALT_ROUNDS);
    return hashedPassword;
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bycrpt.compare(password, hash);
}