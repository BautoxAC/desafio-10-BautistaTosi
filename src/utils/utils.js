import multer from 'multer'
import { Server } from 'socket.io'
import { logger } from './logger.js'
import { ChatManagerDBService } from '../services/chat.service.js'
import { CartManagerDBService } from '../services/carts.service.js'
import { UserManagerDBService } from '../services/user.service.js'
import config from '../config/env.config.js'
import { __dirname } from './__dirname.js'
// -------------MONGO------------------
import { connect } from 'mongoose'

// ----------------- BCRYPT ---------------------
import bcrypt from 'bcrypt'

// ------------MULTER------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/assets')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
export const uploader = multer({ storage })
// -------------Mensaje de status---------------------------
export function newMessage (status, message, data, filename) {
  const messageObject = { status, message, data, filename }
  switch (status) {
    case 'success':
      logger.info(messageObject)
      break
    case 'warning':
      logger.warn(messageObject)
      break
    case 'failure':
      logger.error(messageObject)
      break
    default:
      logger.info('this message has no status (check it)')
      break
  }
  return messageObject
}

// --------------Socket Server---------------------------
export function connectSocketServer (httpServer) {
  const socketServer = new Server(httpServer)
  socketServer.on('connection', async (socket) => {
    console.log('cliente conectado')
    // vista /chat
    const MessageManager = new ChatManagerDBService()
    const CartManager = new CartManagerDBService()
    const userManager = new UserManagerDBService()
    socket.on('new_message_front_to_back', async (message, userName) => {
      try {
        await MessageManager.addMessage(message, userName)
        const messages = await MessageManager.getMessages()
        socket.emit('message_created_back_to_front', newMessage(true, 'message created', messages))
      } catch (e) {
        socket.emit('message_created_back_to_front', newMessage(false, 'an error ocurred', ''))
      }
    })
    // vista /products
    socket.on('add_product_to_cart_front_to_back', async ({ idProduct, email }) => {
      try {
        const user = await userManager.getUserByUserName(email)
        const { status } = await CartManager.addProduct(user.data.cart, idProduct)
        socket.emit('add_product_to_cart_back_to_front', { status, cartId: user.data.cart })
      } catch (e) {
        socket.emit('add_product_to_cart_back_to_front', { status: 'failure', message: 'something went wrong :(', data: {} })
      }
    })
  })
}
// ------------ MONGO DB ------------------
const { mongoUrl } = config
export async function connectMongo () {
  try {
    await connect(`${mongoUrl}`)
  } catch (e) {
    throw new Error('can not connect to the db')
  }
}

// ----------------- BCRYPT ---------------------
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword)

// ---------------- Current time----------------

const currentDateAndTime = new Date()
export const formattedDate = currentDateAndTime.toLocaleString('en-GB')
