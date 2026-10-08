/* =====================================================================
   PROYECTA + — PRODUCTOS
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que tenés que tocar para cambiar productos,
   precios, links de compra, fotos y videos de la página Productos.

   Campos de cada producto:
   - nombre, texto: lo que se lee en la tarjeta.
   - lista: (opcional) viñetas. Con listaPlegable: "Ver las 31 planillas"
            la lista queda escondida detrás de ese botón.
   - bonos: (opcional) líneas con regalito (ej. descuentos exclusivos).
   - botonTexto: (opcional) texto del botón de compra.
   - precio: número en pesos (ej. 24900). null = no muestra número.
   - antes: (opcional) precio tachado, ej. 34900.
   - precioTexto: (opcional) texto en lugar del precio, ej. "Consultá".
   - nota: línea chica debajo del precio, ej. "Pago único".
   - estado: "nuevo" | "pronto" | "desarrollo" | "gratis" | "" (etiqueta).
   - etiqueta: (opcional) texto propio para la etiqueta.
   - destacado: true = tarjeta amarilla.
   - portada: número o sigla grande cuando no hay foto ni video (ej. "+45").
   - portadaTexto: texto chico al lado de la portada (ej. "planillas").

   FOTO O VIDEO (opcional):
   - media: { tipo: "imagen", src: "assets/productos/suite.jpg" }
   - media: { tipo: "video",  src: "assets/productos/suite.mp4", poster: "assets/productos/suite.jpg" }
     Subí el archivo a la carpeta assets/productos/ y poné la ruta.
     Videos: cortos (10–20 s), sin sonido, MP4, menos de 5 MB.

   BOTONES:
   - comprar: link de pago (ej. link de Mercado Pago). Si está, aparece
              el botón "Comprar". Si está vacío, "Comprar" abre WhatsApp
              con el pedido ya escrito (podés cobrar por transferencia).
   - ver:     link "Ver más" (página del producto o tienda). Opcional.
   - accion:  "avisame" (lista de espera) o "prueba" (prueba del software)
              en lugar de comprar.

   Guardás, hacés commit en GitHub y Vercel actualiza la web solo.
   ===================================================================== */

window.PRODUCTOS = {
  moneda: "$",
  whatsapp: "5493425104877",
  email: "hola@proyectamas.com.ar",

  /* Prueba del software: cuando tengas la página de registro de la
     prueba de 1 hora, pegá acá el link y el formulario manda ahí.
     Mientras esté vacío, el pedido llega por WhatsApp. */
  pruebaUrl: "",

  pagos: "Pagás con Mercado Pago o transferencia. Recibís los archivos por mail.",

  categorias: [
    {
      id: "formacion",
      nombre: "Formación",
      intro: "Aprendé el método completo, con cálculos explicados y casos resueltos.",
      productos: [
        {
          nombre: "Kit completo · Proyecto de Instalaciones",
          texto: "Manual de 81 páginas con 7 proyectos, planilla MEP, caso con planos DXF, bloques CAD, plantillas y calculadoras.",
          precio: 24900, antes: 34900, nota: "Lanzamiento · pago único",
          estado: "nuevo", destacado: true,
          portada: "P07", portadaTexto: "Manual + 11 bonos",
          media: null,
          comprar: "", ver: ""
        },
        {
          nombre: "Manual de Proyecto de Instalaciones",
          texto: "Eléctrica, sanitaria y gas, de la vivienda al edificio. Incluye calculadoras web y ficha técnica.",
          precio: 14900, antes: 17900, nota: "Lanzamiento · pago único",
          estado: "nuevo",
          portada: "81", portadaTexto: "páginas · PDF",
          media: null,
          comprar: "", ver: ""
        },
        {
          nombre: "Cursos grabados",
          texto: "Clases cortas sobre un tema puntual: cálculo de cañerías de gas, caída de tensión, cómputo eléctrico.",
          precio: 20000, precioDesde: true, nota: "Precio estimado",
          estado: "pronto",
          portada: "▶", portadaTexto: "videos cortos",
          media: null,
          accion: "avisame"
        }
      ]
    },
    {
      id: "planillas",
      nombre: "Planillas de cómputo y presupuesto",
      corto: "Planillas",
      intro: "Método clásico de cómputo y presupuesto, con APU, certificación por avance y dashboard. Materiales y mano de obra separados.",
      nota: "Todas incluyen manuales útiles, planillas de rendimientos y proporciones, checklists y tablas técnicas.",
      productos: [
        {
          nombre: "Suite Proyecta Más · 31 planillas PRO",
          texto: "Todos los rubros de la obra en un solo sistema, con la planilla maestra para consolidar el presupuesto.",
          lista: ["Electricidad", "Sanitarias", "Gas", "Climatización", "Detección de Incendio", "Extinción de Incendio",
                  "Movimiento de Suelo", "Hormigón Armado", "Albañilería", "Trabajos preliminares", "Morteros y Hormigones",
                  "Estruct. Hierro y Madera", "Antisísmica y Entrepisos", "Cielorrasos", "Solados", "Pintura", "Carpintería",
                  "Herrería", "Vidrios", "Cubiertas", "Steel Frame", "Paneles SIP", "Wood Frame", "Domótica", "Revestimientos",
                  "CCTV y Alarmas", "Energía Solar", "Demolición", "Ascensores", "Paisajismo y Piletas", "Topografía"],
          listaPlegable: "Ver las 31 planillas",
          bonos: ["75 % OFF vs. compra individual", "Garantía de 7 días · compra protegida"],
          precio: 239242, antes: 956968, nota: "Pago único · hasta 3 cuotas sin interés con Mercado Pago",
          estado: "nuevo", etiqueta: "La más completa", destacado: true,
          portada: "31", portadaTexto: "planillas PRO",
          media: null,
          botonTexto: "Llevar la suite completa",
          comprar: "", ver: ""
        },
        {
          nombre: "Pack Instalaciones",
          lista: ["Electricidad PRO", "Sanitarias PRO", "Gas PRO", "Climatización PRO", "Extinción de Incendio PRO",
                  "Domótica PRO", "Detección de Incendio PRO", "CCTV y Alarmas PRO", "Energía Solar PRO"],
          bonos: ["Descuentos exclusivos en los servicios de Proyecta Más"],
          precio: 166495, antes: 332991, nota: "Pago único",
          estado: "nuevo", etiqueta: "★ Más vendido",
          portada: "9", portadaTexto: "planillas",
          media: null,
          botonTexto: "Comprar Pack Instalaciones",
          comprar: "", ver: ""
        },
        {
          nombre: "Pack Obra Gruesa y Estructuras",
          lista: ["Movimiento de Suelos", "Hormigón Armado", "Albañilería", "Demolición", "Morteros y Hormigones",
                  "Estructuras de Hierro y Madera", "Antisísmica y Entrepisos", "Trabajos preliminares"],
          bonos: ["Descuentos exclusivos en los servicios de Proyecta Más"],
          precio: 79996, antes: 159992, nota: "Pago único",
          portada: "8", portadaTexto: "planillas",
          media: null,
          botonTexto: "Comprar Pack Obra Gruesa",
          comprar: "", ver: ""
        },
        {
          nombre: "Pack Terminaciones",
          lista: ["Cielorrasos", "Solados", "Revestimientos", "Pintura", "Carpintería", "Herrería", "Vidrios", "Cubiertas"],
          bonos: ["Descuentos exclusivos en los servicios de Proyecta Más"],
          precio: 111996, antes: 223992, nota: "Pago único",
          portada: "8", portadaTexto: "planillas",
          media: null,
          botonTexto: "Comprar Pack Terminaciones",
          comprar: "", ver: ""
        },
        {
          nombre: "Pack Construcción en Seco",
          lista: ["Steel Frame", "Paneles SIP", "Wood Frame"],
          bonos: ["Descuentos exclusivos en los servicios de Proyecta Más"],
          precio: 59998, antes: 119997, nota: "Pago único",
          portada: "3", portadaTexto: "planillas",
          media: null,
          botonTexto: "Comprar Pack Construcción en Seco",
          comprar: "", ver: ""
        },
        {
          nombre: "Pack Obras Especiales",
          lista: ["Ascensores", "Paisajismo y Piletas", "Pavimentos y veredas de H°", "Topografía"],
          bonos: ["Descuentos exclusivos en los servicios de Proyecta Más"],
          precio: 59998, antes: 119996, nota: "Pago único",
          portada: "5", portadaTexto: "planillas",
          media: null,
          botonTexto: "Comprar Pack Obras Especiales",
          comprar: "", ver: ""
        },
        {
          nombre: "Planillas sueltas",
          texto: "Comprá sólo el rubro que necesitás: albañilería, eléctrica, steel frame, SIP, climatización y más.",
          precio: 19900, precioDesde: true, nota: "Por planilla",
          portada: "1", portadaTexto: "rubro",
          media: null,
          comprar: "", ver: ""
        },
        {
          nombre: "Planilla demo",
          texto: "Probá cómo funciona el sistema con una versión recortada de Movimiento de Suelos.",
          precio: 0, nota: "Descarga gratuita",
          estado: "gratis",
          portada: "0", portadaTexto: "pesos",
          media: null,
          comprar: "", ver: "", gratisTexto: "Pedir la demo"
        }
      ]
    },
    {
      id: "cad",
      nombre: "Recursos CAD",
      intro: "Bloques y plantillas listas para insertar, con el estándar de capas de Proyecta +.",
      productos: [
        {
          nombre: "Biblioteca de instalaciones",
          texto: "Símbolos eléctricos, sanitarios y de gas, plantilla de capas, láminas A3 con rótulo y unifilar tipo.",
          precio: null, precioTexto: "En el Kit", nota: "Proyecto de Instalaciones",
          estado: "nuevo", etiqueta: "Incluido en el Kit",
          portada: "29", portadaTexto: "bloques DXF",
          media: null,
          comprar: "", ver: "", verKit: true
        },
        {
          nombre: "Pack de bloques eléctricos",
          texto: "Biblioteca ampliada de simbología eléctrica según AEA 90364, con atributos para cómputo.",
          precio: null, precioTexto: "Pronto", nota: "Lista de espera",
          estado: "pronto",
          portada: "AEA", portadaTexto: "bloques eléctricos",
          media: null,
          accion: "avisame"
        }
      ]
    },
    {
      id: "software",
      nombre: "Software",
      intro: "Herramientas web que estamos desarrollando para la gestión y el presupuesto de obra.",
      productos: [
        {
          nombre: "Seguimiento de obra",
          texto: "Pagos, pendientes, gastos, avance y alertas de cada obra en un solo tablero, desde la compu o el celular.",
          precio: null, precioTexto: "Probalo", nota: "1 hora gratis",
          estado: "desarrollo", etiqueta: "En desarrollo · versión de prueba", destacado: true,
          portada: "1 h", portadaTexto: "prueba gratis",
          media: null,
          accion: "prueba"
        },
        {
          nombre: "Cotizador de instalaciones",
          texto: "Presupuestos por boca con catálogo de materiales y mano de obra editable. Planes gratis, Premium y Pro.",
          precio: null, precioTexto: "Pronto", nota: "Lista de espera",
          estado: "desarrollo", etiqueta: "En desarrollo",
          portada: "$", portadaTexto: "cotizador",
          media: null,
          accion: "avisame"
        }
      ]
    }
  ]
};
