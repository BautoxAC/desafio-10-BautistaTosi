import { UserManagerDBService } from '../services/user.service.js'
const UserManager = new UserManagerDBService()
export class UserController {
  async changerole (req, res) {
    const userId = req.params.uid
    req.session.user.role = await UserManager.changerole(req.session.user, userId)
    return res.status(200).json(`rol cambiado a ${req.session.user.role}`)
  }

  renderChangeRole (req, res) {
    return res.render('changeRole')
  }
}
