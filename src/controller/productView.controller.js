import { ProductManagerDBService } from '../services/products.service.js'
import { UserManagerDBService } from '../services/user.service.js'
import config from './../config/env.config.js'
const UserManager = new UserManagerDBService()
const { port } = config
const list = new ProductManagerDBService()
export class ProductViewController {
  async renderAllProducts (req, res) {
    const url = `http://localhost:${port}/products`
    const { limit, page, query, sort } = req.query
    const { email, role, cart } = req.session.user
    const userId = await UserManager.getUserByUserName(email)
    const pageInfo = await list.getProducts(limit, page, query, sort, url)
    return res.status(200).render('products', {
      ...pageInfo,
      email,
      urlCart: `http://localhost:${port}/carts/${cart}`,
      role,
      userId: userId?.data?._id
    })
  }

  async renderDetails (req, res) {
    const productId = req.params.pid
    const detailsProduct = await list.getProductById(productId)
    return res.status(200).render('details', { detailsProduct: detailsProduct.data })
  }
}
