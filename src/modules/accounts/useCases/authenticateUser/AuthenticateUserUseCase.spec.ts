import { AppError } from "@shared/errors/AppError"
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO"
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory"
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory
let createUserUseCase: CreateUserUseCase
let dateProvider: DayjsDateProvider

describe('Authenticate User', () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory()
        usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory()
        dateProvider = new DayjsDateProvider()
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory,
            usersTokensRepositoryInMemory,
            dateProvider
        )
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            driver_license: '000123',
            email: 'user@test.com',
            password: '1234',
            name: 'User Test'
        }

        await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })

        expect(result).toHaveProperty('token')
    })

    it('should not be able to authenticate a non-existent user', async () => {
        await expect(authenticateUserUseCase.execute({
                email: 'non-existing@test.com',
                password: 'error-password'
            })
        ).rejects.toEqual(new AppError('email or password incorrect'))
    })

    it('should not be able to authenticate with incorrect password', async () => {
        const user: ICreateUserDTO = {
            driver_license: '000123',
            email: 'user@test.com',
            password: '1234',
            name: 'User Test'
        }

        await createUserUseCase.execute(user)

        await expect(authenticateUserUseCase.execute({
                email: user.email,
                password: 'incorrect-password'
            })
        ).rejects.toEqual(new AppError('email or password incorrect'))
    })
})