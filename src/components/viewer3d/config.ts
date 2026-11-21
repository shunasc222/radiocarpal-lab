import { CENTROID } from '../../data/landmarks3d'

export type LayerId = 'osteologia' | 'superficies' | 'ligamentos' | 'miologia' | 'neurovascular'
export type ViewName = 'inicial' | 'palmar' | 'dorsal' | 'radial' | 'ulnar'

export interface LayerDef { id: LayerId; n: number; nombre: string; corto: string; descripcion: string; color: string }
export const LAYERS: LayerDef[] = [
  { id: 'osteologia', n: 1, nombre: 'Osteología', corto: 'Huesos', descripcion: 'Radio y ulna distales, 8 huesos del carpo y bases metacarpianas.', color: '#dccdaa' },
  { id: 'superficies', n: 2, nombre: 'Superficies articulares', corto: 'Superficies', descripcion: 'Cartílago del radio, la ulna y la fila proximal del carpo; disco articular.', color: '#79b5e0' },
  { id: 'ligamentos', n: 3, nombre: 'Ligamentos', corto: 'Ligamentos', descripcion: 'Radiocarpianos, ulnocarpianos, colaterales, intercarpianos y retináculo flexor.', color: 'linear-gradient(135deg,#f2c4d4 0%,#f7f3ea 50%,#bcd6ea 100%)' },
  { id: 'miologia', n: 4, nombre: 'Miología', corto: 'Músculos', descripcion: 'Músculos y tendones motores de la muñeca.', color: '#a8403f' },
  { id: 'neurovascular', n: 5, nombre: 'Vasos y nervios', corto: 'Vasos/nervios', descripcion: 'Arterias, venas y nervios principales (didáctico).', color: 'linear-gradient(135deg,#cf2f2f 0 34%,#f0c53a 34% 67%,#3a6fc0 67%)' },
]

export const BONE_IDS = ['radio', 'ulna', 'escafoides', 'semilunar', 'piramidal', 'pisiforme', 'trapecio', 'trapezoide', 'hueso_grande', 'ganchoso', 'mc1', 'mc2', 'mc3', 'mc4', 'mc5'] as const
export type BoneId = (typeof BONE_IDS)[number]

export const BONE_NAME: Record<BoneId, string> = {
  radio: 'Radio distal', ulna: 'Ulna distal', escafoides: 'Escafoides', semilunar: 'Semilunar', piramidal: 'Piramidal', pisiforme: 'Pisiforme',
  trapecio: 'Trapecio', trapezoide: 'Trapezoide', hueso_grande: 'Hueso grande', ganchoso: 'Ganchoso',
  mc1: '1.er metacarpiano (base)', mc2: '2.º metacarpiano (base)', mc3: '3.er metacarpiano (base)', mc4: '4.º metacarpiano (base)', mc5: '5.º metacarpiano (base)',
}
export const BONE_GROUP: Record<BoneId, 'antebrazo' | 'proximal' | 'distal' | 'metacarpo'> = {
  radio: 'antebrazo', ulna: 'antebrazo', escafoides: 'proximal', semilunar: 'proximal', piramidal: 'proximal', pisiforme: 'proximal',
  trapecio: 'distal', trapezoide: 'distal', hueso_grande: 'distal', ganchoso: 'distal', mc1: 'metacarpo', mc2: 'metacarpo', mc3: 'metacarpo', mc4: 'metacarpo', mc5: 'metacarpo',
}

export const VIEWS: Record<ViewName, [number, number, number]> = {
  inicial: [7, 4, 20.5], palmar: [0, 1, 21.5], dorsal: [0, 1, -21.5], radial: [-21.5, 1, 0], ulnar: [21.5, 1, 0],
}
export const TARGET: [number, number, number] = [-0.6, 0.6, 0.1]

/** Desplazamiento de «separar estructuras» de cada hueso (cm a explosión = 1). */
export function explodeOffset(id: BoneId): [number, number, number] {
  const c = (CENTROID as Record<string, readonly number[]>)[id]
  const dx = (c[0] + 0.5) * 0.9
  let dy = (c[1] + 1.8) * 1.0
  let dz = (c[2] - 0.1) * 0.9
  if (id === 'radio') { dy = 2.6; dz = -0.6 }
  if (id === 'ulna') { dy = 2.6; dz = -0.6 }
  return [dx, dy, dz]
}

/** Colores anatómicos realistas. */
export const COLORS = {
  bone: '#dccdaa', cartilage: '#79b5e0', disc: '#8dc0e6', ligament: '#f3efe4', tendon: '#f7ede2', muscle: '#a8403f',
  artery: '#cf2f2f', vein: '#3a6fc0', nerve: '#f0c53a', retinaculum: '#efe6d2', select: '#7a64a3', outline: '#5f533f',
}
