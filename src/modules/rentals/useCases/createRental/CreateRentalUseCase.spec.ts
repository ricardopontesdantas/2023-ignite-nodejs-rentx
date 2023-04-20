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
        const car = await carsRepositoryInMemory.create({
            name: 'Test',
            description: 'Car Test',
            daily_rate: 100,
            license_plate: 'test',
            fine_amount: 40,
            category_id: '1234',
            brand: 'brand'
        })
        const user_id = '121212'
        const expected_return_date = dayAdd24Hours
        const rental = await createRentalUseCase.execute({ car_id: car.id, user_id, expected_return_date })

        expect(rental).toHaveProperty('id')
        expect(rental).toHaveProperty('start_date')
    })

    it('should not be able to create a new rental if there is another open to the same user', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: '12345',
            user_id: '121212',
            expected_return_date: dayAdd24Hours
        })

        await expect(createRentalUseCase.execute({
            car_id: '123456789', 
            user_id: '121212',
            expected_return_date: dayAdd24Hours
        })).rejects.toEqual(new AppError('there\'s a rental in progress for user'))
    })

    it('should not be able to create a new rental if there is another open to the same car', async () => {
        await rentalsRepositoryInMemory.create({
            car_id: '123123123',
            user_id: '121212',
            expected_return_date: dayAdd24Hours
        })
        
        await expect(createRentalUseCase.execute({
            car_id: '123123123', 
            user_id: '212121', 
            expected_return_date: dayAdd24Hours
        })).rejects.toEqual(new AppError('car is unavailable'))
    })

    it('should not be able to create a new rental with invalid return time', async () => {
        const car_id = '12345'
        const user_id = '123'
        const expected_return_date = dayjs().toDate()
        
        await expect(createRentalUseCase.execute({
            car_id,
            user_id: user_id,
            expected_return_date
        })).rejects.toEqual(new AppError('invalid return time'))
    })
})