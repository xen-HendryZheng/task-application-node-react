import { User } from 'src/typeorm/entities/user.entity';
import { hashPassword, comparePassword } from 'src/libs/bcrypt';
import { getUserSession } from 'src/libs/context-session';
import { StandardError } from 'src/libs/error';
import { AuthService } from 'src/services/auth.service';

jest.mock('src/libs/bcrypt');
jest.mock('src/libs/context-session');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: any;

  beforeEach(() => {
    authService = new AuthService();
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    authService['userRepository'] = mockUserRepository;
  });

  describe('getUser', () => {
    it('should return user if session exists', async () => {
      const mockUser = new User();
      (getUserSession as jest.Mock).mockResolvedValueOnce({
        user_id: '123',
      });
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      const [user, error] = await authService.getUser();

      expect(user).toEqual(mockUser);
      expect(error).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user on successful login', async () => {
      const mockUser = new User();
      mockUser.userPassword = 'encodedPassword';
      (comparePassword as jest.Mock).mockResolvedValueOnce(true);

      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      const [user, error] = await authService.login(
        'test@example.com',
        'password'
      );

      expect(user).toEqual(mockUser);
      expect(error).toBeNull();
    });

    it('should return error on wrong password', async () => {
      const mockUser = new User();
      mockUser.userPassword = 'encodedPassword';
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);

      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      const [user, error] = await authService.login(
        'test@example.com',
        'wrongPassword'
      );

      expect(user).toBeNull();
      expect(error).toBeInstanceOf(StandardError);
    });
  });

  describe('register', () => {
    it('should successfully register user', async () => {
      const hashedPassword = 'encodedPassword';
      (hashPassword as jest.Mock).mockResolvedValueOnce(hashedPassword);

      const mockUser = new User();
      mockUserRepository.create.mockReturnValueOnce(mockUser);
      mockUserRepository.save.mockResolvedValueOnce(mockUser);

      const user = await authService.register('test@example.com', 'password');

      expect(user).toEqual(mockUser);
    });

  });
});