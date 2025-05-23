"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// Tipos para nuestros productos
interface Producto {
  id: number
  nombre: string
  precio: number
  imagen: string
  descripcion: string
  cantidad: number
}

export default function Home() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Lista de productos de pastelería chilena
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Torta Merengue Chocolate",
      precio: 40000,
      imagen: "/images/TortaMerengueChocolate.jpg?height=300&width=400",
      descripcion: "Tradicional torta con frambuesas frescas y chocolate",
      cantidad: 0,
    },
    {
      id: 2,
      nombre: "Pie de limón",
      precio: 5000,
      imagen: "/images/pieDeLimon.jpg?height=300&width=400",
      descripcion: "Deliciosos Pie de limon casero con merengue",
      cantidad: 0,
    },
    {
      id: 3,
      nombre: "Kuchen frutos rojos",
      precio: 15000,
      imagen: "/images/kuchenFrutosRojos.jpg?height=300&width=400",
      descripcion: "Rico kuchen de frutos rojos",
      cantidad: 0,
    },
    {
      id: 4,
      nombre: "Kuchen choco frambuesa",
      precio: 15000,
      imagen: "/images/kuchenChocoFrambuesa.jpg?height=300&width=400",
      descripcion: "Rico kuchen de chocolate y frambuesa",
      cantidad: 0,
    },
    {
      id: 5,
      nombre: "muffin de chocolate",
      precio: 4500,
      imagen: "/images/muffin.jpg?height=300&width=400",
      descripcion: "Deliciosos muffin de chocolate",
      cantidad: 0,
    },
     {
      id: 6,
      nombre: "Rollito de canela",
      precio: 4500,
      imagen: "/images/rollitosCanela.jpg?height=300&width=400",
      descripcion: "Esponjoso rollito de canela",
      cantidad: 0,
    },
     {
      id: 7,
      nombre: "bandejaEmpanada",
      precio: 4500,
      imagen: "/images/bandejaEmpanadas.jpg?height=300&width=400",
      descripcion: "Bandeja de empanadas de pino veganas",
      cantidad: 0,
    },
    //  {
    //   id: 5,
    //   nombre: "Berlín",
    //   precio: 4500,
    //   imagen: "/placeholder.svg?height=300&width=400",
    //   descripcion: "Esponjoso berlín relleno de crema pastelera",
    //   cantidad: 0,
    // },
  ])

  // Estado para el carrusel
  const [currentIndex, setCurrentIndex] = useState(0)

  // Estado para el formulario
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [comentarios, setComentarios] = useState("")

  // Funciones para el carrusel
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === productos.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? productos.length - 1 : prevIndex - 1))
  }

  // Función para actualizar la cantidad de un producto
  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 0) return

    setProductos(
      productos.map((producto) => (producto.id === id ? { ...producto, cantidad: nuevaCantidad } : producto)),
    )
  }

  // Función para calcular el total del pedido
  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
  }

  const nombre = ref('')
  const telefono = ref('')
  const direccion = ref('')
  const comentarios = ref('')
  const productos = ref([
    {
      id: 1,
      nombre: "Torta Merengue Chocolate",
      precio: 40000,
      imagen: "/images/TortaMerengueChocolate.jpg?height=300&width=400",
      descripcion: "Tradicional torta con frambuesas frescas y chocolate",
      cantidad: 0,
    },
])


  const generarMensajeWhatsApp = () => {
  const productosSeleccionados = productos.filter((p) => p.cantidad > 0)

  let mensaje = `*Nuevo Pedido de Lupi Masas*%0A%0A`
  mensaje += `*Nombre:* ${nombre}%0A`
  mensaje += `*Teléfono:* ${telefono}%0A`
  if (direccion) mensaje += `*Dirección:* ${direccion}%0A`

  mensaje += `%0A*Productos:*%0A`
  productosSeleccionados.forEach((p) => {
    mensaje += `- ${p.nombre} x ${p.cantidad} = $${p.precio * p.cantidad}%0A`
  })

  mensaje += `%0A*Total:* $${calcularTotal()}%0A`
  if (comentarios) mensaje += `%0A*Comentarios:* ${comentarios}%0A`

  return mensaje
}


const validarFormulario = (): boolean => {
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  const soloNumeros = /^\d{9}$/ // 9 dígitos exactos

  if (!nombre.trim() || !soloLetras.test(nombre.trim()) || nombre.trim().length < 3) {
    alert("Por favor, ingresa un nombre válido (solo letras, mínimo 3 caracteres).")
    return false
  }

  if (!telefono.trim() || !soloNumeros.test(telefono.trim())) {
    alert("Por favor, ingresa un número de teléfono válido (9 dígitos, sin +56).")
    return false
  }

  if (direccion && direccion.trim().length < 5) {
    alert("La dirección debe tener al menos 5 caracteres.")
    return false
  }

  if (comentarios && comentarios.length > 200) {
    alert("Los comentarios no pueden exceder los 200 caracteres.")
    return false
  }

  const hayProductos = productos.some((p) => p.cantidad > 0)
  if (!hayProductos) {
    alert("Debes seleccionar al menos un producto.")
    return false
  }

  return true
}

  // Función para enviar el pedido a Notion
  // const enviarPedidoNotion = async () => {
  //   const productosSeleccionados = productos.filter((p) => p.cantidad > 0)

  //   try {
  //     const response = await fetch("/api/notion", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         nombre,
  //         telefono,
  //         direccion,
  //         productos: productosSeleccionados.map((p) => ({
  //           nombre: p.nombre,
  //           cantidad: p.cantidad,
  //           precio: p.precio,
  //         })),
  //         total: calcularTotal(),
  //         comentarios,
  //         fecha: new Date().toISOString(),
  //       }),
  //     })

  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data.error || "Error al guardar en Notion")
  //     }

  //     return data
  //   } catch (error) {
  //     console.error("Error al enviar a Notion:", error)
  //     throw error
  //   }
  // }

  // Función para enviar el pedido por WhatsApp y a Notion
  const enviarPedido = async () => {

    // Validar el formulario
    if (!validarFormulario()) return

    const mensaje = generarMensajeWhatsApp();
    
    const telefonoDestino = "56971406550"
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefonoDestino}&text=${encodeURIComponent(mensaje)}`
    window.open(urlWhatsApp, "_blank")
    // try{
    //   const productosSeleccionados = productos.filter((p) => p.cantidad > 0)
    //   const pedido = {
    //     nombre,
    //     telefono,
    //     direccion,
    //     productos: productosSeleccionados.map((p) => ({
    //       nombre: p.nombre,
    //       cantidad: p.cantidad,
    //       precio: p.precio,
    //     })),
    //     total: calcularTotal(),
    //     comentarios,
    //   }


    // }catch(error){
      
    // }
   
    setIsSubmitting(true)

   
  }

 

  return (
    <main className="min-h-screen bg-[#f8cce8]/30">
      {/* Header */}
      <header className="bg-[#f8cce8] text-black py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center">
            <div className="relative h-24 w-24 mr-4">
              <Image src="/images/logotra.png" alt="Lupi Masas Logo" fill className="object-contain" />
            </div>
          <div className="flex items-center mb-4 md:mb-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Lupi Masas</h1>
              <p className="text-sm md:text-base">Especialistas en Pasteleria Vegana</p>
            </div>
          </div>
        </div>
      </header>

      {/* Carrusel de Productos */}
      <section className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-[#b4914f] text-center mb-8">Nuestros Productos</h2>

        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <div className="relative aspect-[4/3] md:aspect-[16/9]">
              <Image
                src={productos[currentIndex].imagen || "/placeholder.svg"}
                alt={productos[currentIndex].nombre}
                fill
                className="object-cover"
              />
            </div>

            <Card className="border-t-0 rounded-t-none border-[#d9c7f2] border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#b4914f]">{productos[currentIndex].nombre}</h3>
                    <p className="text-gray-600">{productos[currentIndex].descripcion}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xl font-bold text-[#b4914f]">${productos[currentIndex].precio}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          actualizarCantidad(productos[currentIndex].id, productos[currentIndex].cantidad - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="mx-3 w-8 text-center">{productos[currentIndex].cantidad}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          actualizarCantidad(productos[currentIndex].id, productos[currentIndex].cantidad + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/3 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/3 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Indicadores del carrusel */}
        <div className="flex justify-center mt-4 gap-2">
          {productos.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full ${index === currentIndex ? "bg-[#b4914f]" : "bg-[#d9c7f2]"}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Leyenda de la Pastelería */}
      <section className="py-10 px-4 bg-[#bce1f0]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-[#b4914f]">Nuestra Historia</h2>
          <p className="text-lg italic text-[#b4914f]">
            "Hecho con amor y recetas de la abuelita desde 1975. Cada dulce lleva el sabor de la tradición chilena y la
            pasión por la repostería artesanal que ha pasado de generación en generación."
          </p>
        </div>
      </section>

      {/* Formulario de Pedido */}
      <section className="py-10 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-[#b4914f]">Realiza tu Pedido</h2>

        <div className="bg-white rounded-lg shadow-lg p-6 border-[#d9c7f2]">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Tu número de teléfono"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="direccion">Dirección (opcional)</Label>
              <Input
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Tu dirección de entrega"
              />
            </div>

            <div>
              <Label>Productos Seleccionados</Label>
              <div className="mt-2 space-y-2">
                {productos
                  .filter((p) => p.cantidad > 0)
                  .map((producto) => (
                    <div key={producto.id} className="flex justify-between items-center border-b pb-2">
                      <span>
                        {producto.nombre} x {producto.cantidad}
                      </span>
                      <span className="font-medium">${producto.precio * producto.cantidad}</span>
                    </div>
                  ))}

                {productos.filter((p) => p.cantidad > 0).length === 0 && (
                  <p className="text-gray-500 italic">No has seleccionado productos</p>
                )}

                <div className="flex justify-between items-center pt-2 font-bold">
                  <span>Total</span>
                  <span>${calcularTotal()}</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="comentarios">Comentarios (opcional)</Label>
              <Textarea
                id="comentarios"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Instrucciones especiales para tu pedido"
                className="resize-none"
                rows={3}
              />
            </div>
            <Button disabled={isSubmitting} onClick={enviarPedido}>
              {isSubmitting ? "Enviando..." : "Enviar pedido"} <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8cce8] text-black py-6 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="relative h-12 w-12 mr-2">
            <Image src="/images/logo.png" alt="Lupi Masas Logo" fill className="object-contain" />
          </div>
          <h3 className="text-xl font-bold">Lupi Masas</h3>
        </div>
        <p>© 2024 Lupi Masas - Todos los derechos reservados</p>
        <p className="mt-2 text-black">Horario: Lunes a Sábado de 9:00 a 19:00 hrs</p>
      </footer>
    </main>
  )
}
