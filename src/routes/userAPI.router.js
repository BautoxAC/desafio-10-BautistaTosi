import express from 'express'
import { isUser } from '../middlewares/auth.js'
import { UserController } from '../controller/userAPI.controller.js'
export const userRouter = express.Router()
const userControllerRouting = new UserController()

userRouter.put('/premium/:uid', isUser, userControllerRouting.changerole)

userRouter.get('/premium/:uid', isUser, userControllerRouting.renderChangeRole)
