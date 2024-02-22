import { API_ENDPOINT } from './config';
import axiosInstance from './AxioService';

interface Form {
    email: string;
    password: string;
}

class AuthService {
    login(loginForm: Form) {
        return axiosInstance
            .post(API_ENDPOINT.LOGIN, loginForm);
    };
    register(registerForm: Form) {
        console.log(axiosInstance.post)
        return axiosInstance
            .post(API_ENDPOINT.REGISTER, registerForm);
    };

    logout() {
        localStorage.removeItem('user');
    };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService();