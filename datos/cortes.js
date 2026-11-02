/*
 * DATOS DEL SIMULADOR. Este es el único archivo que hay que editar para cambiar medidas.
 * Todas las medidas están en milímetros.
 *   min / max: rango aceptado como referencia.
 *   ref: valor usado para dibujar la pieza.
 * Las pulgadas de las fuentes se convirtieron a mm y se redondearon
 * (1/16 in = 1,6 · 1/8 in = 3,2 · 1/4 in = 6,4 · 1/2 in = 12,7 · 3/4 in = 19,1).
 */
window.FUENTES = {
  wikipedia: { nombre: "Wikipedia: List of culinary knife cuts", url: "https://en.wikipedia.org/wiki/List_of_culinary_knife_cuts" },
  skillsusa: { nombre: "SkillsUSA: 2024 Knife Cut Chart", url: "https://www.skillsusa.org/wp-content/uploads/2024/02/2024-Knife-Cut-Chart.pdf" },
  rouxbe: { nombre: "Rouxbe: Types of Knife Cuts", url: "https://rouxbe.com/tips-techniques/495-types-of-knife-cuts" },
  escoffier: { nombre: "Auguste Escoffier School: 10 Knife Cuts", url: "https://www.escoffier.edu/?p=23845" },
  wekiva: { nombre: "Wekiva Culinary (Chef C. Bates): Classic Knife Cuts", url: "https://www.wekivaculinary.org/basic-culinary-knife-cuts-and-how-to-make-them/" },
  webstaurant: { nombre: "WebstaurantStore: Types of Knife Cuts", url: "https://www.webstaurantstore.com/article/796/types-of-knife-cuts.html" },
  nz: { nombre: "Vegetables.co.nz: Veg Cuts (PDF)", url: "https://www.vegetables.co.nz/assets/Vegetables-co-nz/resources/VEG-CUTS.pdf" },
  elgourmet: { nombre: "elgourmet: Técnicas de cortes", url: "https://elgourmet.com/recetas/tecnicas-de-cortes/pdf" },
  gestiopolis: { nombre: "S. Guillén (Gestiopolis): Cortes básicos de cocina", url: "https://www.gestiopolis.com/cortes-basicos-cocina-restaurantes-hoteleria-turismo/" },
  clase: { nombre: "Colegio Fernando de Aragón: Clase 3, baja complejidad (Chile)", url: "https://colegiofernandodearagon.cl/wp-content/uploads/2020/03/clase-3-baja-complejidad.pdf" }
};

window.CORTES = [
  {
    id: "brunoise", nombre: "Brunoise", alias: "Dado muy pequeño", familia: "Dados", forma: "caja",
    dims: [{ n: "Largo", min: 3, max: 3, ref: 3 }, { n: "Ancho", min: 3, max: 3, ref: 3 }, { n: "Alto", min: 3, max: 3, ref: 3 }],
    pulgadas: "1/8 × 1/8 × 1/8 in",
    origen: "Se corta transversalmente una juliana, para obtener cubos.",
    clave: "Es un cubo: sus tres medidas son iguales, de unos 3 mm.",
    diferencias: "elgourmet: 1 a 2 mm. Gestiopolis: 2 a 3 mm. Vegetables.co.nz: 1 a 3 mm. Clase del Colegio Fernando de Aragón: 5 mm.",
    fuentes: ["skillsusa", "rouxbe", "escoffier", "wekiva", "webstaurant", "wikipedia"]
  },
  {
    id: "brunoise-fina", nombre: "Brunoise fina", alias: "Fine brunoise", familia: "Dados", forma: "caja",
    dims: [{ n: "Largo", min: 1.5, max: 2, ref: 2 }, { n: "Ancho", min: 1.5, max: 2, ref: 2 }, { n: "Alto", min: 1.5, max: 2, ref: 2 }],
    pulgadas: "1/16 × 1/16 × 1/16 in",
    origen: "Se corta transversalmente una juliana fina.",
    clave: "Es el cubo más pequeño de este catálogo, de 1,5 a 2 mm.",
    diferencias: "Las fuentes consultadas coinciden, con diferencias por redondeo.",
    fuentes: ["wekiva", "escoffier", "wikipedia"]
  },
  {
    id: "macedonia", nombre: "Macedonia", alias: "Macédoine, dado pequeño", familia: "Dados", forma: "caja",
    dims: [{ n: "Largo", min: 5, max: 6.5, ref: 6 }, { n: "Ancho", min: 5, max: 6.5, ref: 6 }, { n: "Alto", min: 5, max: 6.5, ref: 6 }],
    pulgadas: "1/4 × 1/4 × 1/4 in",
    origen: "Se corta transversalmente un bastón (batonnet).",
    clave: "Es un cubo de 5 a 6,5 mm, cerca del doble de una brunoise.",
    diferencias: "elgourmet: 4 a 5 mm. Las fuentes en pulgadas equivalen a 6,4 mm; Wikipedia, Vegetables.co.nz y Gestiopolis indican 5 mm.",
    fuentes: ["skillsusa", "rouxbe", "wekiva", "webstaurant", "wikipedia", "nz", "gestiopolis"]
  },
  {
    id: "parmentier", nombre: "Parmentier", alias: "Dado mediano", familia: "Dados", forma: "caja",
    dims: [{ n: "Largo", min: 12, max: 13, ref: 13 }, { n: "Ancho", min: 12, max: 13, ref: 13 }, { n: "Alto", min: 12, max: 13, ref: 13 }],
    pulgadas: "1/2 × 1/2 × 1/2 in",
    origen: "Se cortan láminas y bastones de 13 mm, y luego cubos.",
    clave: "Es un cubo de 12 a 13 mm, más de 1 cm por lado.",
    diferencias: "Clase del Colegio Fernando de Aragón: 10 mm. Gestiopolis: cerca de 20 mm.",
    fuentes: ["wekiva", "skillsusa", "rouxbe", "wikipedia"]
  },
  {
    id: "carre", nombre: "Carré", alias: "Dado grande", familia: "Dados", forma: "caja",
    dims: [{ n: "Largo", min: 19, max: 20, ref: 20 }, { n: "Ancho", min: 19, max: 20, ref: 20 }, { n: "Alto", min: 19, max: 20, ref: 20 }],
    pulgadas: "3/4 × 3/4 × 3/4 in",
    origen: "Se cortan láminas y bastones de 20 mm, y luego cubos.",
    clave: "Es el cubo más grande de este catálogo, de 19 a 20 mm.",
    diferencias: "Escoffier: de 3/4 a 1 pulgada (19 a 25 mm).",
    fuentes: ["wekiva", "skillsusa", "rouxbe", "wikipedia"]
  },
  {
    id: "juliana", nombre: "Juliana", alias: "Julienne", familia: "Tiras", forma: "caja",
    dims: [{ n: "Largo", min: 30, max: 60, ref: 50 }, { n: "Ancho", min: 3, max: 3, ref: 3 }, { n: "Alto", min: 3, max: 3, ref: 3 }],
    pulgadas: "1/8 × 1/8 × 1 a 2 1/2 in",
    origen: "Se cortan láminas de 3 mm y luego tiras del mismo grosor.",
    clave: "Es una tira de sección cuadrada de 3 mm, con 3 a 6 cm de largo.",
    diferencias: "SkillsUSA llama «allumette» a esta medida y reserva «julienne» para 1/16 in. elgourmet: 1 mm de grosor. Clase del Colegio Fernando de Aragón: 5 mm de grosor y 40 mm de largo.",
    fuentes: ["rouxbe", "wekiva", "escoffier", "webstaurant", "wikipedia", "gestiopolis"]
  },
  {
    id: "juliana-fina", nombre: "Juliana fina", alias: "Fine julienne", familia: "Tiras", forma: "caja",
    dims: [{ n: "Largo", min: 30, max: 60, ref: 50 }, { n: "Ancho", min: 1.5, max: 2, ref: 2 }, { n: "Alto", min: 1.5, max: 2, ref: 2 }],
    pulgadas: "1/16 × 1/16 × 1 a 2 1/2 in",
    origen: "Se corta una juliana a lo largo o se parte de láminas muy finas.",
    clave: "Tiene el largo de una juliana, pero solo 1,5 a 2 mm de grosor.",
    diferencias: "SkillsUSA llama «julienne» a esta medida.",
    fuentes: ["rouxbe", "wekiva", "escoffier", "skillsusa", "wikipedia"]
  },
  {
    id: "baston", nombre: "Bastón", alias: "Batonnet", familia: "Tiras", forma: "caja",
    dims: [{ n: "Largo", min: 50, max: 65, ref: 55 }, { n: "Ancho", min: 6, max: 6.5, ref: 6 }, { n: "Alto", min: 6, max: 6.5, ref: 6 }],
    pulgadas: "1/4 × 1/4 × 2 a 2 1/2 in",
    origen: "Se cortan láminas de 6 mm y luego tiras del mismo grosor.",
    clave: "Es una tira de sección cuadrada de 6 mm, con 5 a 6,5 cm de largo.",
    diferencias: "Vegetables.co.nz: 5 × 5 × 50 mm.",
    fuentes: ["skillsusa", "webstaurant", "wekiva", "rouxbe", "escoffier", "wikipedia"]
  },
  {
    id: "pont-neuf", nombre: "Pont-neuf", alias: "Bastón grueso", familia: "Tiras", forma: "caja",
    dims: [{ n: "Largo", min: 60, max: 80, ref: 65 }, { n: "Ancho", min: 10, max: 20, ref: 10 }, { n: "Alto", min: 10, max: 20, ref: 10 }],
    pulgadas: "1/3 × 1/3 × 2 1/2 a 3/4 × 3/4 × 3 in",
    origen: "Se corta el producto en tiras gruesas de sección cuadrada.",
    clave: "Es la tira más gruesa: desde 1 cm de grosor y 6 cm de largo.",
    diferencias: "La clase del Colegio Fernando de Aragón y Gestiopolis llaman «bastones» a 1 cm × 6 a 7 cm; aquí esa medida corresponde a pont-neuf.",
    fuentes: ["wikipedia", "clase", "gestiopolis"]
  },
  {
    id: "paisana", nombre: "Paisana", alias: "Paysanne", familia: "Láminas y rodajas", forma: "caja",
    dims: [{ n: "Largo", min: 10, max: 13, ref: 13 }, { n: "Ancho", min: 10, max: 13, ref: 13 }, { n: "Espesor", min: 3, max: 3, ref: 3 }],
    pulgadas: "1/2 × 1/2 × 1/8 in",
    origen: "Se corta un bastón grueso en láminas finas.",
    clave: "Es una lámina plana: 10 a 13 mm por lado y 3 mm de espesor.",
    diferencias: "elgourmet y Gestiopolis: 1 mm de espesor. Clase del Colegio Fernando de Aragón: 5 mm de espesor. Algunas fuentes aceptan seguir la forma natural del producto.",
    fuentes: ["skillsusa", "rouxbe", "webstaurant", "wekiva", "wikipedia"]
  },
  {
    id: "rondelle", nombre: "Rondelle", alias: "Vichy, rodaja", familia: "Láminas y rodajas", forma: "rodaja",
    dims: [{ n: "Espesor", min: 3, max: 5, ref: 4 }],
    pulgadas: "No se usa una sola medida",
    origen: "Se corta transversalmente un producto cilíndrico, como la zanahoria.",
    clave: "Es una rodaja de 3 a 5 mm; su diámetro depende del producto.",
    diferencias: "WebstaurantStore: de 1/8 a 1/2 in (3 a 13 mm). Gestiopolis describe «vichy» como anillos de 2 a 3 cm.",
    fuentes: ["clase", "gestiopolis", "webstaurant"]
  },
  {
    id: "chiffonade", nombre: "Chiffonade", alias: "Cintas de hojas", familia: "Láminas y rodajas", forma: "cinta",
    dims: [{ n: "Ancho de la cinta", min: 3, max: 10, ref: 3 }],
    pulgadas: "Cerca de 1/8 in",
    origen: "Se apilan y enrollan las hojas, y se cortan en secciones.",
    clave: "Son cintas de hojas; se reconocen más por la técnica que por una medida exacta.",
    diferencias: "WebstaurantStore y Wekiva: cerca de 3 mm. Wikipedia: 4 a 10 mm. Otras fuentes no indican medida.",
    fuentes: ["webstaurant", "wekiva", "wikipedia"]
  },
  {
    id: "tourne", nombre: "Torneado", alias: "Tourné", familia: "Especiales", forma: "torneado", sinCortar: true,
    dims: [{ n: "Largo", min: 50, max: 50, ref: 50 }, { n: "Diámetro", min: 19, max: 19, ref: 19 }],
    pulgadas: "2 in de largo × 3/4 in de ancho",
    origen: "Se talla con cuchillo una pieza de siete caras, generalmente más ancha al centro.",
    clave: "Tiene 7 caras y unos 50 mm de largo.",
    diferencias: "Solo Rouxbe indica el ancho (19 mm). Gestiopolis describe un torneado menor, de unos 2 cm (olivette).",
    fuentes: ["skillsusa", "rouxbe", "wikipedia"]
  }
];
