/* =====================================================================
   PROYECTA + ESTUDIO — TARIFARIO
   ---------------------------------------------------------------------
   Este es el ÚNICO archivo que tenés que tocar para cambiar precios,
   plazos, revisiones o lo que incluye cada servicio.

   Cómo editar:
   - precio: un número (ej. 400). Se muestra como "USD 400".
             Poné null para que diga "A cotizar".
   - desde:  true  -> muestra "desde USD 400"
   - unidad: texto que va después del precio (ej. "/m²", "/imagen", "")
   - extra:  línea chica debajo del precio (ej. m² adicional)
   - plazo:  dejalo "" para no mostrarlo, o escribí uno (ej. "10 días hábiles")
   - imagen: (solo BIM/LOD) ruta de una imagen, ej. "assets/lod/lod-300.jpg"
   - Para agregar un producto, copiá un bloque { ... } completo,
     pegalo debajo y cambiá los datos. Ojo con las comas.

   Guardás, hacés commit en GitHub y Vercel actualiza la web solo.
   ===================================================================== */

window.PRECIOS = {
  moneda: "USD",
  whatsapp: "5493425104877",
  email: "hola@proyectamas.com.ar",

  aviso: "Precios de referencia. El valor final depende de la complejidad, la superficie y el alcance de cada proyecto, y queda fijado en el presupuesto escrito que te enviamos antes de empezar.",

  condiciones: [
    "Los precios publicados son de referencia (\"desde\"). El valor final depende de la complejidad, superficie y alcance de cada proyecto y se fija en un presupuesto escrito antes de empezar. Ese presupuesto es el único valor válido.",
    "Valores en dólares para una vivienda de hasta 100 m², salvo que se indique otra cosa.",
    "Los plazos de entrega se acuerdan en cada presupuesto, según el proyecto y la información disponible.",
    "Forma de pago: 50 % de anticipo para empezar y 50 % contra entrega.",
    "Urgencia (entrega prioritaria): +30 %.",
    "Revisión extra fuera de las incluidas: USD 20 cada una.",
    "Edificios, locales y obras de más de 2 plantas: cotización personalizada.",
    "Firma, visado y trámites ante municipio, EPE o Litoral Gas no están incluidos: quedan sujetos a la matrícula profesional correspondiente."
  ],

  categorias: [
    /* ------------------------------------------------------------- */
    {
      id: "instalaciones",
      nombre: "Proyecto eléctrico e instalaciones",
      corto: "Instalaciones",
      intro: "Documentación de instalaciones lista para que el instalador ejecute sin adivinar. Eléctrica según AEA 90364, más sanitaria y gas en el paquete integral.",
      productos: [
        {
          nombre: "Básico",
          precio: 200, desde: true, unidad: "",
          extra: "USD 1,5 por m² adicional",
          plazo: "", revisiones: 1,
          incluye: [
            "Planta de bocas, tomas, llaves e iluminación",
            "Recorrido de circuitos",
            "Ubicación de tablero principal y seccionales",
            "Referencias y simbología",
            "PDF + DWG"
          ]
        },
        {
          nombre: "Completo",
          destacado: true,
          precio: 400, desde: true, unidad: "",
          extra: "USD 3 por m² adicional",
          plazo: "", revisiones: 2,
          incluye: [
            "Todo lo del Básico",
            "Cuadro de cargas y grado de electrificación",
            "Cálculo de secciones y protecciones",
            "Esquema unifilar y puesta a tierra",
            "Memoria técnica y cómputo de materiales",
            "PDF + DWG"
          ]
        },
        {
          nombre: "Integral",
          precio: 840, desde: true, unidad: "",
          extra: "USD 6 por m² adicional",
          plazo: "", revisiones: 2,
          incluye: [
            "Eléctrico Completo",
            "Sanitaria: agua fría, caliente y cloacas",
            "Gas",
            "Cómputo de materiales de las tres instalaciones",
            "PDF + DWG"
          ]
        }
      ],
      adicionales: [
        "Instalación modelada en Revit: USD 1,5 por m²",
        "3D de instalaciones con axonometría de recorridos: USD 100"
      ],
      noIncluye: [
        "Relevamiento en sitio (se cotiza según distancia)",
        "Dirección o seguimiento de obra",
        "Cambios de arquitectura una vez iniciado el trabajo"
      ],
      aporta: "Planos de arquitectura (DWG o PDF), destino de cada local y equipos especiales (aire acondicionado, horno, bomba)."
    },

    /* ------------------------------------------------------------- */
    {
      id: "arquitectura",
      nombre: "Proyecto arquitectónico",
      corto: "Arquitectura",
      intro: "De la idea al proyecto documentado. Cada nivel suma al anterior, así elegís hasta dónde llegar.",
      productos: [
        {
          nombre: "Anteproyecto",
          precio: 400, desde: true, unidad: "",
          extra: "USD 4 por m² adicional",
          plazo: "", revisiones: 2,
          incluye: [
            "Programa de necesidades",
            "2 alternativas de distribución",
            "Planta, corte y fachada esquemáticos",
            "Verificación de FOS y FOT"
          ]
        },
        {
          nombre: "Proyecto",
          precio: 600, desde: true, unidad: "",
          extra: "USD 6 por m² adicional",
          plazo: "", revisiones: 2,
          incluye: [
            "Plantas, cortes y fachadas acotados",
            "Planilla de locales",
            "Memoria descriptiva",
            "PDF + DWG"
          ]
        },
        {
          nombre: "Proyecto + Documentación",
          destacado: true,
          precio: 1000, desde: true, unidad: "",
          extra: "USD 10 por m² adicional",
          plazo: "", revisiones: 2,
          incluye: [
            "Todo lo del Proyecto",
            "Detalles constructivos",
            "Planillas de carpinterías y terminaciones",
            "Láminas listas para obra"
          ]
        },
        {
          nombre: "Proyecto + BIM + Visualización",
          precio: 1300, desde: true, unidad: "",
          extra: "USD 13 por m² adicional",
          plazo: "", revisiones: 2,
          incluye: [
            "Proyecto + Documentación desarrollado en Revit (LOD 300)",
            "4 renders fotorrealistas",
            "Archivo .rvt + PDF"
          ]
        }
      ],
      adicionales: [
        "Alternativa de distribución extra: USD 100",
        "Proyecto + Instalación Integral: 10 % de descuento sobre la suma",
        "Proyecto + Cómputo y Presupuesto: 10 % de descuento sobre la suma"
      ],
      noIncluye: [
        "Planos municipales con firma y trámite de permiso",
        "Cálculo de estructura",
        "Instalaciones (se suman con el paquete de instalaciones)",
        "Dirección de obra"
      ],
      aporta: "Terreno o plano existente, programa (qué necesitás) y referencias de lo que te gusta."
    },

    /* ------------------------------------------------------------- */
    {
      id: "bim",
      nombre: "Modelado BIM en Revit",
      corto: "BIM Revit",
      intro: "Elegís el nivel de desarrollo (LOD) según para qué vas a usar el modelo. Se cobra por metro cuadrado modelado.",
      lod: true,
      productos: [
        {
          imagen: "assets/lod/lod-100.jpg",
          nombre: "LOD 100", sub: "Conceptual",
          precio: 1, desde: true, unidad: "/m²",
          extra: "Mínimo USD 100",
          plazo: "", revisiones: 1,
          incluye: ["Volumetría y masas", "Estudio de alternativas", "Vistas de presentación conceptual"]
        },
        {
          imagen: "assets/lod/lod-200.jpg",
          nombre: "LOD 200", sub: "Anteproyecto",
          precio: 2, desde: true, unidad: "/m²",
          extra: "Mínimo USD 150",
          plazo: "", revisiones: 1,
          incluye: ["Geometría y ubicación aproximadas", "Estudio de distribución", "Plantas y vistas esquemáticas"]
        },
        {
          imagen: "assets/lod/lod-300.jpg",
          nombre: "LOD 300", sub: "Proyecto",
          destacado: true,
          precio: 5, desde: true, unidad: "/m²",
          extra: "Mínimo USD 400",
          plazo: "", revisiones: 2,
          incluye: ["Modelo medible: dimensiones, forma y ubicación definidas", "Plantas, cortes y fachadas desde el modelo", "Tablas de cantidades", "Láminas + archivo .rvt"]
        },
        {
          imagen: "assets/lod/lod-350.jpg",
          nombre: "LOD 350", sub: "Coordinación",
          precio: null,
          extra: "Arquitectura + estructura + instalaciones",
          plazo: "", revisiones: 2,
          incluye: ["Interfaces entre disciplinas", "Detección de interferencias", "Informe y modelo corregido"]
        },
        {
          imagen: "assets/lod/lod-400.jpg",
          nombre: "LOD 400", sub: "Fabricación",
          precio: null,
          extra: "Modelo para fabricación o montaje",
          plazo: "", revisiones: 2,
          incluye: ["Información suficiente para fabricar o montar componentes"]
        },
        {
          imagen: "assets/lod/lod-500.jpg",
          nombre: "LOD 500", sub: "As-built",
          precio: null,
          extra: "Modelo verificado de lo construido",
          plazo: "", revisiones: 2,
          incluye: ["Geometría verificada en obra", "Requiere relevamiento"]
        }
      ],
      noIncluye: [
        "Relevamiento en sitio",
        "Familias a medida de fabricantes",
        "Renders (ver Visualización)"
      ],
      aporta: "Planos o croquis acotados. ¿No sabés qué LOD necesitás? Mandanos el proyecto y te recomendamos el nivel."
    },

    /* ------------------------------------------------------------- */
    {
      id: "visualizacion",
      nombre: "3D y visualización",
      corto: "Visualización",
      intro: "Imágenes para entender, vender o aprobar un proyecto antes de construirlo.",
      productos: [
        {
          nombre: "Render express IA",
          precio: 30, desde: true, unidad: "/imagen",
          extra: "A partir de una foto o modelo simple",
          plazo: "", revisiones: 1,
          incluye: ["1 imagen en alta resolución", "Ideal para redes e inmobiliarias"]
        },
        {
          nombre: "Modelado 3D",
          precio: 160, desde: true, unidad: "",
          extra: "Sin render",
          plazo: "", revisiones: 2,
          incluye: ["Modelo 3D completo", "2 vistas de trabajo"]
        },
        {
          nombre: "Modelado + 2 renders",
          precio: 260, desde: true, unidad: "",
          extra: "",
          plazo: "", revisiones: 2,
          incluye: ["Modelo 3D", "2 renders fotorrealistas"]
        },
        {
          nombre: "Modelado + 4 renders",
          destacado: true,
          precio: 360, desde: true, unidad: "",
          extra: "",
          plazo: "", revisiones: 2,
          incluye: ["Modelo 3D", "4 renders interior y exterior"]
        },
        {
          nombre: "Pack comercial",
          precio: 520, desde: true, unidad: "",
          extra: "Para vender un proyecto",
          plazo: "", revisiones: 2,
          incluye: ["Modelo 3D", "6 renders", "Axonometría", "Planta ambientada a color"]
        }
      ],
      adicionales: [
        "Render extra: USD 50",
        "Video recorrido: a cotizar"
      ],
      noIncluye: [
        "Diseño de interiores (materiales y equipamiento los define el cliente o se cotiza aparte)",
        "Cambios de proyecto después de modelado"
      ],
      aporta: "Planos, referencias de materiales y estilo."
    },

    /* ------------------------------------------------------------- */
    {
      id: "computos",
      nombre: "Cómputos y presupuestos",
      corto: "Cómputos",
      intro: "Cómputo métrico por rubro y presupuesto con mano de obra calculada con jornales UOCRA vigentes, cargas sociales y rendimientos por tarea.",
      productos: [
        {
          nombre: "Cómputo",
          precio: 200, desde: true, unidad: "",
          extra: "USD 1,5 por m² adicional",
          plazo: "", revisiones: 1,
          incluye: ["Cómputo métrico por rubro", "Listado de materiales", "Excel editable + PDF"]
        },
        {
          nombre: "Presupuesto",
          precio: 160, desde: true, unidad: "",
          extra: "Sobre cómputo que aportás vos",
          plazo: "", revisiones: 1,
          incluye: ["Materiales + mano de obra por rubro", "Precios a la fecha de entrega", "Excel editable + PDF"]
        },
        {
          nombre: "Cómputo + Presupuesto",
          destacado: true,
          precio: 320, desde: true, unidad: "",
          extra: "USD 2,5 por m² adicional",
          plazo: "", revisiones: 1,
          incluye: ["Cómputo y presupuesto completos", "Resumen por rubro e incidencias", "Costo por m²", "Excel editable + PDF"]
        }
      ],
      adicionales: [
        "Actualización de precios posterior: USD 40 cada una",
        "Análisis de precios unitarios detallado: +30 %"
      ],
      noIncluye: [
        "Actualizaciones durante la obra",
        "Certificaciones de avance",
        "Seguimiento de obra"
      ],
      aporta: "Planos completos y acotados y especificación de terminaciones. Si no la tenés, se asume calidad estándar y queda aclarado."
    },

    /* ------------------------------------------------------------- */
    {
      id: "inmobiliarias",
      nombre: "Servicios para inmobiliarias",
      corto: "Inmobiliarias",
      intro: "Piezas rápidas para publicar y vender mejor una propiedad.",
      productos: [
        {
          nombre: "Plano comercial",
          precio: 40, desde: true, unidad: "",
          extra: "Pack 5: USD 170 · Pack 10: USD 300",
          plazo: "", revisiones: 1,
          incluye: ["Planta 2D ambientada a color", "Medidas y m²", "Lista para publicar (hasta 100 m²)"]
        },
        {
          nombre: "Visualización de reforma",
          precio: 30, desde: true, unidad: "/imagen",
          extra: "Pack de 3: USD 75",
          plazo: "", revisiones: 1,
          incluye: ["Foto actual del ambiente", "Imagen de cómo quedaría reformado"]
        },
        {
          nombre: "Potencial de propiedad",
          destacado: true,
          precio: 150, desde: true, unidad: "",
          extra: "",
          plazo: "", revisiones: 1,
          incluye: ["Qué se puede construir o ampliar (FOS y FOT disponibles)", "Esquema volumétrico", "1 render"]
        },
        {
          nombre: "Visualización para venta",
          precio: 250, desde: true, unidad: "",
          extra: "Pozo o propiedades a reciclar",
          plazo: "", revisiones: 2,
          incluye: ["Planta comercial", "4 renders"]
        },
        {
          nombre: "Registro aéreo",
          precio: 100, desde: true, unidad: "",
          extra: "Con drone",
          plazo: "", revisiones: 1,
          incluye: ["Fotos aéreas", "Video corto editado"]
        }
      ],
      noIncluye: ["Tasación", "Gestión de la publicación"],
      aporta: "Plano o croquis con medidas, fotos y dirección de la propiedad."
    },

    /* ------------------------------------------------------------- */
    {
      id: "complementarios",
      nombre: "Complementarios",
      corto: "Complementarios",
      intro: "Maquetas hechas a mano y registro aéreo de obra por visita.",
      productos: [
        {
          nombre: "Maqueta simple",
          precio: 250, desde: true, unidad: "",
          extra: "Escala 1:100",
          plazo: "", revisiones: 0,
          incluye: ["Volumetría en balsa o cartón", "Sin detalles"]
        },
        {
          nombre: "Maqueta completa",
          destacado: true,
          precio: 450, desde: true, unidad: "",
          extra: "Escala 1:100",
          plazo: "", revisiones: 0,
          incluye: ["Terreno y base", "Aberturas y color", "Vegetación"]
        },
        {
          nombre: "Registro aéreo de obra",
          precio: 100, desde: true, unidad: "/visita",
          extra: "Por visita, no es seguimiento de obra",
          plazo: "", revisiones: 0,
          incluye: ["Fotos y video de avance con drone"]
        }
      ],
      adicionales: ["Piezas en impresión 3D: costo de impresión + 20 %"],
      noIncluye: [],
      aporta: "Planos del proyecto o de la obra y dirección."
    }
  ]
};
