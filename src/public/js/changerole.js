const buttonSubmit = document.getElementById('button')
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
