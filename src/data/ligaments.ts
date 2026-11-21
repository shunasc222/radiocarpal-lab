export type LigView = 'palmar' | 'dorsal'
export type LigCategory = 'radiocarpiano' | 'ulnocarpiano' | 'colateral' | 'intercarpiano' | 'radioulnar' | 'capsula'

export interface Ligament {
  id: string
  nombre: string
  categoria: LigCategory
  /** Pertenece a la articulación radiocarpiana propiamente dicha. */
  propio: boolean
  views: LigView[]
  /** Geometría en el sistema del esquema (vista palmar; se refleja para la dorsal). */
  paths: string[]
  width: number
  dashed?: boolean
  origen: string
  insercion: string
  funcion: string
  estabilidad: string
  lesion: string
  nota?: string
}

export const CATEGORY_LABEL: Record<LigCategory, string> = {
  radiocarpiano: 'Radiocarpiano (propio)',
  ulnocarpiano: 'Ulnocarpiano (propio)',
  colateral: 'Colateral',
  intercarpiano: 'Intercarpiano',
  radioulnar: 'Estabilizador radioulnar distal',
  capsula: 'Cápsula y sinovial',
}

export const LIGAMENTS: Ligament[] = [
  {
    id: 'capsula', nombre: 'Cápsula articular', categoria: 'capsula', propio: true, views: ['palmar', 'dorsal'],
    paths: ['M118 382 C146 352 236 330 306 322 L418 318 C448 352 456 408 442 440 L360 450 L272 448 L172 480 L112 470 Z'],
    width: 5, dashed: true,
    origen: 'Bordes de la superficie articular del radio y del disco articular.',
    insercion: 'Bordes proximales de escafoides, semilunar y piramidal.',
    funcion: 'Envuelve la articulación, contiene la membrana sinovial y está reforzada por los ligamentos radiocarpianos, que son sus engrosamientos; es más gruesa y resistente en la cara palmar.',
    estabilidad: 'Mantiene la congruencia entre el cóndilo carpiano y la cavidad antebraquial; limita todos los movimientos extremos.',
    lesion: 'En la luxación radiocarpiana y en fracturas-luxaciones se desgarra; la rigidez capsular tras inmovilización limita la flexoextensión.',
  },
  {
    id: 'sinovial', nombre: 'Membrana sinovial', categoria: 'capsula', propio: true, views: ['palmar', 'dorsal'],
    paths: ['M128 384 C180 360 240 342 306 332 L416 324 M130 392 C170 388 200 380 238 374 L360 382 L420 392'],
    width: 3, dashed: true,
    origen: 'Reviste la cara profunda de la cápsula articular.',
    insercion: 'Se refleja sobre los márgenes cartilaginosos de radio, disco y huesos carpianos.',
    funcion: 'Secreta el líquido sinovial que lubrica y nutre el cartílago. La cavidad radiocarpiana es independiente de la radioulnar distal y de la mediocarpiana en la muñeca sana.',
    estabilidad: 'Contribuye a la lubricación y a la cohesión por presión negativa intraarticular.',
    lesion: 'Se inflama en la artritis (sinovitis, p. ej. en la artritis reumatoide). En la artrografía, el paso del contraste a la radioulnar distal o a la mediocarpiana indica perforación del disco o de un ligamento interóseo.',
  },
  {
    id: 'rsc', nombre: 'Ligamento radioescafocapitado', categoria: 'radiocarpiano', propio: true, views: ['palmar'],
    paths: ['M146 354 C184 392 230 440 274 494'], width: 10,
    origen: 'Apófisis estiloides del radio y borde palmar de la fosita escafoidea.',
    insercion: 'Cintura del escafoides (fibras de paso) y hueso grande.',
    funcion: 'Forma un «fulcro» sobre el cual se flexiona el escafoides y limita la traslación ulnar del carpo; se tensa en extensión y desviación ulnar.',
    estabilidad: 'Estabiliza al escafoides por su cara palmar y une la columna radial con la central.',
    lesion: 'Su insuficiencia, junto con la del escafolunar, se relaciona con inestabilidades periescafoideas y luxaciones perilunares de alta energía.',
  },
  {
    id: 'lrl', nombre: 'Ligamento radiolunar largo', categoria: 'radiocarpiano', propio: true, views: ['palmar'],
    paths: ['M198 352 C240 372 280 392 304 412'], width: 10,
    origen: 'Borde palmar del radio, lateral a la fosita semilunar.',
    insercion: 'Semilunar (y fibras que se continúan con el lunopiramidal).',
    funcion: 'Sostiene al semilunar por palmar y se opone a la traslación ulnar de la fila proximal.',
    estabilidad: 'Es uno de los principales estabilizadores extrínsecos del semilunar.',
    lesion: 'Su rotura participa en las inestabilidades del semilunar y en la traslación ulnar del carpo.',
  },
  {
    id: 'srl', nombre: 'Ligamento radiolunar corto', categoria: 'radiocarpiano', propio: true, views: ['palmar'],
    paths: ['M286 334 C290 350 292 364 294 376'], width: 10,
    origen: 'Borde palmar de la fosita semilunar.',
    insercion: 'Cara palmar del semilunar.',
    funcion: 'Une directamente el radio con el semilunar y evita su desplazamiento palmar.',
    estabilidad: 'Mantiene al semilunar centrado en su fosita.',
    lesion: 'Su desinserción acompaña a fracturas del fragmento palmar-medial del radio.',
  },
  {
    id: 'rsl', nombre: 'Ligamento radioescafosemilunar (Testut-Kuentz)', categoria: 'radiocarpiano', propio: true, views: ['palmar'],
    paths: ['M240 342 C248 358 256 370 262 384'], width: 8,
    origen: 'Borde palmar del radio, en la cresta interfacetaria.',
    insercion: 'Unión escafolunar (ligamento escafolunar interóseo).',
    funcion: 'Conduce vasos y nervios hacia la unión escafolunar. Se considera sobre todo una estructura neurovascular, con escasa contribución mecánica.',
    estabilidad: 'Contribución mecánica discutida: no debe presentarse como un estabilizador principal.',
    lesion: 'Su sección apenas altera la estabilidad, pero lesiona vasos y fibras propioceptivas.',
    nota: 'Su valor mecánico es debatido en la literatura.',
  },
  {
    id: 'ulnolunar', nombre: 'Ligamento ulnolunar', categoria: 'ulnocarpiano', propio: true, views: ['palmar'],
    paths: ['M366 332 C352 358 342 384 334 412'], width: 8,
    origen: 'Ligamento radioulnar palmar y borde palmar del disco (complejo fibrocartilaginoso).',
    insercion: 'Cara palmar del semilunar.',
    funcion: 'Une el lado ulnar del antebrazo con el carpo proximal y refuerza la cápsula palmar-ulnar.',
    estabilidad: 'Estabiliza la columna ulnar del carpo y transmite tracción del carpo hacia el complejo fibrocartilaginoso.',
    lesion: 'Se lesiona junto con el complejo fibrocartilaginoso triangular en traumatismos rotacionales.',
  },
  {
    id: 'ulnotriquetral', nombre: 'Ligamento ulnotriquetral', categoria: 'ulnocarpiano', propio: true, views: ['palmar'],
    paths: ['M396 334 C400 352 402 368 402 386'], width: 8,
    origen: 'Ligamento radioulnar palmar y base de la estiloides ulnar.',
    insercion: 'Cara palmar del piramidal.',
    funcion: 'Suspende el piramidal del lado ulnar y refuerza el compartimento ulnocarpiano.',
    estabilidad: 'Contribuye a la estabilidad ulnocarpiana junto con el ulnolunar.',
    lesion: 'Su compromiso acompaña a desgarros del complejo fibrocartilaginoso y al dolor ulnar palmar.',
  },
  {
    id: 'ulnocapitado', nombre: 'Ligamento ulnocapitado', categoria: 'ulnocarpiano', propio: false, views: ['palmar'],
    paths: ['M376 334 C354 402 326 452 300 500'], width: 6, dashed: true,
    origen: 'Fóvea de la ulna y ligamento radioulnar palmar.',
    insercion: 'Hueso grande (capitato), formando con el radioescafocapitado una «V» o arco palmar (ligamento arqueado).',
    funcion: 'Une el antebrazo con la fila distal; forma parte del ligamento arqueado, que cierra por palmar la articulación mediocarpiana.',
    estabilidad: 'Es un puente entre la ulna y la mediocarpiana; algunos autores lo consideran parte de los ligamentos ulnocarpianos.',
    lesion: 'Su lesión se asocia a la inestabilidad ulnocarpiana.',
    nota: 'La clasificación como radiocarpiano / ulnocarpiano / mediocarpiano varía según la fuente.',
  },
  {
    id: 'radiocarpiano-dorsal', nombre: 'Ligamento radiocarpiano dorsal', categoria: 'radiocarpiano', propio: true, views: ['dorsal'],
    paths: ['M192 340 C258 364 340 372 418 392', 'M174 350 C250 384 330 396 410 410'], width: 9,
    origen: 'Borde dorsal del radio, con el tubérculo dorsal como referencia.',
    insercion: 'Semilunar y piramidal (algunos autores lo llaman ligamento radiopiramidal dorsal).',
    funcion: 'Refuerza la cápsula en su cara dorsal, limita la flexión extrema y evita la traslación palmar del carpo.',
    estabilidad: 'Más delgado que los palmares; trabaja con el intercarpiano dorsal formando un «V» lateral de estabilización dorsal.',
    lesion: 'Su lesión acompaña a las fracturas distales del radio con desplazamiento dorsal (Colles) y a las luxaciones dorsales del carpo.',
  },
  {
    id: 'colateral-radial', nombre: 'Ligamento colateral radial del carpo', categoria: 'colateral', propio: true, views: ['palmar', 'dorsal'],
    paths: ['M126 386 C108 412 96 442 92 478'], width: 9,
    origen: 'Vértice de la apófisis estiloides del radio.',
    insercion: 'Escafoides (tubérculo y cintura) y trapecio.',
    funcion: 'Refuerza la cápsula en el lado radial y limita la desviación ulnar.',
    estabilidad: 'Estabiliza el borde radial del carpo; su tensión es uno de los límites de la desviación ulnar.',
    lesion: 'Puede lesionarse en la hiperdesviación ulnar; el dolor se localiza bajo la estiloides radial.',
  },
  {
    id: 'colateral-ulnar', nombre: 'Ligamento colateral ulnar del carpo', categoria: 'colateral', propio: true, views: ['palmar', 'dorsal'],
    paths: ['M414 340 C432 356 442 374 444 398'], width: 9,
    origen: 'Vértice de la apófisis estiloides de la ulna.',
    insercion: 'Piramidal y pisiforme.',
    funcion: 'Refuerza la cápsula en el lado ulnar y limita la desviación radial.',
    estabilidad: 'Estabiliza el borde ulnar del carpo; se asocia a la vaina del extensor ulnar del carpo.',
    lesion: 'Su desgarro se asocia a dolor ulnar y a lesiones del complejo fibrocartilaginoso.',
    nota: 'Su individualidad y su relación con el complejo fibrocartilaginoso se describen de manera distinta en diferentes textos.',
  },
  {
    id: 'escafolunar', nombre: 'Ligamento escafolunar interóseo', categoria: 'intercarpiano', propio: false, views: ['palmar', 'dorsal'],
    paths: ['M266 368 L270 412'], width: 8,
    origen: 'Borde medial del escafoides (proximal).',
    insercion: 'Borde lateral del semilunar (proximal).',
    funcion: 'Conecta escafoides y semilunar y contribuye a su estabilidad, de modo que ambos se muevan de forma coordinada. Su porción dorsal es la más gruesa y la más importante.',
    estabilidad: 'Es el vínculo clave entre la fila proximal radial y central. No es un ligamento radiocarpiano: pertenece al carpo.',
    lesion: 'Su rotura causa disociación escafolunar: el escafoides se flexiona y el semilunar se extiende (inestabilidad DISI), con dolor, chasquido y, a largo plazo, artrosis (SLAC).',
  },
  {
    id: 'lunopiramidal', nombre: 'Ligamento lunopiramidal interóseo', categoria: 'intercarpiano', propio: false, views: ['palmar', 'dorsal'],
    paths: ['M350 368 L354 414'], width: 8,
    origen: 'Borde medial del semilunar (proximal).',
    insercion: 'Borde lateral del piramidal (proximal).',
    funcion: 'Une semilunar y piramidal; su porción palmar es la más gruesa.',
    estabilidad: 'Mantiene la unión entre el semilunar y la columna ulnar del carpo.',
    lesion: 'Su insuficiencia produce dolor ulnar, inestabilidad semilunar-piramidal y un patrón VISI (semilunar en flexión).',
  },
  {
    id: 'intercarpiano-dorsal', nombre: 'Ligamento intercarpiano dorsal', categoria: 'intercarpiano', propio: false, views: ['dorsal'],
    paths: ['M416 410 C350 432 252 436 170 450'], width: 8,
    origen: 'Piramidal (cara dorsal).',
    insercion: 'Escafoides y trapezoide (cara dorsal).',
    funcion: 'Cruza el dorso del carpo transversalmente y estabiliza la articulación mediocarpiana, junto con el radiocarpiano dorsal.',
    estabilidad: 'Es un ligamento intercarpiano (no radiocarpiano), pero modula el movimiento de la fila proximal.',
    lesion: 'Su insuficiencia contribuye a la inestabilidad mediocarpiana y a la desalineación del escafoides.',
  },
  {
    id: 'tfcc', nombre: 'Complejo fibrocartilaginoso triangular (TFCC)', categoria: 'radioulnar', propio: false, views: ['palmar', 'dorsal'],
    paths: ['M308 318 C334 328 380 328 416 318 L418 334 C382 344 332 344 308 336 Z'], width: 4,
    origen: 'Escotadura ulnar del radio (borde distal) y fóvea/estiloides de la ulna.',
    insercion: 'Disco articular, ligamentos radioulnares palmar y dorsal, menisco homólogo, vaina del extensor ulnar del carpo y ligamentos ulnolunar y ulnotriquetral.',
    funcion: 'Estabiliza la articulación radioulnar distal, amortigua la carga ulnocarpiana y prolonga la superficie articular del radio sobre la cabeza de la ulna.',
    estabilidad: 'Es el principal estabilizador de la radioulnar distal. Mixto: contribuye a la superficie radiocarpiana (disco) y a la estabilidad radioulnar distal.',
    lesion: 'Sus desgarros (traumáticos o degenerativos) causan dolor ulnar, chasquido e inestabilidad de la radioulnar distal.',
  },
  {
    id: 'radioulnares', nombre: 'Ligamentos radioulnares distales (palmar y dorsal)', categoria: 'radioulnar', propio: false, views: ['palmar', 'dorsal'],
    paths: ['M306 292 C340 276 384 276 416 292'], width: 7,
    origen: 'Bordes palmar y dorsal de la escotadura ulnar del radio.',
    insercion: 'Fóvea y base de la estiloides de la ulna (bordes del disco).',
    funcion: 'Mantienen la cabeza de la ulna en la escotadura ulnar durante la pronosupinación; su tensión relativa cambia con la posición del antebrazo (los estudios difieren en el detalle).',
    estabilidad: 'Estabilizadores de la articulación radioulnar distal (no pertenecen a la radiocarpiana); forman los bordes del complejo fibrocartilaginoso.',
    lesion: 'Su rotura se manifiesta con inestabilidad radioulnar distal («tecla de piano»).',
  },
]

LIGAMENTS.push(
  {
    id: 'retinaculo', nombre: 'Retináculo flexor (ligamento transverso del carpo)', categoria: 'capsula', propio: false, views: [], paths: [], width: 0,
    origen: 'Tubérculo del escafoides y del trapecio (lateral); pisiforme y gancho del ganchoso (medial).',
    insercion: 'Se extiende como un puente fibroso transversal sobre la cara palmar del carpo.',
    funcion: 'Convierte el surco carpiano en el túnel del carpo, por el que pasan el nervio mediano y los tendones flexores de los dedos y del pulgar; evita su desplazamiento palmar al flexionar.',
    estabilidad: 'No es un ligamento articular de la radiocarpiana: es una estructura vecina relevante para los tendones y el nervio mediano.',
    lesion: 'Su engrosamiento o el aumento de presión en el túnel comprimen el nervio mediano (síndrome del túnel carpiano); su sección es el tratamiento quirúrgico.',
    nota: 'Mostrado con la malla real de BodyParts3D (CC BY 4.0).',
  },
  {
    id: 'membrana', nombre: 'Membrana interósea del antebrazo (porción distal)', categoria: 'radioulnar', propio: false, views: [], paths: [], width: 0,
    origen: 'Borde interóseo del radio.', insercion: 'Borde interóseo de la ulna.',
    funcion: 'Une radio y ulna a lo largo de la diáfisis, transmite fuerzas del radio a la ulna y da origen a músculos profundos; por ella pasan los vasos y el nervio interóseos.',
    estabilidad: 'Contribuye a la estabilidad longitudinal del antebrazo y, con el complejo fibrocartilaginoso triangular, a la de la radioulnar distal.',
    lesion: 'Su lesión (lesión de Essex-Lopresti) acompaña a fracturas de la cabeza del radio con inestabilidad radioulnar distal.',
    nota: 'Mostrada con la malla real de BodyParts3D (CC BY 4.0), recortada a 10 cm de la línea articular.',
  },
)

export const LIG_BY_ID: Record<string, Ligament> = Object.fromEntries(LIGAMENTS.map((l) => [l.id, l]))

export const FAILURE_STEPS = [
  { titulo: '1. Lesión', texto: 'Caída sobre la mano extendida con desviación ulnar y supinación del carpo, o una torsión forzada. La fuerza supera la resistencia de uno o más ligamentos (p. ej. el escafolunar interóseo).' },
  { titulo: '2. Pérdida del vínculo', texto: 'Escafoides y semilunar dejan de estar acoplados. El escafoides, que tiende a flexionarse con la carga, ya no es contenido por el semilunar.' },
  { titulo: '3. Cinemática alterada', texto: 'El escafoides se flexiona y el semilunar, arrastrado por el piramidal, se extiende (DISI). Aparece un intervalo escafolunar y el carpo deja de moverse como una unidad.' },
  { titulo: '4. Dolor e inestabilidad', texto: 'Dolor dorso-radial, chasquido, debilidad de la prensión y, con el tiempo, sobrecarga cartilaginosa y artrosis progresiva (SLAC).' },
]
