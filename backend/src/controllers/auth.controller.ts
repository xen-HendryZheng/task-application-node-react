import { Router, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { JWT_DURATION_HOUR, JWT_SECRET } from '../config';
import moment from 'moment';
import { authenticateToken } from '../middlewares/auth.middleware';
export class AuthController {
    private readonly authService: AuthService;

    private router: Router;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.router = Router();
        this.router.post('/login', this.login.bind(this));
        this.router.post('/register', this.register.bind(this));
        this.router.get('/profile', authenticateToken, this.profile.bind(this));
        this.router.post('/logout', this.logout.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { email, password } = req.body;
            const [user, err] = await this.authService.login(email, password);
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const expiryJwt = moment().add(JWT_DURATION_HOUR, 'hours');
            const token = jwt.sign({ user_id: user.userId, user_email: user.userEmail, expiry: expiryJwt }, JWT_SECRET as string);
            return res.status(200).json({ access_token: token });
        } catch (err) {
            console.log(err);
            return next(err);
        }

    }

    public async profile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const [user, err] = await this.authService.getUser();
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            return res.status(200).json({ user });
        } catch (err) {
            console.log(err);
            return next(err);
        }

    }

    public async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { email, password } = req.body;

            const user = await this.authService.register(email, password);
            return res.status(200).json({ message: `Registration successful for ${user.userEmail}` });
        } catch (err) {
            return next(err);
        };
        
    }


    public async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        // Implement logout logic here
        res.status(200).json({ message: 'Logout successful' });
    }
}
