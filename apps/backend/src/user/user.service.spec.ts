import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  // Mock user data for testing
  const mockUser: User = {
    id: '1',
    kindeId: 'kinde_123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    picture: 'https://example.com/picture.jpg',
  };

  // Create mock PrismaService
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByKindeId', () => {
    it('should find a user by kindeId', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByKindeId('kinde_123');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { kindeId: 'kinde_123' },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByKindeId('nonexistent_kinde_id');

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { kindeId: 'nonexistent_kinde_id' },
      });
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findById('nonexistent_id');

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'nonexistent_id' },
      });
    });
  });

  describe('createOrUpdate', () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should create or update a user', async () => {
      mockPrismaService.user.upsert.mockResolvedValue(mockUser);

      const result = await service.createOrUpdate('kinde_123', userData);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.upsert).toHaveBeenCalledWith({
        where: { kindeId: 'kinde_123' },
        create: { kindeId: 'kinde_123', ...userData },
        update: userData,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      await service.remove('1');

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should handle errors when removing non-existent user', async () => {
      mockPrismaService.user.delete.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(service.remove('nonexistent_id')).rejects.toThrow(
        'User not found',
      );
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 'nonexistent_id' },
      });
    });
  });
});
