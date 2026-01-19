import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { LoggerService } from 'src/logger'
import { SaveUserDto } from './dto/saveUser.dto'

describe('UserController', () => {
  let controller: UserController
  let userService: jest.Mocked<UserService>
  let loggerService: jest.Mocked<LoggerService>

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    saveUser: jest.fn(),
  }

  const mockLoggerService = {
    setContext: jest.fn().mockReturnThis(),
    setMetadata: jest.fn().mockReturnThis(),
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
    userService = module.get(UserService)
    loggerService = module.get(LoggerService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('saveUser', () => {
    const mockSaveUserDto: SaveUserDto = {
      bot: { id: 'bot-id', name: 'bot-name' },
      intent: {
        id: 'intent-id',
        name: 'intent-name',
        extra: { reason: { code: 0, message: '' } },
      },
      action: {
        id: 'action-id',
        name: 'action-name',
        params: {} as any,
        detailParams: {} as any,
        clientExtra: { job: 'warrior' as const, sex: 'male' as const },
      },
      userRequest: {
        block: { id: 'block-id', name: 'block-name' },
        user: {
          id: 'kakao-user-id-123',
          type: 'botUserKey',
          properties: {
            botUserKey: 'bot-user-key-123',
            bot_user_key: 'bot-user-key-123',
          },
        },
        utterance: 'test utterance',
        params: { ignoreMe: '', surface: '' },
        lang: 'ko',
        timezone: 'Asia/Seoul',
      },
      contexts: [],
      flow: { lastBlock: { id: 'last-block-id', name: 'last-block-name' } },
    }

    it('should call userService.saveUser with correct dto', async () => {
      const expectedResult = {
        version: '2.0',
        template: { outputs: [{ simpleText: { text: '유저 저장 완료' } }] },
      }
      mockUserService.saveUser.mockResolvedValue(expectedResult)

      const result = await controller.saveUser(mockSaveUserDto)

      expect(userService.saveUser).toHaveBeenCalledWith(mockSaveUserDto)
      expect(result).toEqual(expectedResult)
    })

    it('should handle warrior job', async () => {
      mockUserService.saveUser.mockResolvedValue({})

      await controller.saveUser(mockSaveUserDto)

      expect(userService.saveUser).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            clientExtra: { job: 'warrior', sex: 'male' },
          }),
        }),
      )
    })

    it('should handle mage job', async () => {
      const mageDto: SaveUserDto = {
        ...mockSaveUserDto,
        action: {
          ...mockSaveUserDto.action,
          clientExtra: { job: 'mage' as const, sex: 'female' as const },
        },
      }
      mockUserService.saveUser.mockResolvedValue({})

      await controller.saveUser(mageDto)

      expect(userService.saveUser).toHaveBeenCalledWith(
        expect.objectContaining({
          action: expect.objectContaining({
            clientExtra: { job: 'mage', sex: 'female' },
          }),
        }),
      )
    })
  })

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ userId: '1' }, { userId: '2' }]
      mockUserService.findAll.mockResolvedValue(mockUsers as any)

      const result = await controller.findAllUsers()

      expect(userService.findAll).toHaveBeenCalled()
      expect(result).toEqual(mockUsers)
    })

    it('should log received body', async () => {
      const body = { test: 'data' }
      mockUserService.findAll.mockResolvedValue([])

      await controller.findAllUsers(body)

      expect(loggerService.log).toHaveBeenCalledWith(
        expect.stringContaining('받은 body'),
        expect.objectContaining({ method: 'findAllUsers' }),
      )
    })

    it('should handle empty body', async () => {
      mockUserService.findAll.mockResolvedValue([])

      await controller.findAllUsers()

      expect(userService.findAll).toHaveBeenCalled()
    })
  })
})
