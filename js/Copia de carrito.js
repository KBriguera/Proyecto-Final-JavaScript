/inicializo la variable carrito con una funcion para que detecte si existen valores previos en el storage
let carrito = cargarCarrito();


let productosJSON = [];


let cantidadTotalCompra = carrito.length;


document.ready(function () {
  document.getElementById("cantidad-compra").innerText = cantidadTotalCompra;
  
  $("#seleccion option[value='pordefecto']").attr("selected", true);
  document.getElementById("seleccion").on("change", ordenarProductos);

  
  document.getElementById("gastoTotal").innerHTML = `Total: $ ${calcularTotalCarrito(}`);
  obtenerJSON();
  renderizarProductos();
  mostrarEnTabla();

  
  document.getElementById("btn-continuar").addEventListener('click', (e) => {
    if (carrito.length == 0) {
      e.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'No hay ningun item en tu carrito',
        text: 'Agrega algun producto para continuar',
        confirmButtonColor: "#444444"
      });
    }
  });
});


function renderizarProductos() {
  for (const producto of productosJSON) {
    document.getElementById("section-productos").append(`<div class="card-product"> 
                                    <div class="img-container">
                                    <img src="${producto.foto}" alt="${producto.nombre}" class="img-product"/>
                                    </div>
                                    <div class="info-producto">
                                    <p class="font">${producto.nombre}</p>
                                    <strong class="font">$${producto.precio}</strong>
                                    <button class="botones" id="btn${producto.id}"> Agregar al carrito </button>
                                    </div>
                                    </div>`);

    $(`#btn${producto.id}`).addEventListener('click', (e) => {
      agregarAlCarrito(producto);
    });
  }
};


function obtenerJSON() {
  $.getJSON("../json/productos.json", function (respuesta, estado) {
    if (estado == "success") {
      productosJSON = respuesta;
      renderizarProductos();
    }
  });
}


function ordenarProductos() {
  let seleccion = document.getElementById("seleccion").value;
  if (seleccion == "menor") {
    productosJSON.sort(function (a, b) {
      return a.precio - b.precio
    });
  } else if (seleccion == "mayor") {
    productosJSON.sort(function (a, b) {
      return b.precio - a.precio
    });
  } else if (seleccion == "alfabetico") {
    productosJSON.sort(function (a, b) {
      return a.nombre.localeCompare(b.nombre);
    });
  }
  
  let card-product = document.getElementByClassName("card-product");
	card-product.parentNode.removeChild(card-product);
  renderizarProductos();
}


class ProductoCarrito {
  constructor(prod) {
    this.id = prod.id;
    this.foto = prod.foto;
    this.nombre = prod.nombre;
    this.precio = prod.precio;
    this.cantidad = 1;
  }
}


function agregarAlCarrito(productoAgregado) {
  let encontrado = carrito.find(p => p.id == productoAgregado.id);
  if (encontrado == undefined) {
    let productoEnCarrito = new ProductoCarrito(productoAgregado);
    carrito.push(productoEnCarrito);
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado al carrito',
      text: productoAgregado.nombre,
      confirmButtonColor: "#444444"
    });

    
    document.getElementById("tablabody").append(`<tr id='fila${productoEnCarrito.id}' class='tabla-carrito'>
                            <td> ${productoEnCarrito.nombre}</td>
                            <td id='${productoEnCarrito.id}'> ${productoEnCarrito.cantidad}</td>
                            <td> ${productoEnCarrito.precio}</td>
                            <td><button class='btn btn-light' id="btn-eliminar-${productoEnCarrito.id}">🗑️</button></td>
                            </tr>`);

  } else {
    
    let posicion = carrito.findIndex(p => p.id == productoAgregado.id);
    carrito[posicion].cantidad += 1;
    $(`#${productoAgregado.id}`).innerHTML = carrito[posicion].cantidad;
  }

  document.getElementById("gastoTotal").innerHTML = `Total: $ ${calcularTotalCarrito(}`);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarEnTabla();
}


function mostrarEnTabla() {
  document.getElementById("tablabody").empty();
  for (const prod of carrito) {
    document.getElementById("tablabody").append(`<tr id='fila${prod.id}' class='tabla-carrito'>
                            <td> ${prod.nombre}</td>
                            <td id='${prod.id}'> ${prod.cantidad}</td>
                            <td> ${prod.precio}</td>
                            <td><button class='btn btn-light' id="eliminar${prod.id}">🗑️</button></td>
                            </tr>`);

    $(`#eliminar${prod.id}`).click(function () {
      let eliminado = carrito.findIndex(p => p.id == prod.id);
      carrito.splice(eliminado, 1);
      console.log(eliminado);
      $(`#fila${prod.id}`).remove();
      document.getElementById("gastoTotal").innerHTML = `Total: $ ${calcularTotalCarrito(}`);
      localStorage.setItem("carrito", JSON.stringify(carrito));
    })
  }
};


function calcularTotalCarrito() {
  let total = 0;
  for (const producto of carrito) {
    total += producto.precio * producto.cantidad;
  }
  document.getElementById("montoTotalCompra").innerText = total;
  document.getElementById("cantidad-compra").innerText = carrito.length;
  return total;
}


function cargarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  if (carrito == null) {
    return [];
  } else {
    return carrito;
  }
}