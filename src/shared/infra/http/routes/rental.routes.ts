import { CreateRentalController } from '@modules/rentals/useCases/createRental/CreateRentalController'
import { Router } from 'express'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController'

const rentalRoutes = Router()

const createRentalController = new CreateRentalController()
const devolutionRentalController = new DevolutionRentalController()

rentalRoutes.post('/', ensureAuthenticated, createRentalController.handle)
rentalRoutes.post('/devolution/:id', ensureAuthenticated, devolutionRentalController.handle)

export { rentalRoutes }