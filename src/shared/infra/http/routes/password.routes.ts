import { SendForgotPasswordMailController } from '@modules/accounts/useCases/sendFogrotPasswordMail/SendForgotPasswordMailController'
import { Router } from 'express'

const passwordRoutes = Router()

const sendForgotPasswordMailController = new SendForgotPasswordMailController()

passwordRoutes.post('/forgot', sendForgotPasswordMailController.handle)

export { passwordRoutes }