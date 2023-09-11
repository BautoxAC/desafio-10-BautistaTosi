/* const URLactual = window.location.href
const port = window.location.port
const queries = URLactual.split('?')
// eslint-disable-next-line no-undef
const socket = io()
const email = document.getElementById('email')
fetch(`http://localhost:${port}/api/products?${queries[1]}`)
  .then(res => res.json())
  .then(data => {
    for (const product of data.payload) {
      document.getElementById('agregateOne' + product._id).addEventListener('click', () => {
        socket.emit('add_product_to_cart_front_to_back', { idProduct: product._id, email: email.innerHTML })
      })
    }
    for (const product of data.payload) {
      document.getElementById('linkDetail' + product._id).addEventListener('click', (e) => {
        e.stopPropagation()
      })
    }
  })
  .catch(error => console.log(error))
socket.on('add_product_to_cart_back_to_front', (data) => {
  if (data.status !== 'failure') {
    alert('producto agregado correctamente')
  } else {
    alert('ha ocurrido un error')
  }
}) */
/* const buttonSubmit = document.getElementById('button')
const href = window.location.href
buttonSubmit.addEventListener('click', async (e) => {
  e.preventDefault()
  await fetch(href, { method: 'PUT' })
    .then((response) => {
      if (!response.ok) {
        alert('ha ocurrido un error, el rol no se ha cmabiado')
        throw new Error('ha ocurrido un error inesperado')
      }
      return response.json()
    })
    .then(data => {
      alert(data)
    })
    .catch(error => console.log(error))
})
 */
const href = window.location.href
const origin = window.location.origin
fetch(`${origin}/auth/perfil`, { method: 'GET' })
  .then((response) => {
    if (!response.ok) {
      alert('ha ocurrido un error, el usuario no se ha encontrado')
      throw new Error('ha ocurrido un error inesperado')
    }
    return response.json()
  })
  .then(data => {
    getProducts(data.perfil)
  })
  .catch(error => console.log(error))
function getProducts (user) {
  fetch(`${origin}/api/products`, { method: 'GET' })
    .then((response) => {
      if (!response.ok) {
        alert('ha ocurrido un error, el product no se ha eliminado')
        throw new Error('ha ocurrido un error inesperado')
      }
      return response.json()
    })
    .then(data => {
      deleteProductsAndAgregatrToCart(data.payload, user)
      return data
    })
    .catch(error => console.log(error))
}

function deleteProductsAndAgregatrToCart (products, user) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const botonEliminar = document.getElementById(`buttonEliminate${product._id}`)
    botonEliminar.addEventListener('click', async (e) => {
      e.preventDefault()
      await fetch(`${origin}/api/products/${product._id}`, { method: 'DELETE' })
        .then((response) => {
          if (!response.ok) {
            alert('ha ocurrido un error, el producto no se ha eliminado')
            throw new Error('ha ocurrido un error inesperado')
          }
          return response.json()
        })
        .then(data => {
          alert('producto eliminado correctamente')
        })
        .catch(error => console.log(error))
    })

    document.getElementById('agregateOne' + product._id).addEventListener('click', async (e) => {
      e.preventDefault()
      await fetch(`${origin}/api/carts/${user.cart}/products/${product._id}`, { method: 'POST' })
        .then((response) => {
          if (!response.ok) {
            alert('ha ocurrido un error, el producto no se ha agregado')
            throw new Error('ha ocurrido un error inesperado')
          }
          return response.json()
        })
        .then(data => {
          alert('producto agregado al carrito correctamente')
        })
        .catch(error => console.log(error))
    })
  }
}
