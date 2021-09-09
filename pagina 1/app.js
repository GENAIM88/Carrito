const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
let carrito = {}
    //variables o constantes nuevas
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

cards.addEventListener('click', e => {
    //console.log(e)
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const btnAccion = e => {
    if (e.target.classList.contains('btn-success')) {
        const producto = carrito[e.target.dataset.id]
            //console.log(producto)
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        carrito[e.target.dataset.id] = {...producto }
        pintarCarrito()
    }
}

const pintarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelectorAll('td')[2].textContent = producto.precio
        templateCarrito.querySelector('.btn-success').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
}

const pintarFooter = () => {
    footer.innerHTML = ''
    console.log(carrito)
    if (Object.keys(carrito).lenght === 0) {
        footer.innerHTML = `<th class="text-center" scope="row" colspan="6">Carrito Vacio ° Compra YA!!!</th>`
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const addCarrito = param => {
    //console.log(param.target)
    if (param.target.classList.contains('btn-dark')) {
        //console.log(param.target.parentElement)
        setCarrito(param.target.parentElement)
    }
    param.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
            id: objeto.querySelector('.btn-dark').dataset.id,
            title: objeto.querySelector('h5').textContent,
            precio: objeto.querySelector('p').textContent,
            cantidad: 1
        }
        //console.log(producto)

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto }
    pintarCarrito()
    console.log(carrito)
}

const fetchData = async() => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        pintarCards(data)
            //console.log(data)

    } catch (error) {
        console.log(error)
    }
}

const pintarCards = data => {
    // console.log('Datos en Pintar Card', data)
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
    pintarFooter()
}