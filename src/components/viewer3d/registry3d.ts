import { COLORS } from './config'

export const MUSCLE3D_NAME: Record<string, string> = {
  ecrl: 'Extensor radial largo del carpo', ecrb: 'Extensor radial corto del carpo', ecu: 'Extensor ulnar del carpo', fcr: 'Flexor radial del carpo', pl: 'Palmar largo', fcu: 'Flexor ulnar del carpo (esquema)',
}
export const LIG_COLOR: Record<string, string> = {
  radiocarpiano: '#eeb2c7', ulnocarpiano: '#c2b0e6', colateral: '#a6c9e8', intercarpiano: '#b5dba6', radioulnar: '#ebd085',
}
export const NV_COLOR = (id: string) => (id.startsWith('a-') ? COLORS.artery : id.startsWith('v-') ? COLORS.vein : COLORS.nerve)

export const ELEMENT_NAME: Record<string, string> = {
  rsc: 'Radioescafocapitado', lrl: 'Radiolunar largo', srl: 'Radiolunar corto', rsl: 'Radioescafosemilunar', ulnolunar: 'Ulnolunar', ulnotriquetral: 'Ulnotriquetral', ulnocapitado: 'Ulnocapitado',
  'radiocarpiano-dorsal': 'Radiocarpiano dorsal', 'intercarpiano-dorsal': 'Intercarpiano dorsal', 'colateral-radial': 'Colateral radial', 'colateral-ulnar': 'Colateral ulnar',
  escafolunar: 'Escafolunar interóseo', lunopiramidal: 'Lunopiramidal interóseo', radioulnares: 'Radioulnares distales', retinaculo: 'Retináculo flexor', membrana: 'Membrana interósea',
  'a-radial': 'Arteria radial', 'a-ulnar': 'Arteria ulnar', 'a-interosea-ant': 'A. interósea anterior', 'a-interosea-post': 'A. interósea posterior',
  'n-mediano': 'Nervio mediano', 'n-ulnar': 'Nervio ulnar', 'n-radial-sup': 'N. radial (superficial)', 'n-interoseo-ant': 'N. interóseo anterior', 'n-interoseo-post': 'N. interóseo posterior',
  'v-cefalica': 'Vena cefálica', 'v-basilica': 'Vena basílica', disco: 'Disco articular', fcu: 'Flexor ulnar del carpo (esquema)',
}
