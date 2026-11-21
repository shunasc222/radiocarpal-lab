export type NVKind = 'arteria' | 'nervio'

export interface NVItem {
  id: string
  nombre: string
  kind: NVKind
  /** Geometría del esquema palmar (0..520 × 0..700). */
  paths: string[]
  dashed?: boolean
  /** Vista: «profundo/dorsal» se dibuja punteado y se indica en la ficha. */
  plano: string
  origen: string
  trayecto: string
  relacionMuneca: string
  /** Arterias: territorio irrigado. Nervios: resumen funcional. */
  territorio: string
  clinica: string
  /** Solo nervios: tres tipos de inervación, diferenciados. */
  motora?: string
  cutanea?: string
  articular?: string
  num: number
}

export const NV_ITEMS: NVItem[] = [
  {
    id: 'a-radial', num: 1, nombre: 'Arteria radial', kind: 'arteria', plano: 'Palmar (cruza al dorso en la tabaquera)',
    paths: ['M178 0 C176 120 174 240 168 318', 'M168 318 C158 344 140 366 124 392', 'M168 320 C164 360 152 400 158 436'],
    origen: 'Rama terminal lateral de la arteria braquial, en la fosa del codo.',
    trayecto: 'Desciende bajo el braquiorradial, en el borde lateral del antebrazo. En la muñeca pasa lateral al tendón del flexor radial del carpo y rodea la apófisis estiloides del radio para cruzar la tabaquera anatómica.',
    relacionMuneca: 'Da la rama carpiana palmar (a la red carpiana palmar), la rama palmar superficial (arco superficial) y la rama carpiana dorsal (red carpiana dorsal). Pasa al dorso bajo los tendones del abductor largo y extensor corto del pulgar y llega a la palma entre las dos cabezas del primer interóseo dorsal para formar el arco palmar profundo.',
    territorio: 'Parte lateral de la mano, pulgar, índice, escafoides (vía rama carpiana dorsal) y articulación radiocarpiana (por las redes carpianas).',
    clinica: 'Se palpa el pulso lateral al flexor radial del carpo. Sufre lesión en fracturas de escafoides y en punciones arteriales; la prueba de Allen evalúa el equilibrio con la arteria ulnar.',
  },
  {
    id: 'a-ulnar', num: 2, nombre: 'Arteria ulnar', kind: 'arteria', plano: 'Palmar',
    paths: ['M356 0 C354 120 352 240 350 320 C348 346 346 366 340 384', 'M340 386 C300 410 240 420 190 442'],
    origen: 'Rama terminal medial de la arteria braquial; da el tronco de las arterias interóseas (interósea común).',
    trayecto: 'Desciende bajo el flexor ulnar del carpo, lateral a su tendón. Pasa superficial al retináculo flexor y lateral al pisiforme por el canal de Guyon, junto con el nervio ulnar, y forma el arco palmar superficial.',
    relacionMuneca: 'Emite ramas carpianas palmar y dorsal (que contribuyen a las redes carpianas) y la rama palmar profunda, que se une al arco profundo.',
    territorio: 'Lado ulnar de la mano y dedos 3.º–5.º (arco superficial); redes carpianas ulnares.',
    clinica: 'En el canal de Guyon puede sufrir trombosis por traumatismo repetido (síndrome del martillo hipotenar), con isquemia de los dedos ulnares.',
  },
  {
    id: 'a-interosea-ant', num: 3, nombre: 'Arteria interósea anterior', kind: 'arteria', plano: 'Palmar profundo (membrana interósea)',
    paths: ['M268 40 L268 300 C268 316 262 330 258 344'], dashed: true,
    origen: 'Rama de la arteria interósea común (de la ulnar).',
    trayecto: 'Desciende sobre la cara anterior de la membrana interósea con el nervio interóseo anterior. Distalmente perfora la membrana, por encima del pronador cuadrado, y pasa al dorso.',
    relacionMuneca: 'Aporta a la red carpiana palmar (rama anterior) y a la dorsal (rama terminal), por lo que participa en la irrigación del carpo.',
    territorio: 'Músculos profundos del antebrazo; red carpiana palmar y dorsal.',
    clinica: 'Es una vía colateral entre las redes carpianas: puede mantener la perfusión carpiana si la radial o la ulnar se ocluyen.',
  },
  {
    id: 'a-interosea-post', num: 4, nombre: 'Arteria interósea posterior', kind: 'arteria', plano: 'Dorsal (se dibuja punteada)',
    paths: ['M300 60 C302 140 296 230 288 322'], dashed: true,
    origen: 'Rama de la arteria interósea común, que pasa al compartimento posterior por encima de la membrana interósea.',
    trayecto: 'Desciende entre los músculos extensores superficiales y profundos, acompañando al nervio interóseo posterior. En el cuarto compartimento se anastomosa con la interósea anterior.',
    relacionMuneca: 'Contribuye a la red carpiana dorsal.',
    territorio: 'Músculos extensores del antebrazo y red dorsal del carpo.',
    clinica: 'Es la base del colgajo interóseo posterior (pediculado) empleado en cirugía reconstructiva y una vía de anastomosis dorsal.',
  },
  {
    id: 'rete-palmar', num: 5, nombre: 'Red (arco) carpiana palmar', kind: 'arteria', plano: 'Palmar',
    paths: ['M158 352 C220 342 300 342 348 352'],
    origen: 'Anastomosis de las ramas carpianas palmares de la radial y la ulnar con la interósea anterior y ramas recurrentes del arco profundo.',
    trayecto: 'Arco anastomótico sobre la cara palmar del carpo, profundo a los tendones flexores.',
    relacionMuneca: 'Irriga la cara palmar del carpo y la cápsula articular, incluyendo las articulaciones radiocarpiana y mediocarpiana.',
    territorio: 'Huesos del carpo, cápsula y ligamentos palmares.',
    clinica: 'Mantiene la perfusión carpiana cuando una arteria principal se lesiona; es una vía de colateralidad.',
  },
  {
    id: 'rete-dorsal', num: 6, nombre: 'Red (arco) carpiana dorsal', kind: 'arteria', plano: 'Dorsal (punteada)',
    paths: ['M150 366 C220 378 300 378 352 368'], dashed: true,
    origen: 'Ramas carpianas dorsales de la radial y la ulnar y ramas terminales de las interóseas anterior y posterior.',
    trayecto: 'Arco anastomótico sobre el dorso del carpo, de donde nacen las arterias metacarpianas dorsales.',
    relacionMuneca: 'Irriga la cápsula dorsal, los ligamentos dorsales y gran parte del escafoides, el semilunar y el piramidal, por vasos que penetran en el hueso.',
    territorio: 'Cara dorsal del carpo, cápsula, ligamentos dorsales y metacarpianas dorsales.',
    clinica: 'Su preservación importa en los abordajes dorsales; las ramas óseas son vulnerables en la cirugía del carpo.',
  },
  {
    id: 'n-mediano', num: 7, nombre: 'Nervio mediano', kind: 'nervio', plano: 'Palmar (túnel del carpo)',
    paths: ['M262 0 L262 340 L258 394', 'M258 394 C246 440 238 490 232 540', 'M258 394 C262 440 266 490 270 540', 'M258 394 C230 420 210 436 190 444'],
    origen: 'Cordones lateral y medial del plexo braquial (C5–T1).',
    trayecto: 'Desciende entre el flexor superficial y el profundo de los dedos. En la muñeca pasa profundo al retináculo flexor, por el túnel del carpo, entre los tendones del flexor radial del carpo y el palmar largo.',
    relacionMuneca: 'La rama cutánea palmar nace unos 5–7 cm proximal a la muñeca y pasa superficial al retináculo; por eso la sensibilidad de la eminencia tenar no se altera en el síndrome del túnel carpiano.',
    territorio: 'Músculos flexores del antebrazo (menos flexor ulnar del carpo y la mitad ulnar del flexor profundo); eminencia tenar; piel palmar de pulgar, índice, medio y mitad radial del anular.',
    clinica: 'Su compresión en el túnel del carpo produce parestesias nocturnas, signo de Tinel y Phalen positivos y, tardíamente, atrofia tenar. Es la lesión por compresión más frecuente del miembro superior.',
    motora: 'Flexor radial del carpo y palmar largo (acción en la muñeca); flexor superficial; con el interóseo anterior: flexor largo del pulgar, mitad radial del flexor profundo y pronador cuadrado. En la mano: eminencia tenar (rama recurrente) y lumbricales 1.º–2.º.',
    cutanea: 'Rama cutánea palmar (eminencia tenar) y ramas digitales palmares de pulgar, índice, medio y mitad radial del anular.',
    articular: 'No es el nervio articular principal; el ramo articular de la cara palmar de la muñeca suele provenir de su rama interósea anterior (ver nervio interóseo anterior).',
  },
  {
    id: 'n-interoseo-ant', num: 8, nombre: 'Nervio interóseo anterior', kind: 'nervio', plano: 'Palmar profundo (membrana interósea)',
    paths: ['M244 34 L244 300 C244 318 240 334 236 346'], dashed: true,
    origen: 'Rama del nervio mediano en la fosa del codo.',
    trayecto: 'Desciende sobre la membrana interósea junto con la arteria homónima, profundo a los flexores; termina bajo el pronador cuadrado.',
    relacionMuneca: 'Su rama terminal sensitiva se describe en estudios anatómicos como el principal aporte a la cápsula palmar de la muñeca.',
    territorio: 'Flexor largo del pulgar, flexor profundo (índice y medio), pronador cuadrado y cápsula palmar de la muñeca.',
    clinica: 'Su lesión causa debilidad de la pinza («signo de OK» alterado) sin déficit cutáneo, ya que carece de sensibilidad cutánea.',
    motora: 'Flexor largo del pulgar, mitad radial del flexor profundo de los dedos y pronador cuadrado.',
    cutanea: 'No tiene territorio cutáneo.',
    articular: 'Rama terminal articular a la cara palmar de la articulación radiocarpiana y del carpo (documentada en series anatómicas).',
  },
  {
    id: 'n-radial-sup', num: 9, nombre: 'Nervio radial (rama superficial)', kind: 'nervio', plano: 'Dorsal (punteado)',
    paths: ['M150 40 C148 140 150 220 146 300 C140 330 118 350 98 372'], dashed: true,
    origen: 'Rama terminal sensitiva del nervio radial (C5–T1), a nivel del codo.',
    trayecto: 'Desciende bajo el braquiorradial y, unos 7 cm proximales a la muñeca, emerge hacia el dorso. Cruza superficialmente los tendones de la tabaquera anatómica.',
    relacionMuneca: 'Es susceptible a compresión por férulas o pulseras (síndrome de Wartenberg) y a lesiones en abordajes del borde radial de la muñeca.',
    territorio: 'Piel de la cara dorsal-radial de la mano, dorso del pulgar y, en general, de la cara dorsal de la mitad radial de los dedos.',
    clinica: 'Su lesión causa parestesias y dolor dorsal-radial sin debilidad muscular.',
    motora: 'No tiene función motora.',
    cutanea: 'Dorso de la mano (lado radial), dorso del pulgar y los dos dedos y medio siguientes (hasta las interfalángicas proximales).',
    articular: 'Puede aportar ramos a la cápsula radial; el aporte es variable.',
  },
  {
    id: 'n-interoseo-post', num: 10, nombre: 'Nervio interóseo posterior (rama profunda del radial)', kind: 'nervio', plano: 'Dorsal profundo (punteado)',
    paths: ['M214 40 L214 250 C214 290 210 316 206 336'], dashed: true,
    origen: 'Rama profunda del nervio radial; atraviesa el músculo supinador.',
    trayecto: 'Desciende entre los músculos extensores superficiales y profundos y, distalmente, apoya sobre la membrana interósea en el suelo del cuarto compartimento extensor.',
    relacionMuneca: 'Su rama terminal se describe como el principal aporte a la cápsula dorsal de la muñeca; por eso se emplea en la neurectomía para el dolor dorsal crónico.',
    territorio: 'Extensores del antebrazo (excepto extensor radial largo y braquiorradial) y cápsula dorsal de la muñeca.',
    clinica: 'Su lesión produce caída de los dedos (sin caída de la muñeca, porque el extensor radial largo se conserva; la muñeca se desvía radialmente al extenderse).',
    motora: 'Extensor radial corto del carpo (en general), extensor ulnar del carpo, extensor de los dedos, extensor del meñique, abductor largo, extensor corto y largo del pulgar y extensor del índice.',
    cutanea: 'Sin territorio cutáneo propio.',
    articular: 'Rama terminal propioceptiva y sensitiva a la cápsula dorsal radiocarpiana y carpiana.',
  },
  {
    id: 'n-ulnar', num: 11, nombre: 'Nervio ulnar', kind: 'nervio', plano: 'Palmar (canal de Guyon)',
    paths: ['M344 20 C346 120 348 240 350 330 C352 352 344 380 338 396', 'M338 396 C320 420 300 440 276 452', 'M338 396 C366 440 376 500 380 560', 'M350 240 C372 280 392 320 402 374'],
    origen: 'Cordón medial del plexo braquial (C8–T1).',
    trayecto: 'Desciende junto con la arteria ulnar, bajo el flexor ulnar del carpo. Pasa superficial al retináculo flexor y lateral al pisiforme por el canal de Guyon. Antes de la muñeca da la rama dorsal, que rodea la estiloides ulnar.',
    relacionMuneca: 'Su rama cutánea dorsal nace unos 5–8 cm proximales a la muñeca; la rama profunda inerva los músculos hipotenares, interóseos y lumbricales mediales.',
    territorio: 'Flexor ulnar del carpo, mitad ulnar del flexor profundo, músculos intrínsecos de la mano (rama profunda) y piel del lado ulnar.',
    clinica: 'Su compresión en el canal de Guyon produce debilidad de intrínsecos y parestesias del 5.º dedo («mano en garra ulnar» en lesiones más proximales).',
    motora: 'Flexor ulnar del carpo (acción en la muñeca) y mitad ulnar del flexor profundo. Rama profunda: hipotenares, interóseos, lumbricales 3.º–4.º, aductor del pulgar.',
    cutanea: 'Rama dorsal: dorso de la mano medial y 1,5 dedos; rama palmar superficial: 5.º dedo y mitad ulnar del anular.',
    articular: 'Ramas articulares del lado ulnar descritas con menor constancia (rama dorsal y profunda); su contribución es variable.',
  },
  {
    id: 'n-articulares', num: 12, nombre: 'Ramos articulares de la muñeca (síntesis)', kind: 'nervio', plano: 'Esquema de síntesis',
    paths: ['M196 350 C240 356 300 356 340 350'], dashed: true,
    origen: 'Ramas sensitivas de nervios vecinos: interóseo posterior (dorsal) e interóseo anterior (palmar), con aportes variables de radial superficial, ulnar y cutáneo antebraquial lateral.',
    trayecto: 'No existe un nervio «propio» de la articulación radiocarpiana: la cápsula recibe ramas finas de nervios que atraviesan la región.',
    relacionMuneca: 'La inervación articular es multisegmentaria y variable. El mejor documentado es el aporte del interóseo posterior (dorsal) y del anterior (palmar).',
    territorio: 'Cápsula, ligamentos y disco articular (periferia). El centro del disco es avascular y casi no tiene inervación.',
    clinica: 'Fundamento de las neurectomías selectivas para el dolor crónico de la muñeca, y de la propiocepción ligamentosa en la estabilidad.',
    motora: 'No aplica.',
    cutanea: 'No aplica.',
    articular: 'Ver cada nervio: no todos inervan la cápsula radiocarpiana de la misma manera.',
  },
]

export const NV_BY_ID: Record<string, NVItem> = Object.fromEntries(NV_ITEMS.map((n) => [n.id, n]))

export const SCAPHOID_VASC = {
  titulo: 'Irrigación del escafoides y vulnerabilidad del polo proximal',
  puntos: [
    'La mayor parte de la irrigación (≈ 70–80 %, incluido todo el polo proximal) llega por ramas de la arteria radial que entran en el hueso por su cresta dorsal, distalmente a la cintura.',
    'Una parte menor (≈ 20–30 %, región del tubérculo) proviene de ramas palmares de la arteria radial.',
    'El flujo hacia el polo proximal es retrógrado e intraóseo: no hay vasos que penetren directamente en ese polo, que está casi totalmente cubierto de cartílago.',
    'Si la fractura cruza la cintura o el polo proximal, la irrigación del fragmento proximal se interrumpe: riesgo de necrosis avascular y de pseudoartrosis.',
  ],
  nota: 'Los porcentajes son orientativos y proceden de series anatómicas; se citan como orden de magnitud.',
}
