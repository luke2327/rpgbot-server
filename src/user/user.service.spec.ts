import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { UserService } from './user.service'
import { UserEntity } from './entities/user.entity'
import { SlackService } from 'src/slack/slack.service'
import { SaveUserDto } from './dto/saveUser.dto'

describe('UserService', () => {
  let service: UserService
  let usersRepository: jest.Mocked<Repository<UserEntity>>
  let dataSource: jest.Mocked<DataSource>
  let slackService: jest.Mocked<SlackService>

  const mockUsersRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  }

  const mockManager = {
    create: jest.fn(),
    save: jest.fn(),
  }

  const mockDataSource = {
    transaction: jest.fn((cb) => cb(mockManager)),
  }

  const mockSlackService = {
    web: {
      chat: {
        postMessage: jest.fn(),
      },
    },
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUsersRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: SlackService,
          useValue: mockSlackService,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    usersRepository = module.get(getRepositoryToken(UserEntity))
    dataSource = module.get(DataSource)
    slackService = module.get(SlackService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
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

    it('should save user with character and stats successfully', async () => {
      const mockUser = { userId: 'uuid-123' }
      const mockCharacter = { characterId: 1 }
      const mockStats = { statsId: 1 }

      mockManager.create
        .mockReturnValueOnce(mockUser)
        .mockReturnValueOnce(mockCharacter)
        .mockReturnValueOnce(mockStats)
      mockManager.save.mockResolvedValue({})
      mockSlackService.web.chat.postMessage.mockResolvedValue({})

      const result = await service.saveUser(mockSaveUserDto)

      expect(mockDataSource.transaction).toHaveBeenCalled()
      expect(mockManager.create).toHaveBeenCalledTimes(3)
      expect(mockManager.save).toHaveBeenCalledTimes(3)
      expect(mockSlackService.web.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: expect.any(String),
          blocks: expect.any(Array),
        }),
      )
      expect(result).toEqual({
        template: { outputs: [{ simpleText: { text: '유저 저장 완료' } }] },
        version: '2.0',
      })
    })

    it('should create user entity with correct data', async () => {
      mockManager.create.mockReturnValue({})
      mockManager.save.mockResolvedValue({})
      mockSlackService.web.chat.postMessage.mockResolvedValue({})

      await service.saveUser(mockSaveUserDto)

      expect(mockManager.create).toHaveBeenNthCalledWith(
        1,
        UserEntity,
        expect.objectContaining({
          kakaoUserId: 'kakao-user-id-123',
          kakaoBotUserKey: 'bot-user-key-123',
        }),
      )
    })

    it('should create character entity with job and sex', async () => {
      mockManager.create.mockReturnValue({})
      mockManager.save.mockResolvedValue({})
      mockSlackService.web.chat.postMessage.mockResolvedValue({})

      await service.saveUser(mockSaveUserDto)

      expect(mockManager.create).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
        expect.objectContaining({
          job: 'warrior',
          sex: 'male',
        }),
      )
    })

    it('should send slack notification with user info', async () => {
      mockManager.create.mockReturnValue({ characterId: 1 })
      mockManager.save.mockResolvedValue({})
      mockSlackService.web.chat.postMessage.mockResolvedValue({})

      await service.saveUser(mockSaveUserDto)

      expect(mockSlackService.web.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({
              type: 'header',
              text: expect.objectContaining({ text: '신규유저가입' }),
            }),
          ]),
        }),
      )
    })

    it('should handle mage job correctly', async () => {
      const mageDto: SaveUserDto = {
        ...mockSaveUserDto,
        action: {
          ...mockSaveUserDto.action,
          clientExtra: { job: 'mage' as const, sex: 'female' as const },
        },
      }

      mockManager.create.mockReturnValue({})
      mockManager.save.mockResolvedValue({})
      mockSlackService.web.chat.postMessage.mockResolvedValue({})

      await service.saveUser(mageDto)

      expect(mockManager.create).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
        expect.objectContaining({
          job: 'mage',
          sex: 'female',
        }),
      )
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [{ userId: '1' }, { userId: '2' }] as UserEntity[]
      mockUsersRepository.find.mockResolvedValue(mockUsers)

      const result = await service.findAll()

      expect(result).toEqual(mockUsers)
      expect(mockUsersRepository.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { userId: 'test-id' } as UserEntity
      mockUsersRepository.findOneBy.mockResolvedValue(mockUser)

      const result = await service.findOne('test-id')

      expect(result).toEqual(mockUser)
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        userId: 'test-id',
      })
    })

    it('should return null if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null)

      const result = await service.findOne('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('remove', () => {
    it('should delete a user by id', async () => {
      mockUsersRepository.delete.mockResolvedValue({ affected: 1, raw: {} })

      await service.remove('test-id')

      expect(mockUsersRepository.delete).toHaveBeenCalledWith('test-id')
    })
  })
})
