import { RentaslRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateRentalUseCase } from "./CreateRentalUseCase"

let createRentalUseCase: CreateRentalUseCase
let rentalsRepositoryInMemory: RentaslRepositoryInMemory

describe('Create Rental', () => {
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentaslRepositoryInMemory()
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory)
    })

    it('should be able to create a new rental', async () => {
        const car_id = '12345'
        const user_id = '121212'
        const expected_return_date = new Date()
        const rental = await createRentalUseCase.execute({ car_id, user_id, expected_return_date })

        expect(rental).toHaveProperty('id')
        expect(rental).toHaveProperty('start_date')
    })

    it('should not be able to create a new rental if there is another open to the same user', async () => {
        expect(async () => {
            const car_id = '12345'
            const user_id = '121212'
            const expected_return_date = new Date()
            await createRentalUseCase.execute({ car_id, user_id, expected_return_date })
            await createRentalUseCase.execute({ car_id, user_id, expected_return_date })
        }).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create a new rental if there is another open to the same car', async () => {
        expect(async () => {
            const car_id = '12345'
            const user_id_1 = '123'
            const user_id_2 = '321'
            const expected_return_date = new Date()
            await createRentalUseCase.execute({ car_id, user_id: user_id_1, expected_return_date })
            await createRentalUseCase.execute({ car_id, user_id: user_id_2, expected_return_date })
        }).rejects.toBeInstanceOf(AppError)
    })
})