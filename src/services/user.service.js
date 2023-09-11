import { UserManagerDBDAO } from '../DAO/DB/userManagerDB.dao.js'
import { newMessage } from '../utils/utils.js'
import { fileURLToPath } from 'url'
const UserManagerDB = new UserManagerDBDAO()
export class UserManagerDBService {
  async addUsser (userPassword, userName) {
    try {
      const user = UserManagerDB.addUsser(userPassword, userName)
      return newMessage('success', 'user Created successfully', user)
    } catch (e) {
      return newMessage('failure', 'Failed to create a user', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async getUserByUserName (userName) {
    try {
      const user = await UserManagerDB.getUserByUserName(userName)
      return newMessage('success', 'user Found successfully', user)
    } catch (e) {
      return newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async changerole (updateUser, userId) {
    try {
      if (updateUser.role === 'user') {
        updateUser.role = 'premium'
      } else {
        updateUser.role = 'user'
      }
      await UserManagerDB.changeRole(userId, updateUser)
      return updateUser.role
    } catch (e) {
      return newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url))
    }
  }
}
