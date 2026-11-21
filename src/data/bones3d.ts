import { STRUCTURE_BY_ID, type Structure } from './structures'
import type { BoneId } from '../components/viewer3d/config'

const MAP: Partial<Record<BoneId, string>> = {
  radio: 'radio-distal', ulna: 'ulna-distal', escafoides: 'escafoides', semilunar: 'semilunar', piramidal: 'piramidal', pisiforme: 'pisiforme',
}

const extra = (p: Omit<Structure, 'grupo' | 'participacion' | 'enEsquema' | 'num' | 'hijos' | 'pista'>, grupo: Structure['grupo'] = 'Carpo'): Structure => ({
  ...p, grupo, participacion: 'relacionada', enEsquema: false, num: 0, pista: '',
})

const EXTRA: Partial<Record<BoneId, Structure>> = {
  trapecio: extra({
    id: 'trapecio', nombre: 'Trapecio', participacionNota: 'Fila distal del carpo: no participa en la articulación radiocarpiana (pertenece a la mediocarpiana y a la trapeciometacarpiana).',
    ubicacion: 'Hueso más lateral de la fila distal, en la base del pulgar.',
    descripcion: 'Hueso irregular con una superficie en silla de montar para el 1.er metacarpiano y un tubérculo palmar que forma el borde lateral del túnel del carpo.',
    funcion: 'Articula con el escafoides, el trapezoide y los metacarpianos 1.º y 2.º; su articulación en silla permite la oposición del pulgar.',
    relaciones: 'Proximal: escafoides. Palmar: tendón del flexor radial del carpo en su canal. Dorsal-lateral: arteria radial en la tabaquera.',
    clinica: 'Sede de artrosis trapeciometacarpiana (rizartrosis), frecuente en mujeres mayores.',
  }),
  trapezoide: extra({
    id: 'trapezoide', nombre: 'Trapezoide', participacionNota: 'Fila distal del carpo: no participa en la articulación radiocarpiana.',
    ubicacion: 'Entre el trapecio y el hueso grande, en la fila distal.',
    descripcion: 'El hueso más pequeño de la fila distal, en forma de cuña, con base dorsal más ancha.',
    funcion: 'Articula con el escafoides, el trapecio, el hueso grande y el 2.º metacarpiano.',
    relaciones: 'Proximal: escafoides. Distal: base del 2.º metacarpiano.',
    clinica: 'Su fractura o luxación es rara.',
  }),
  hueso_grande: extra({
    id: 'hueso_grande', nombre: 'Hueso grande (capitato)', participacionNota: 'Fila distal del carpo: su cabeza forma parte de la articulación mediocarpiana.',
    ubicacion: 'Centro de la fila distal; su eje coincide con el del 3.er metacarpiano.',
    descripcion: 'El hueso más grande del carpo, con cabeza, cuello y cuerpo. La cabeza se aloja en la concavidad formada por el escafoides y el semilunar.',
    funcion: 'Es la columna central del carpo y transmite la carga del 3.er metacarpiano al semilunar y al escafoides.',
    relaciones: 'Proximal: escafoides y semilunar. Distal: 3.er metacarpiano. A los lados: trapezoide y ganchoso.',
    clinica: 'Su irrigación es retrógrada, como la del escafoides; una fractura del cuello puede dar necrosis avascular.',
  }),
  ganchoso: extra({
    id: 'ganchoso', nombre: 'Ganchoso (hamate)', participacionNota: 'Fila distal del carpo: no participa en la articulación radiocarpiana.',
    ubicacion: 'Lado ulnar de la fila distal.',
    descripcion: 'Hueso en cuña con un gancho (hámulo) palmar que forma el borde ulnar del túnel del carpo.',
    funcion: 'Articula con el hueso grande, el piramidal y los metacarpianos 4.º y 5.º; el gancho es polea para los tendones flexores y anclaje del ligamento pisoganchoso.',
    relaciones: 'Palmar: canal de Guyon y rama profunda del nervio ulnar rodean el gancho. Proximal: piramidal (y semilunar según la posición).',
    clinica: 'La fractura del gancho (golf, béisbol) causa dolor hipotenar y puede lesionar el nervio ulnar o romper tendones flexores.',
  }),
}
for (const [n, id] of [[1, 'mc1'], [2, 'mc2'], [3, 'mc3'], [4, 'mc4'], [5, 'mc5']] as const) {
  const art = n === 1 ? 'el trapecio (articulación en silla)' : n === 2 ? 'el trapezoide y el trapecio' : n === 3 ? 'el hueso grande' : n === 4 ? 'el hueso grande y el ganchoso' : 'el ganchoso'
  EXTRA[id] = extra({
    id, nombre: `Base del ${n}.${n === 1 || n === 3 ? 'er' : 'º'} metacarpiano`, participacionNota: 'Hueso de la mano: no participa en la articulación radiocarpiana; se muestra como referencia de la fila distal.',
    ubicacion: 'Extremo proximal del metacarpiano correspondiente, distal a la fila distal del carpo.',
    descripcion: `Base ensanchada que articula con ${art} en la articulación carpometacarpiana.`,
    funcion: 'Transmite la carga de los dedos al carpo y limita los movimientos de la mano; la 1.ª es la más móvil (oposición del pulgar).',
    relaciones: n === 2 ? 'Inserciones: flexor radial del carpo (cara palmar) y extensor radial largo del carpo (cara dorsal).' : n === 3 ? 'Inserción dorsal: extensor radial corto del carpo.' : n === 5 ? 'Inserción dorsal: extensor ulnar del carpo.' : 'Se relaciona con los músculos interóseos y con los tendones flexores y extensores de los dedos.',
    clinica: n === 1 ? 'Las fracturas de su base (Bennett, Rolando) son frecuentes.' : 'Su base se fractura con menos frecuencia; las luxaciones carpometacarpianas son raras.',
  }, 'Carpo')
}

export function bone3DInfo(id: BoneId): Structure {
  const sid = MAP[id]
  return sid ? STRUCTURE_BY_ID[sid] : EXTRA[id]!
}
