import { NextResponse } from "next/server"

// Interfaz para el pedido
interface Producto {
  nombre: string
  cantidad: number
  precio: number
}

interface Pedido {
  nombre: string
  telefono: string
  direccion?: string
  productos: Producto[]
  total: number
  comentarios?: string
  fecha: string
}

export async function POST(request: Request) {
  try {
    const pedido: Pedido = await request.json()

    // Verificar que tenemos las variables de entorno necesarias
    const notionToken = process.env.NOTION_API_KEY
    const notionDatabaseId = process.env.NOTION_DATABASE_ID

    if (!notionToken || !notionDatabaseId) {
      return NextResponse.json({ error: "Faltan configuraciones de Notion" }, { status: 500 })
    }

    // Crear el registro en Notion
    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: notionDatabaseId },
        properties: {
          // Ajusta estas propiedades según la estructura de tu base de datos en Notion
          Nombre: {
            title: [
              {
                text: {
                  content: pedido.nombre,
                },
              },
            ],
          },
          Teléfono: {
            rich_text: [
              {
                text: {
                  content: pedido.telefono,
                },
              },
            ],
          },
          Dirección: {
            rich_text: [
              {
                text: {
                  content: pedido.direccion || "No especificada",
                },
              },
            ],
          },
          Total: {
            number: pedido.total,
          },
          Fecha: {
            date: {
              start: pedido.fecha,
            },
          },
          Estado: {
            select: {
              name: "Nuevo",
            },
          },
        },
        // Contenido del pedido como contenido de la página
        children: [
          {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ type: "text", text: { content: "Detalles del Pedido" } }],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: "Productos:" } }],
            },
          },
          ...pedido.productos.map((producto) => ({
            object: "block",
            type: "bulleted_list_item",
            bulleted_list_item: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: `${producto.nombre} x ${producto.cantidad} = $${producto.precio * producto.cantidad}`,
                  },
                },
              ],
            },
          })),
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: `Total: $${pedido.total}` } }],
            },
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: pedido.comentarios ? `Comentarios: ${pedido.comentarios}` : "Sin comentarios adicionales",
                  },
                },
              ],
            },
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Error al crear el pedido en Notion:", data)
      return NextResponse.json({ error: "Error al guardar en Notion", details: data }, { status: response.status })
    }

    return NextResponse.json({ success: true, notionPageId: data.id })
  } catch (error) {
    console.error("Error al procesar el pedido:", error)
    return NextResponse.json({ error: "Error al procesar el pedido" }, { status: 500 })
  }
}
