import { API_ENDPOINT } from './config';
import axiosInstance from './AxioService';

interface LoginForm {
    email: string;
    password: string;
}

class AuthService {
    login = (loginForm: LoginForm) => {
        return axiosInstance
            .post(API_ENDPOINT.LOGIN, loginForm);
    };
    register = (email: string, password: string) => {
        console.log(axiosInstance.post)
        return axiosInstance
            .post(API_ENDPOINT.REGISTER, {
                email,
                password
            });
    };

    logout = () => {
        localStorage.removeItem('user');
    };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();