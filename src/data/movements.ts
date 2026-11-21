export interface Movement {
  id: string
  nombre: string
  plano: 'sagital' | 'frontal' | 'ambos'
  /** Ángulo máximo orientativo (grados). */
  amplitud: number
  rango: string
  direccion: string
  musculos: string[]
  articulaciones: string
  limites: string
  prension: string
  explicacion: string
}

export const MOVEMENTS: Movement[] = [
  {
    id: 'flexion', nombre: 'Flexión', plano: 'sagital', amplitud: 80, rango: '≈ 70–80°',
    direccion: 'La palma se acerca a la cara palmar del antebrazo (plano sagital, eje transversal).',
    musculos: ['fcr', 'fcu', 'pl'],
    articulaciones: 'Radiocarpiana y mediocarpiana colaboran; la proporción de cada una varía según la fuente y el método de medición.',
    limites: 'Tensión de los ligamentos radiocarpianos dorsales y de los extensores; contacto de los tendones flexores contra el antebrazo.',
    prension: 'Con los dedos extendidos y la muñeca flexionada la prensión pierde fuerza (insuficiencia activa de los flexores de los dedos).',
    explicacion: 'La fila proximal rota hacia palmar sobre el radio, mientras el hueso grande y el ganchoso se flexionan sobre la fila proximal. Participan sobre todo el flexor radial y el ulnar del carpo; el palmar largo es auxiliar.',
  },
  {
    id: 'extension', nombre: 'Extensión', plano: 'sagital', amplitud: 70, rango: '≈ 60–70°',
    direccion: 'El dorso de la mano se acerca a la cara dorsal del antebrazo.',
    musculos: ['ecrl', 'ecrb', 'ecu'],
    articulaciones: 'Radiocarpiana y mediocarpiana colaboran; en extensión el escafoides se verticaliza y el carpo se «cierra» sobre el radio.',
    limites: 'Tensión de los ligamentos radiocarpianos palmares y de los flexores; contacto óseo entre el radio y los huesos carpianos.',
    prension: 'La posición funcional de reposo y de prensión es en ligera extensión (≈ 20–30°), en la que los flexores de los dedos tienen su mejor rendimiento; el extensor radial corto del carpo la fija.',
    explicacion: 'La fila proximal se desplaza hacia dorsal. Los extensores radiales y ulnar del carpo son los motores; los extensores de los dedos colaboran solo si los dedos permanecen extendidos.',
  },
  {
    id: 'desviacion-radial', nombre: 'Desviación radial', plano: 'frontal', amplitud: 20, rango: '≈ 15–25°',
    direccion: 'El borde radial de la mano se acerca a la cara lateral del antebrazo (plano frontal, eje anteroposterior).',
    musculos: ['fcr', 'ecrl', 'ecrb'],
    articulaciones: 'En la radiocarpiana el carpo se desplaza hacia ulnar bajo el radio; en la mediocarpiana la fila proximal se flexiona (el escafoides se «acuesta» y su tubérculo se hace prominente).',
    limites: 'Contacto del escafoides con la estiloides radial y tensión del ligamento colateral ulnar y de los ligamentos ulnocarpianos.',
    prension: 'Alinea el eje de la mano con el antebrazo cuando se golpea o se usa una herramienta («martillo»).',
    explicacion: 'Intervienen el flexor radial y los extensores radiales del carpo, con ayuda del abductor largo del pulgar. La amplitud es menor que la ulnar porque la estiloides radial desciende más.',
  },
  {
    id: 'desviacion-ulnar', nombre: 'Desviación ulnar', plano: 'frontal', amplitud: 35, rango: '≈ 30–40°',
    direccion: 'El borde ulnar de la mano se acerca a la cara medial del antebrazo.',
    musculos: ['fcu', 'ecu'],
    articulaciones: 'En la radiocarpiana el carpo se desplaza hacia radial y el piramidal contacta con el disco; en la mediocarpiana la fila proximal se extiende.',
    limites: 'Tensión del ligamento colateral radial y de los ligamentos radiocarpianos; el recorrido es mayor porque la estiloides ulnar es más corta.',
    prension: 'Es la posición de la mano al empuñar y sostener un martillo o un bate; combina con la prensión de potencia.',
    explicacion: 'El flexor y el extensor ulnar del carpo actúan en sinergia: cancelan sus acciones de flexión y extensión y dejan solo la desviación ulnar.',
  },
  {
    id: 'circunduccion', nombre: 'Circunducción', plano: 'ambos', amplitud: 0, rango: 'Cono elíptico',
    direccion: 'La mano describe un cono elíptico resultante de la combinación sucesiva de flexión, desviación ulnar, extensión y desviación radial.',
    musculos: ['fcr', 'fcu', 'ecrl', 'ecrb', 'ecu'],
    articulaciones: 'Radiocarpiana (articulación condílea de dos grados de libertad) y mediocarpiana trabajan en cadena.',
    limites: 'Tensión alternada de todos los ligamentos periarticulares; no hay rotación axial verdadera en la muñeca.',
    prension: 'Permite orientar la mano en cualquier dirección y optimiza la posición de los dedos.',
    explicacion: 'Se compone de los dos movimientos principales de la radiocarpiana, sin tercer grado de libertad: cualquier rotación aparente proviene de las articulaciones radioulnares.',
  },
]

export const MOVEMENT_BY_ID: Record<string, Movement> = Object.fromEntries(MOVEMENTS.map((m) => [m.id, m]))

export const WRIST_JOINT_NOTES = [
  { titulo: 'Radiocarpiana', texto: 'Articulación condílea (elipsoidea) entre la superficie antebraquial (radio + disco) y el cóndilo carpiano (escafoides + semilunar + piramidal). Dos grados de libertad: flexoextensión e inclinación radial/ulnar.' },
  { titulo: 'Mediocarpiana', texto: 'Entre la fila proximal y la distal del carpo. Es una articulación distinta de la radiocarpiana y colabora con ella en todos los movimientos de la muñeca.' },
  { titulo: 'Pronación y supinación', texto: 'Son movimientos del antebrazo y no de la muñeca: ocurren en las articulaciones radioulnares proximal y distal (con el radio rotando alrededor de la ulna). La muñeca acompaña al radio, pero no los genera.' },
]
