import { RentaslRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateRentalUseCase } from "./CreateRentalUseCase"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import dayjs from "dayjs"

let createRentalUseCase: CreateRentalUseCase
let rentalsRepositoryInMemory: RentaslRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryInMemory
let dayjsDateProvider: DayjsDateProvider

describe('Create Rental', () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate()
    beforeEach(() => {
        rentalsRepositoryInMemory = new RentaslRepositoryInMemory()
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        dayjsDateProvider = new DayjsDateProvider()
        createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayjsDateProvider, carsRepositoryInMemory)
    })

    it('should be able to create a new rental', async () => {
        const car_id = '12345'
        const user_id = '121212'
        const expected_return_date = dayAdd24Hours
        const rental = await createRentalUseCase.execute({ car_id, user_id, expected_return_date })

        expect(rental).toHaveProperty('id')
        expect(rental).toHaveProperty('start_date')
    })

    it('should not be able to create a new rental if there is another open to the same user', async () => {
        expect(async () => {
            const car_id = '12345'
            const user_id = '121212'
            const expected_return_date = dayAdd24Hours
            await createRentalUseCase.execute({ car_id, user_id, expected_return_date })
            await createRentalUseCase.execute({ car_id, user_id, expected_return_date })
        }).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create a new rental if there is another open to the same car', async () => {
        expect(async () => {
            const car_id = '12345'
            const user_id_1 = '123'
            const user_id_2 = '321'
            const expected_return_date = dayAdd24Hours
            await createRentalUseCase.execute({ car_id, user_id: user_id_1, expected_return_date })
            await createRentalUseCase.execute({ car_id, user_id: user_id_2, expected_return_date })
        }).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to create a new rental with invalid return time', async () => {
        expect(async () => {
            const car_id = '12345'
            const user_id = '123'
            const expected_return_date = dayjs().toDate()
            await createRentalUseCase.execute({ car_id, user_id: user_id, expected_return_date })
        }).rejects.toBeInstanceOf(AppError)
    })
})