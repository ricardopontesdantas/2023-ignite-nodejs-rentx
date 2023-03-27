import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let carsRepositoryInMemory: CarsRepositoryInMemory
let createCarSpecificationUseCase: CreateCarSpecificationUseCase

describe('Create Car Specification', () => {
    beforeEach(() => {
        carsRepositoryInMemory = new CarsRepositoryInMemory()
        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory)
    })

    it('should not be able to add a new specification to a non-existent car', async () => {
        expect(async () => {
            const car_id = '12345'
            const specifications_id = ['54321']
            await createCarSpecificationUseCase.execute({ car_id, specifications_id })
        }).rejects.toBeInstanceOf(AppError)
    })

    it('should be able to add a new specification to the car', async () => {
        const car = await carsRepositoryInMemory.create({
            name: 'Name Car',
            description: 'Description Car',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand Car',
            category_id: 'category-id'
        })

        const specifications_id = ['54321']

        await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id })
    })
})