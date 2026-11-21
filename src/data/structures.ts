/**
 * Estructuras óseas y articulares del atlas (osteología y superficies).
 * Contenido redactado a partir de conocimiento anatómico establecido; ver bibliografía.
 */
export type Participation = 'directa' | 'relacionada'

export interface Structure {
  id: string
  num: number
  nombre: string
  grupo: 'Radio' | 'Ulna' | 'Carpo' | 'Partes blandas'
  participacion: Participation
  /** Texto breve que explica el tipo de participación en la articulación. */
  participacionNota: string
  ubicacion: string
  descripcion: string
  funcion: string
  relaciones: string
  clinica: string
  /** Pista anatómica (sin nombrar la estructura) para el modo de autoevaluación. */
  pista: string
  /** Si es una agrupación, ids que se resaltan junto con ella. */
  hijos?: string[]
  /** Aparece como zona seleccionable en el esquema (false = solo en la lista). */
  enEsquema: boolean
}

export const STRUCTURES: Structure[] = [
  {
    id: 'radio-distal', num: 1, nombre: 'Radio distal', grupo: 'Radio', participacion: 'directa',
    participacionNota: 'Forma la mayor parte de la superficie proximal (antebraquial) de la articulación radiocarpiana.',
    ubicacion: 'Extremo distal del hueso lateral del antebrazo, en el lado del pulgar.',
    descripcion: 'Epífisis ensanchada, de sección cuadrangular, con cara distal articular (carpiana), apófisis estiloides lateral, escotadura ulnar medial y un tubérculo dorsal (de Lister) que separa surcos para tendones extensores.',
    funcion: 'Recibe y transmite al antebrazo la mayor parte de la carga que viene de la mano (se suele citar en torno al 80 % cuando la ulna tiene longitud neutra).',
    relaciones: 'Distal: escafoides y semilunar. Medial: cabeza de la ulna (articulación radioulnar distal) y disco articular. Dorsal: tendones extensores. Palmar: pronador cuadrado y tendones flexores.',
    clinica: 'Su extremo distal es uno de los sitios de fractura más frecuentes del miembro superior tras una caída sobre la mano extendida (fractura distal del radio; tipo Colles en el adulto mayor).',
    pista: 'Hueso lateral del antebrazo; su extremo distal se ensancha y su cara inferior está inclinada hacia el lado ulnar.',
    enEsquema: true,
  },
  {
    id: 'estiloides-radio', num: 2, nombre: 'Apófisis estiloides del radio', grupo: 'Radio', participacion: 'directa',
    participacionNota: 'Prolongación lateral de la superficie articular; punto de anclaje del ligamento colateral radial.',
    ubicacion: 'Prolongación cónica del borde lateral del radio distal; se palpa en la base del pulgar.',
    descripcion: 'Proyección distal más larga que la estiloides ulnar. En su base se inserta el tendón del braquiorradial y, en su vértice, el ligamento colateral radial del carpo.',
    funcion: 'Ancla el ligamento colateral radial y limita la desviación radial al contactar con el escafoides; su mayor longitud explica que la desviación ulnar sea más amplia que la radial.',
    relaciones: 'Tabaquera anatómica: tendones del abductor largo y extensor corto del pulgar (lateral); arteria radial pasa en profundidad. Escafoides en su cara distal.',
    clinica: 'Su fractura aislada (fractura de Chauffeur) puede asociarse a lesiones ligamentosas del carpo; es sitio de tenosinovitis de De Quervain en su vecindad.',
    pista: 'Punta ósea más lateral y distal de la muñeca; se palpa en la base del pulgar.',
    enEsquema: true,
  },
  {
    id: 'superficie-articular', num: 3, nombre: 'Superficie articular carpiana del radio', grupo: 'Radio', participacion: 'directa',
    participacionNota: 'Es la parte ósea de la superficie proximal; se completa con el disco articular.',
    ubicacion: 'Cara distal del radio, cóncava en ambos ejes e inclinada hacia ulnar (≈ 22° en la proyección frontal) y hacia palmar (≈ 11° en la lateral).',
    descripcion: 'Superficie triangular cubierta de cartílago hialino, dividida por la cresta interfacetaria en dos fositas: escafoidea (lateral) y semilunar (medial).',
    funcion: 'Constituye, junto con el disco articular, la cavidad (superficie antebraquial) en la que se mueve el cóndilo carpiano.',
    relaciones: 'Se continúa medialmente con el disco articular, que prolonga la superficie hasta la estiloides ulnar. Está rodeada por la cápsula y los ligamentos radiocarpianos.',
    clinica: 'Las fracturas intraarticulares del radio distal alteran esta superficie; un escalón mayor de 1–2 mm se asocia a artrosis postraumática. Pérdida de inclinación = alteración de la carga carpiana.',
    pista: 'Superficie cóncava, cubierta de cartílago, que recibe a los huesos de la fila proximal del carpo.',
    hijos: ['fosita-escafoidea', 'fosita-semilunar', 'cresta-interfacetaria'],
    enEsquema: false,
  },
  {
    id: 'fosita-escafoidea', num: 4, nombre: 'Fosita escafoidea', grupo: 'Radio', participacion: 'directa',
    participacionNota: 'Faceta lateral de la superficie articular del radio.',
    ubicacion: 'Mitad lateral de la cara articular carpiana del radio, junto a la estiloides.',
    descripcion: 'Faceta triangular, cóncava, para el polo proximal del escafoides.',
    funcion: 'Recibe al escafoides; transmite al radio la carga que pasa por la columna radial del carpo (trapecio–trapezoide–escafoides).',
    relaciones: 'Medial: cresta interfacetaria. Lateral: base de la estiloides radial. Distal: escafoides.',
    clinica: 'Es la faceta más cargada en la caída sobre la mano extendida; su fractura (fractura de la estiloides o de la faceta escafoidea) compromete la congruencia con el escafoides.',
    pista: 'Faceta lateral de la cara distal del radio, la más cercana a la estiloides.',
    enEsquema: true,
  },
  {
    id: 'fosita-semilunar', num: 5, nombre: 'Fosita semilunar', grupo: 'Radio', participacion: 'directa',
    participacionNota: 'Faceta medial de la superficie articular del radio.',
    ubicacion: 'Mitad medial de la cara articular carpiana del radio, junto a la escotadura ulnar.',
    descripcion: 'Faceta cuadrangular, cóncava, para el semilunar; más palmar y dorsalmente definida por los bordes del radio.',
    funcion: 'Recibe al semilunar; el semilunar también se apoya parcialmente en el disco articular.',
    relaciones: 'Lateral: cresta interfacetaria. Medial: inserción del disco articular. Palmar y dorsal: bordes donde se anclan los ligamentos radiocarpianos.',
    clinica: 'El fragmento palmar-medial (fragmento «en sacabocados» o die-punch) es clave en las fracturas intraarticulares: arrastrado por los ligamentos radiolunares, puede desplazarse con el semilunar.',
    pista: 'Faceta medial de la cara distal del radio, junto al disco articular.',
    enEsquema: true,
  },
  {
    id: 'cresta-interfacetaria', num: 6, nombre: 'Cresta interfacetaria radial', grupo: 'Radio', participacion: 'directa',
    participacionNota: 'Reborde óseo que separa las dos fositas articulares del radio.',
    ubicacion: 'Reborde romo, anteroposterior, entre las fositas escafoidea y semilunar.',
    descripcion: 'Cresta roma y poco prominente que corresponde a la zona donde se alinea la unión escafolunar del carpo.',
    funcion: 'Separa las dos facetas; en su vértice y alrededor se fijan fibras del ligamento radioescafosemilunar (de Testut y Kuentz).',
    relaciones: 'Está enfrentada al ligamento escafolunar interóseo cuando la muñeca está en posición neutra.',
    clinica: 'Un trazo de fractura que atraviesa la cresta divide el radio en fragmentos escafoideo y semilunar («fractura en T/Y»), lo que obliga a restaurar ambas facetas por separado.',
    pista: 'Pequeña elevación entre dos concavidades de la cara distal del radio.',
    enEsquema: true,
  },
  {
    id: 'escotadura-ulnar', num: 7, nombre: 'Escotadura ulnar del radio', grupo: 'Radio', participacion: 'relacionada',
    participacionNota: 'Pertenece a la articulación radioulnar distal; en su borde inferior nace el disco articular.',
    ubicacion: 'Concavidad vertical del borde medial del radio distal, orientada hacia la ulna.',
    descripcion: 'Superficie cartilaginosa cóncava en la que rota la circunferencia articular de la cabeza de la ulna durante la pronosupinación.',
    funcion: 'Forma la parte radial de la articulación radioulnar distal (trocoide). En su borde distal se inserta el disco articular.',
    relaciones: 'Medial: cabeza de la ulna. Distal: base del disco articular y superficie articular del radio.',
    clinica: 'Su incongruencia tras una fractura o una ulna mal alineada limita la pronosupinación y causa inestabilidad radioulnar distal.',
    pista: 'Concavidad vertical en el borde medial del radio, en contacto con la cabeza de la ulna.',
    enEsquema: true,
  },
  {
    id: 'ulna-distal', num: 8, nombre: 'Ulna distal y cabeza de la ulna', grupo: 'Ulna', participacion: 'relacionada',
    participacionNota: 'No contacta con el carpo: la separa el disco articular. Pertenece a la articulación radioulnar distal.',
    ubicacion: 'Extremo distal del hueso medial del antebrazo.',
    descripcion: 'Cabeza redondeada con circunferencia articular y una cara distal («polo») cubierta de cartílago que se apoya sobre el disco articular. Un surco posterior aloja al tendón del extensor ulnar del carpo.',
    funcion: 'Pivote estable alrededor del cual rota el radio en pronosupinación; transmite al disco una fracción menor de la carga.',
    relaciones: 'Lateral: escotadura ulnar del radio. Distal: disco articular (la ulna NO articula directamente con los huesos del carpo). Dorsal: surco del extensor ulnar del carpo.',
    clinica: 'Una ulna relativamente larga (varianza ulnar positiva) sobrecarga el disco y el semilunar: síndrome de impactación ulnocarpiana.',
    pista: 'Extremo redondeado del hueso medial del antebrazo, separado del carpo por un fibrocartílago.',
    enEsquema: true,
  },
  {
    id: 'estiloides-ulnar', num: 9, nombre: 'Apófisis estiloides de la ulna', grupo: 'Ulna', participacion: 'relacionada',
    participacionNota: 'Punto de anclaje del complejo fibrocartilaginoso triangular y del ligamento colateral ulnar.',
    ubicacion: 'Prolongación posteromedial de la cabeza de la ulna.',
    descripcion: 'Saliente cónico más corto que la estiloides radial. En su base (fóvea ulnar) se insertan las fibras profundas de los ligamentos radioulnares del disco.',
    funcion: 'Ancla el vértice del disco articular y el sistema colateral ulnar; centro de la estabilidad del lado ulnar.',
    relaciones: 'Lateral: disco articular. Dorsal: tendón del extensor ulnar del carpo. Distal: triquetrum (sin contacto articular directo).',
    clinica: 'Su fractura, sobre todo si afecta la base, puede acompañar a fracturas distales del radio e indicar compromiso del complejo fibrocartilaginoso triangular y de la estabilidad radioulnar distal.',
    pista: 'Pequeña punta ósea en el lado medial de la muñeca, detrás de la cabeza de la ulna.',
    enEsquema: true,
  },
  {
    id: 'disco', num: 10, nombre: 'Disco articular (fibrocartílago triangular)', grupo: 'Partes blandas', participacion: 'directa',
    participacionNota: 'Completa la superficie proximal: separa la ulna de los huesos del carpo y articula con semilunar y piramidal.',
    ubicacion: 'Entre el borde distal de la cabeza de la ulna y los huesos semilunar y piramidal; se extiende desde el radio hasta la base de la estiloides ulnar.',
    descripcion: 'Lámina fibrocartilaginosa bicóncava, delgada en su centro y más gruesa en la periferia, anclada al radio (base de la escotadura ulnar) y a la fóvea de la ulna. Es el núcleo del complejo fibrocartilaginoso triangular (TFCC).',
    funcion: 'Amortigua la carga ulnocarpiana, prolonga la superficie articular del radio, estabiliza la radioulnar distal y evita el contacto directo entre ulna y carpo.',
    relaciones: 'Proximal: cabeza de la ulna. Distal: semilunar y piramidal. Su periferia se une a los ligamentos radioulnares palmar y dorsal, a la vaina del extensor ulnar del carpo y al ligamento colateral ulnar.',
    clinica: 'Sus desgarros traumáticos (periféricos, mejor irrigados) o degenerativos (centrales, avasculares) causan dolor ulnar, chasquido y limitación en la desviación ulnar con carga.',
    pista: 'Lámina fibrocartilaginosa delgada que separa la ulna del carpo.',
    enEsquema: true,
  },
  {
    id: 'escafoides', num: 11, nombre: 'Escafoides', grupo: 'Carpo', participacion: 'directa',
    participacionNota: 'Su cara proximal convexa articula con la fosita escafoidea del radio.',
    ubicacion: 'Hueso más lateral de la fila proximal; forma el suelo de la tabaquera anatómica.',
    descripcion: 'Hueso alargado y oblicuo con polo proximal, cintura y tubérculo distal palmar (palpable). Casi el 80 % de su superficie está cubierta de cartílago.',
    funcion: 'Puente mecánico entre las dos filas del carpo: estabiliza el movimiento acoplado entre la fila proximal y la distal.',
    relaciones: 'Proximal: fosita escafoidea del radio. Medial: semilunar (ligamento escafolunar interóseo) y hueso grande. Distal: trapecio y trapezoide. Dorsal-radial: arteria radial en la tabaquera.',
    clinica: 'Hueso carpiano más fracturado. Irrigación retrógrada: el polo proximal es vulnerable a necrosis avascular y pseudoartrosis. La fractura puede no verse en la radiografía inicial.',
    pista: 'Hueso en forma de barco alargado; su tubérculo se palpa en la base de la eminencia tenar.',
    enEsquema: true,
  },
  {
    id: 'semilunar', num: 12, nombre: 'Semilunar', grupo: 'Carpo', participacion: 'directa',
    participacionNota: 'Su cara proximal articula con la fosita semilunar del radio y, parcialmente, con el disco articular.',
    ubicacion: 'Hueso central de la fila proximal, entre escafoides y piramidal.',
    descripcion: 'Hueso en media luna con cara proximal convexa y cara distal cóncava para la cabeza del hueso grande; más ancho en su porción palmar.',
    funcion: 'Es el «hueso clave» de la columna central: transmite la carga del hueso grande al radio y actúa como segmento intercalado entre ambas filas.',
    relaciones: 'Lateral: escafoides. Medial: piramidal. Proximal: fosita semilunar y disco. Distal: cabeza del hueso grande (y ganchoso según la posición).',
    clinica: 'Su luxación y la enfermedad de Kienböck (necrosis avascular) son causas de dolor central de la muñeca; con insuficiencia de ligamentos adyacentes se alinea en inclinación dorsal (DISI) o palmar (VISI).',
    pista: 'Hueso en forma de luna creciente, en el centro de la primera fila del carpo.',
    enEsquema: true,
  },
  {
    id: 'piramidal', num: 13, nombre: 'Piramidal (triquetrum)', grupo: 'Carpo', participacion: 'directa',
    participacionNota: 'Participa sobre todo en la desviación ulnar, cuando entra en contacto con el disco articular.',
    ubicacion: 'Hueso más medial de la fila proximal, debajo de la estiloides ulnar.',
    descripcion: 'Hueso piramidal con cara proximal convexa y una carilla palmar para el pisiforme.',
    funcion: 'Se desplaza bajo el ganchoso en un plano helicoidal durante la desviación; transmite carga al disco articular.',
    relaciones: 'Lateral: semilunar (ligamento lunopiramidal interóseo). Distal: ganchoso. Palmar: pisiforme. Proximal: disco articular (no contacta con el radio en posición neutra).',
    clinica: 'Es el segundo hueso carpiano más fracturado (fracturas por avulsión dorsal). La lesión del ligamento lunopiramidal produce dolor ulnar e inestabilidad.',
    pista: 'Hueso piramidal del lado ulnar de la primera fila; en su cara palmar se apoya un hueso sesamoideo.',
    enEsquema: true,
  },
  {
    id: 'pisiforme', num: 14, nombre: 'Pisiforme', grupo: 'Carpo', participacion: 'relacionada',
    participacionNota: 'Estructura vecina: no forma parte de la superficie articular radiocarpiana.',
    ubicacion: 'Sobre la cara palmar del piramidal, en la base de la eminencia hipotenar.',
    descripcion: 'Hueso sesamoideo pequeño y redondeado, incluido en el tendón del flexor ulnar del carpo. Articula únicamente con el piramidal.',
    funcion: 'Aumenta el brazo de palanca del flexor ulnar del carpo y sirve de punto de anclaje a los ligamentos pisoganchoso y pisometacarpiano.',
    relaciones: 'Medial al canal de Guyon: la arteria y el nervio ulnares pasan lateral a él. Dorsal: piramidal.',
    clinica: 'Palpable en la cara palmar-medial de la muñeca; fracturas o artrosis pisopiramidal dan dolor ulnar palmar. Referencia para localizar el nervio ulnar.',
    pista: 'Pequeño hueso redondo palpable en la base del lado medial de la palma.',
    enEsquema: true,
  },
]

export const STRUCTURE_BY_ID: Record<string, Structure> = Object.fromEntries(STRUCTURES.map((s) => [s.id, s]))

/** Textos de las superficies articulares (sección 7.2 del atlas). */
export const SURFACES = {
  proximal: {
    titulo: 'Superficie proximal o antebraquial',
    texto: 'Formada por la cara articular carpiana del radio distal (fositas escafoidea y semilunar) y por la superficie distal del disco articular. Es una superficie cóncava en ambos ejes.',
  },
  distal: {
    titulo: 'Superficie distal o carpiana',
    texto: 'Integrada por las superficies proximales convexas del escafoides, el semilunar y el piramidal, unidas entre sí por los ligamentos interóseos escafolunar y lunopiramidal, de modo que actúan como un solo cóndilo.',
  },
  nota: 'El contacto de cada hueso con la superficie proximal varía con la posición de la muñeca: en neutro el escafoides y el semilunar contactan con el radio, mientras que el piramidal se relaciona con el disco, sobre todo en desviación ulnar.',
  ulna: 'La ulna NO contacta directamente con los huesos del carpo en la articulación radiocarpiana normal: el disco articular se interpone entre ambos.',
}
