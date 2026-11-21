export type QCategory = 'osteologia' | 'ligamentos' | 'miologia' | 'neurovascular' | 'clinica'

export interface Question {
  id: string
  categoria: QCategory
  /** Pregunta con viñeta clínica (se usa en la evaluación clínica). */
  aplicada?: boolean
  enunciado: string
  opciones: [string, string, string, string]
  correcta: 0 | 1 | 2 | 3
  /** Justificación de la respuesta correcta. */
  justificacion: string
  /** Explicación del error de cada alternativa incorrecta (cadena vacía en la correcta). */
  errores: [string, string, string, string]
}

export const CATEGORY_LABEL: Record<QCategory, string> = {
  osteologia: 'Osteología y superficies',
  ligamentos: 'Ligamentos',
  miologia: 'Miología y biomecánica',
  neurovascular: 'Vascularización e inervación',
  clinica: 'Correlaciones clínicas',
}

export const QUESTIONS: Question[] = [
  // ───────── Osteología y superficies (5)
  {
    id: 'o1', categoria: 'osteologia',
    enunciado: '¿Qué huesos integran la superficie distal (carpiana) de la articulación radiocarpiana?',
    opciones: ['Escafoides, semilunar y piramidal', 'Escafoides, trapecio y trapezoide', 'Semilunar, piramidal y ganchoso', 'Escafoides, semilunar y hueso grande'],
    correcta: 0,
    justificacion: 'El cóndilo carpiano está formado por las superficies proximales del escafoides, el semilunar y el piramidal, unidos por los ligamentos interóseos.',
    errores: ['', 'El trapecio y el trapezoide pertenecen a la fila distal y participan en la mediocarpiana.', 'El ganchoso es de la fila distal.', 'El hueso grande es de la fila distal; su cabeza se aloja en la mediocarpiana.'],
  },
  {
    id: 'o2', categoria: 'osteologia',
    enunciado: '¿Qué estructura separa la cabeza de la ulna de los huesos del carpo?',
    opciones: ['La cápsula articular', 'El disco articular (complejo fibrocartilaginoso triangular)', 'El ligamento colateral ulnar', 'La membrana interósea'],
    correcta: 1,
    justificacion: 'El disco articular se interpone entre la cabeza de la ulna y el semilunar/piramidal; la ulna no contacta directamente con el carpo.',
    errores: ['La cápsula envuelve la articulación pero no es la superficie que separa los huesos.', '', 'El ligamento colateral ulnar refuerza el lado medial; no es un disco interpuesto.', 'La membrana interósea une radio y ulna en la diáfisis, lejos del carpo.'],
  },
  {
    id: 'o3', categoria: 'osteologia',
    enunciado: 'La cresta interfacetaria del radio separa…',
    opciones: ['La fosita semilunar y la escotadura ulnar', 'La apófisis estiloides y el tubérculo dorsal', 'Las fositas escafoidea y semilunar', 'El radio y la ulna'],
    correcta: 2,
    justificacion: 'Es el reborde romo que divide la superficie articular carpiana en las fositas escafoidea (lateral) y semilunar (medial).',
    errores: ['La escotadura ulnar es una superficie de la radioulnar distal, no parte de la cresta.', 'La estiloides y el tubérculo dorsal son relieves óseos distintos y no se separan por esta cresta.', '', 'La separación entre radio y ulna es la articulación radioulnar distal, no la cresta.'],
  },
  {
    id: 'o4', categoria: 'osteologia',
    enunciado: '¿Cuál afirmación sobre el pisiforme es correcta?',
    opciones: ['Forma parte de la superficie articular radiocarpiana.', 'Articula con el radio.', 'Es un hueso largo de la fila distal.', 'Es un hueso sesamoideo del tendón del flexor ulnar del carpo, vecino de la radiocarpiana.'],
    correcta: 3,
    justificacion: 'Es un sesamoideo incluido en el tendón del flexor ulnar del carpo y articula con el piramidal; es una estructura vecina, no parte de la superficie radiocarpiana.',
    errores: ['No contacta con el radio ni con el disco; pertenece a la cara palmar del piramidal.', 'Articula solo con el piramidal.', 'Es un hueso corto pequeño de la fila proximal, no un hueso largo ni de la fila distal.', ''],
  },
  {
    id: 'o5', categoria: 'osteologia',
    enunciado: 'En posición neutra, ¿qué hueso de la fila proximal no contacta directamente con el radio?',
    opciones: ['Escafoides', 'Semilunar', 'Piramidal', 'Los tres contactan con el radio por igual'],
    correcta: 2,
    justificacion: 'El escafoides y el semilunar se apoyan en las fositas del radio; el piramidal se relaciona sobre todo con el disco, y contacta mejor en desviación ulnar.',
    errores: ['El escafoides se apoya en la fosita escafoidea.', 'El semilunar se apoya en la fosita semilunar.', '', 'El piramidal no contacta con el radio en posición neutra.'],
  },
  // ───────── Ligamentos (4)
  {
    id: 'l1', categoria: 'ligamentos', aplicada: true,
    enunciado: 'Un paciente tiene dolor dorsal-radial y un intervalo ensanchado entre escafoides y semilunar en la radiografía. ¿Qué estructura es la probable lesionada?',
    opciones: ['Ligamento lunopiramidal interóseo', 'Ligamento escafolunar interóseo', 'Ligamento colateral ulnar', 'Disco articular'],
    correcta: 1,
    justificacion: 'El ligamento escafolunar interóseo conecta escafoides y semilunar; su rotura ocasiona disociación escafolunar con alteración de la alineación (DISI).',
    errores: ['El lunopiramidal une semilunar y piramidal y produce dolor ulnar.', '', 'El colateral ulnar se localiza en el lado medial.', 'El disco articular es ulnar; su lesión causa dolor ulnar.'],
  },
  {
    id: 'l2', categoria: 'ligamentos',
    enunciado: '¿Cuál de los siguientes es un ligamento intercarpiano y no propiamente radiocarpiano?',
    opciones: ['Radiolunar largo', 'Radioescafocapitado', 'Lunopiramidal interóseo', 'Radiocarpiano dorsal'],
    correcta: 2,
    justificacion: 'El lunopiramidal une dos huesos del carpo (semilunar y piramidal). Los otros se insertan en el radio.',
    errores: ['Se origina en el radio.', 'Se origina en la estiloides del radio.', '', 'Se origina en el borde dorsal del radio.'],
  },
  {
    id: 'l3', categoria: 'ligamentos',
    enunciado: '¿Cuál es la función principal del complejo fibrocartilaginoso triangular?',
    opciones: ['Unir el escafoides con el trapecio.', 'Estabilizar la radioulnar distal y amortiguar la carga ulnocarpiana.', 'Limitar la desviación radial por contacto con la estiloides radial.', 'Servir como inserción del flexor radial del carpo.'],
    correcta: 1,
    justificacion: 'El TFCC estabiliza la articulación radioulnar distal, amortigua la carga entre la ulna y el carpo y prolonga la superficie articular del radio.',
    errores: ['Esa unión corresponde a ligamentos del lado radial.', '', 'La desviación radial se limita por contacto óseo y ligamentos del lado radial.', 'El flexor radial del carpo se inserta en el 2.º metacarpiano.'],
  },
  {
    id: 'l4', categoria: 'ligamentos',
    enunciado: '¿Qué ligamento se origina en la estiloides radial, pasa palmar al escafoides y se dirige al hueso grande?',
    opciones: ['Radiolunar corto', 'Ulnocapitado', 'Radioescafocapitado', 'Escafolunar interóseo'],
    correcta: 2,
    justificacion: 'El radioescafocapitado va desde la estiloides del radio hasta el hueso grande, apoyando al escafoides como fulcro.',
    errores: ['Va del radio al semilunar, sin pasar por el escafoides.', 'Nace de la ulna/ligamento radioulnar y se dirige al hueso grande.', '', 'Une escafoides y semilunar; no nace de la estiloides.'],
  },
  // ───────── Miología y biomecánica (4)
  {
    id: 'm1', categoria: 'miologia',
    enunciado: '¿Qué músculo se inserta en la base del 3.er metacarpiano (cara dorsal)?',
    opciones: ['Extensor radial largo del carpo', 'Extensor radial corto del carpo', 'Extensor ulnar del carpo', 'Flexor ulnar del carpo'],
    correcta: 1,
    justificacion: 'El extensor radial corto del carpo se inserta en la base del 3.er metacarpiano; el largo, en la del 2.º.',
    errores: ['Se inserta en el 2.º metacarpiano.', '', 'Se inserta en la base del 5.º metacarpiano.', 'Se inserta en el pisiforme (con extensión al ganchoso y al 5.º metacarpiano).'],
  },
  {
    id: 'm2', categoria: 'miologia',
    enunciado: '¿Qué pareja de músculos produce desviación ulnar pura de la muñeca?',
    opciones: ['Flexor radial del carpo y extensor radial largo del carpo', 'Palmar largo y extensor radial corto del carpo', 'Flexor ulnar del carpo y extensor ulnar del carpo', 'Extensor ulnar del carpo y extensor radial largo del carpo'],
    correcta: 2,
    justificacion: 'El flexor y el extensor ulnar del carpo cancelan sus acciones de flexión y extensión y dejan la desviación ulnar.',
    errores: ['Es la pareja de la desviación radial.', 'No producen desviación ulnar pura.', '', 'El radial largo desvía hacia radial; combinados no dan desviación ulnar pura.'],
  },
  {
    id: 'm3', categoria: 'miologia',
    enunciado: 'La pronación y la supinación ocurren en…',
    opciones: ['La articulación radiocarpiana.', 'La articulación mediocarpiana.', 'Las articulaciones radioulnares proximal y distal.', 'La articulación entre el escafoides y el semilunar.'],
    correcta: 2,
    justificacion: 'Son movimientos del antebrazo: el radio rota alrededor de la ulna en las articulaciones radioulnares proximal y distal.',
    errores: ['La radiocarpiana tiene solo dos grados de libertad (flexoextensión y desviaciones).', 'La mediocarpiana colabora en los movimientos de la muñeca, pero no genera pronosupinación.', '', 'Es una articulación intercarpiana.'],
  },
  {
    id: 'm4', categoria: 'miologia',
    enunciado: '¿Qué tipo de articulación es la radiocarpiana y cuántos grados de libertad tiene?',
    opciones: ['Condílea (elipsoidea), dos grados de libertad', 'Esferoidea, tres grados de libertad', 'Troclear, un grado de libertad', 'Trocoide, un grado de libertad'],
    correcta: 0,
    justificacion: 'Es condílea: permite flexoextensión y desviación radial/ulnar; no permite rotación axial.',
    errores: ['', 'La esferoidea corresponde a hombro y cadera.', 'La troclear permite un solo eje, como el codo en flexoextensión.', 'La trocoide corresponde a las articulaciones radioulnares.'],
  },
  // ───────── Vascularización e inervación (3)
  {
    id: 'n1', categoria: 'neurovascular', aplicada: true,
    enunciado: 'Tras una fractura de la cintura del escafoides, ¿por qué el polo proximal es vulnerable a la necrosis avascular?',
    opciones: ['Porque la irrigación llega por vasos que entran por la porción distal y el flujo al polo proximal es retrógrado.', 'Porque depende exclusivamente de la arteria ulnar.', 'Porque carece de cartílago articular.', 'Porque el nervio mediano lo comprime.'],
    correcta: 0,
    justificacion: 'Los vasos de la arteria radial penetran por la cresta dorsal, distal a la cintura; el polo proximal depende de flujo retrógrado intraóseo.',
    errores: ['', 'La irrigación proviene de ramas de la arteria radial.', 'Gran parte del escafoides tiene cartílago articular, lo que deja pocos puntos de entrada de vasos.', 'Los nervios no causan necrosis ósea por compresión.'],
  },
  {
    id: 'n2', categoria: 'neurovascular',
    enunciado: '¿Qué nervio inerva el músculo flexor ulnar del carpo?',
    opciones: ['Mediano', 'Radial', 'Interóseo posterior', 'Ulnar'],
    correcta: 3,
    justificacion: 'El flexor ulnar del carpo está inervado por el nervio ulnar (C7–T1).',
    errores: ['Inerva el flexor radial del carpo y el palmar largo.', 'Inerva los extensores, no el flexor ulnar.', 'Inerva los extensores profundos y el extensor ulnar del carpo.', ''],
  },
  {
    id: 'n3', categoria: 'neurovascular',
    enunciado: '¿Qué rama nerviosa se describe como el principal aporte sensitivo a la cápsula dorsal de la muñeca?',
    opciones: ['Rama cutánea palmar del mediano', 'Rama terminal del nervio interóseo posterior', 'Rama dorsal del nervio ulnar', 'Nervio cutáneo medial del antebrazo'],
    correcta: 1,
    justificacion: 'La rama terminal del nervio interóseo posterior, en el suelo del cuarto compartimento extensor, inerva la cápsula dorsal; por eso se usa en la neurectomía para el dolor dorsal.',
    errores: ['Es cutánea y pasa superficial al retináculo.', '', 'Es cutánea y aporta a la piel dorsal-medial.', 'Es cutáneo; no es el aporte a la cápsula.'],
  },
  // ───────── Correlaciones clínicas (4)
  {
    id: 'c1', categoria: 'clinica', aplicada: true,
    enunciado: 'Una persona de 22 años sufre una caída sobre la mano extendida y presenta dolor en la tabaquera anatómica. ¿Qué lesión debe sospecharse?',
    opciones: ['Lesión del complejo fibrocartilaginoso triangular', 'Fractura de la estiloides ulnar', 'Síndrome del túnel carpiano', 'Fractura del escafoides'],
    correcta: 3,
    justificacion: 'El escafoides forma el suelo de la tabaquera anatómica; su dolor tras una caída sugiere fractura.',
    errores: ['Produce dolor ulnar, no radial.', 'La estiloides ulnar es medial.', 'Cursa con parestesias del mediano, no con dolor en la tabaquera.', ''],
  },
  {
    id: 'c2', categoria: 'clinica', aplicada: true,
    enunciado: 'Una persona de 30 años refiere dolor ulnar y chasquido tras una torsión de la muñeca. ¿Qué estructura es la más probable?',
    opciones: ['Disco articular y complejo fibrocartilaginoso triangular', 'Ligamento colateral radial', 'Tendón del flexor radial del carpo', 'Arteria radial'],
    correcta: 0,
    justificacion: 'El dolor ulnar con chasquido tras una torsión sugiere lesión del disco articular y del TFCC.',
    errores: ['', 'Es radial.', 'Cursa con dolor palmar-radial.', 'Una lesión arterial causaría isquemia o hemorragia, no chasquido ulnar.'],
  },
  {
    id: 'c3', categoria: 'clinica', aplicada: true,
    enunciado: 'Una persona de 65 años presenta deformidad en «dorso de tenedor» tras una caída. ¿Cuál es el desplazamiento típico?',
    opciones: ['Fragmento distal del radio desplazado hacia palmar', 'Fragmento distal del radio desplazado hacia dorsal', 'Luxación del semilunar hacia dorsal', 'Fractura aislada de la estiloides radial'],
    correcta: 1,
    justificacion: 'En la fractura de Colles el fragmento distal se desplaza dorsalmente, con acortamiento radial y pérdida de la inclinación palmar.',
    errores: ['Es el patrón de la fractura de Smith.', '', 'La luxación del semilunar no explica la deformidad del radio.', 'No produce una deformidad en dorso de tenedor.'],
  },
  {
    id: 'c4', categoria: 'clinica', aplicada: true,
    enunciado: 'Dolor en la tabaquera tras una caída y radiografías iniciales normales. ¿Cuál es la conducta más apropiada?',
    opciones: ['Dar de alta sin inmovilización.', 'Infiltrar corticoide.', 'Realizar una electromiografía.', 'Inmovilizar con férula e incluir el pulgar y completar con RM, TC o radiografías repetidas.'],
    correcta: 3,
    justificacion: 'Una fractura de escafoides puede no verse en la primera radiografía; se inmoviliza y se confirma con otro estudio.',
    errores: ['Expone a desplazamiento y no consolidación.', 'No trata una fractura.', 'No diagnostica fracturas.', ''],
  },
]

export const CATEGORY_COUNTS: Record<QCategory, number> = {
  osteologia: 5, ligamentos: 4, miologia: 4, neurovascular: 3, clinica: 4,
}
