import * as httpContext from 'express-http-context';
import { USER_SESSION } from '../config';

export async function setSession(sessionName: string, context: unknown) {
    httpContext.set(sessionName, context);
}

export async function getSession(sessionName: string) {
    return httpContext.get(sessionName);
}

export async function getUserSession(){
    return httpContext.get(USER_SESSION);
}