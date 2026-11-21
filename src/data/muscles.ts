export type MuscleGroup = 'flexor' | 'extensor'
export type MuscleRole = 'principal' | 'auxiliar'

export interface Muscle {
  id: string
  nombre: string
  grupo: MuscleGroup
  rol: MuscleRole
  origen: string
  insercion: string
  inervacion: string
  accion: string
  estabilizacion: string
  relaciones: string
  /** Movimientos de la muñeca en los que participa: ids de movements.ts. */
  movimientos: string[]
  alerta?: string
}

export const MUSCLES: Muscle[] = [
  {
    id: 'fcr', nombre: 'Flexor radial del carpo', grupo: 'flexor', rol: 'principal',
    origen: 'Epicóndilo medial del húmero (tendón flexor común).',
    insercion: 'Cara palmar de la base del 2.º metacarpiano (con una expansión a la base del 3.º).',
    inervacion: 'Nervio mediano (C6–C7).',
    accion: 'Flexiona la muñeca y la desvía hacia radial (con el extensor radial largo y corto del carpo).',
    estabilizacion: 'Estabiliza la columna radial del carpo durante la prensión de precisión; su tendón es referencia del pulso radial.',
    relaciones: 'Su tendón pasa por un canal propio sobre el trapecio, por fuera del túnel del carpo; el nervio mediano queda ligeramente medial y profundo.',
    movimientos: ['flexion', 'desviacion-radial'],
  },
  {
    id: 'fcu', nombre: 'Flexor ulnar del carpo', grupo: 'flexor', rol: 'principal',
    origen: 'Cabeza humeral: epicóndilo medial. Cabeza ulnar: olécranon y borde posterior de la ulna.',
    insercion: 'Pisiforme; desde él, por los ligamentos pisoganchoso y pisometacarpiano, al ganchoso y a la base del 5.º metacarpiano.',
    inervacion: 'Nervio ulnar (C7–T1).',
    accion: 'Flexiona la muñeca y la desvía hacia ulnar (con el extensor ulnar del carpo).',
    estabilizacion: 'El pisiforme actúa como sesamoideo y palanca; estabiliza el lado ulnar del carpo.',
    relaciones: 'El nervio y la arteria ulnares transcurren lateral a su tendón en el antebrazo distal y entran en el canal de Guyon.',
    movimientos: ['flexion', 'desviacion-ulnar'],
  },
  {
    id: 'pl', nombre: 'Palmar largo', grupo: 'flexor', rol: 'principal',
    origen: 'Epicóndilo medial del húmero (tendón flexor común).',
    insercion: 'Retináculo flexor (porción distal) y aponeurosis palmar.',
    inervacion: 'Nervio mediano (C7–C8).',
    accion: 'Flexor débil de la muñeca; tensa la aponeurosis palmar.',
    estabilizacion: 'Contribuye a la prensión al fijar la aponeurosis palmar.',
    relaciones: 'Superficial al retináculo flexor, en la línea media; el nervio mediano queda profundo y ligeramente lateral.',
    movimientos: ['flexion'],
    alerta: 'Está ausente en ≈ 14 % de las personas (variación frecuente); su tendón se emplea como injerto.',
  },
  {
    id: 'ecrl', nombre: 'Extensor radial largo del carpo', grupo: 'extensor', rol: 'principal',
    origen: 'Cresta supracondílea lateral del húmero.',
    insercion: 'Cara dorsal de la base del 2.º metacarpiano.',
    inervacion: 'Nervio radial (C6–C7), antes de su división.',
    accion: 'Extiende la muñeca y la desvía hacia radial.',
    estabilizacion: 'Estabiliza la muñeca en extensión durante la prensión de fuerza.',
    relaciones: 'Su tendón discurre en el segundo compartimento extensor, lateral al tubérculo dorsal del radio, junto con el extensor radial corto.',
    movimientos: ['extension', 'desviacion-radial'],
    alerta: 'No confundir: el largo se inserta en la base del 2.º metacarpiano; el corto, en la del 3.º.',
  },
  {
    id: 'ecrb', nombre: 'Extensor radial corto del carpo', grupo: 'extensor', rol: 'principal',
    origen: 'Epicóndilo lateral del húmero (tendón extensor común).',
    insercion: 'Cara dorsal de la base del 3.º metacarpiano.',
    inervacion: 'Nervio interóseo posterior (rama profunda del radial) (C7–C8); la rama puede nacer ligeramente antes del supinador.',
    accion: 'Extiende la muñeca y colabora en la desviación radial.',
    estabilizacion: 'Es el principal estabilizador de la muñeca en extensión durante la flexión de los dedos (prensión).',
    relaciones: 'Segundo compartimento extensor con el extensor radial largo; el tendón del extensor largo del pulgar lo cruza distalmente.',
    movimientos: ['extension', 'desviacion-radial'],
    alerta: 'No confundir: el corto se inserta en la base del 3.º metacarpiano; el largo, en la del 2.º.',
  },
  {
    id: 'ecu', nombre: 'Extensor ulnar del carpo', grupo: 'extensor', rol: 'principal',
    origen: 'Epicóndilo lateral del húmero (tendón extensor común) y borde posterior de la ulna.',
    insercion: 'Tubérculo de la base del 5.º metacarpiano (cara dorsal-medial).',
    inervacion: 'Nervio interóseo posterior (rama profunda del radial) (C7–C8).',
    accion: 'Extiende la muñeca y la desvía hacia ulnar (con el flexor ulnar del carpo).',
    estabilizacion: 'Estabiliza la articulación radioulnar distal y el lado ulnar del carpo; su vaina es parte del complejo fibrocartilaginoso triangular.',
    relaciones: 'Discurre en el sexto compartimento extensor, en el surco de la cabeza de la ulna.',
    movimientos: ['extension', 'desviacion-ulnar'],
  },
]

export interface Auxiliary { nombre: string; nervio: string; nota: string }
export const AUXILIARES: Auxiliary[] = [
  { nombre: 'Flexor superficial de los dedos', nervio: 'Mediano', nota: 'Cruza la muñeca y la flexiona secundariamente; su acción principal es la flexión de las interfalángicas proximales.' },
  { nombre: 'Flexor profundo de los dedos', nervio: 'Mediano (nervio interóseo anterior) para 2.º–3.º y ulnar para 4.º–5.º', nota: 'Flexión de las interfalángicas distales; colabora con la flexión de la muñeca solo secundariamente.' },
  { nombre: 'Flexor largo del pulgar', nervio: 'Nervio interóseo anterior', nota: 'Flexiona el pulgar; su tendón pasa por el túnel del carpo.' },
  { nombre: 'Extensor de los dedos', nervio: 'Nervio interóseo posterior', nota: 'Extiende los dedos y colabora en la extensión de la muñeca solo cuando los dedos están relajados.' },
  { nombre: 'Extensor del índice y del meñique', nervio: 'Nervio interóseo posterior', nota: 'Extensión independiente de índice y meñique; cruzan la muñeca sin ser motores principales.' },
  { nombre: 'Abductor largo del pulgar', nervio: 'Nervio interóseo posterior', nota: 'Desvía el pulgar hacia radial y es auxiliar de la desviación radial de la muñeca.' },
  { nombre: 'Extensor corto y largo del pulgar', nervio: 'Nervio interóseo posterior', nota: 'Forman los bordes de la tabaquera anatómica; participan débilmente en la extensión radial.' },
]
