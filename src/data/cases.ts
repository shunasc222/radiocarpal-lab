export interface CaseOption { texto: string; correcta: boolean; feedback: string }
export interface CaseDecision { id: string; pregunta: string; contexto?: string; opciones: CaseOption[] }

export interface ClinicalCase {
  id: string
  numero: number
  titulo: string
  resumen: string
  paciente: string
  presentacion: {
    motivo: string
    antecedente: string
    signos: string[]
    hallazgos: { etiqueta: string; valor: string }[]
    imagenes: string
  }
  decisiones: CaseDecision[]
  explicacion: {
    resumen: string
    estructuras: { nombre: string; texto: string }[]
    puntosClave: string[]
    /** Estructuras del atlas relacionadas (ids de structures.ts). */
    atlas: string[]
    seccion?: { id: string; etiqueta: string }
  }
}

export const CASES: ClinicalCase[] = [
  {
    id: 'escafoides', numero: 1, titulo: 'Fractura de escafoides',
    resumen: 'Dolor radial de la muñeca tras caída sobre la mano extendida.',
    paciente: 'Paciente de 22 años',
    presentacion: {
      motivo: 'Dolor en la muñeca derecha, en el lado del pulgar, desde hace dos días.',
      antecedente: 'Cayó mientras practicaba patinaje y apoyó la mano en extensión y ligera desviación radial. Pudo continuar usando la mano con molestia; no consultó de inmediato.',
      signos: ['Dolor y leve tumefacción en la región radial de la muñeca.', 'Dolor al extender la muñeca y al hacer pinza fuerte.', 'Pulso radial y sensibilidad digital conservados.'],
      hallazgos: [
        { etiqueta: 'Palpación', valor: 'Dolor en la tabaquera anatómica y en el tubérculo del escafoides.' },
        { etiqueta: 'Maniobra', valor: 'Dolor al comprimir el pulgar a lo largo de su eje (compresión axial).' },
        { etiqueta: 'Movilidad', valor: 'Flexo-extensión dolorosa en los extremos; no hay deformidad.' },
      ],
      imagenes: 'Radiografías de muñeca en proyecciones posteroanterior, lateral y oblicuas: sin fractura evidente en el estudio inicial.',
    },
    decisiones: [
      {
        id: 'e1', pregunta: '¿Qué hueso forma el suelo de la tabaquera anatómica y explica el punto doloroso?',
        opciones: [
          { texto: 'Semilunar', correcta: false, feedback: 'El semilunar es central y profundo, no forma el suelo de la tabaquera; su dolor se localizaría dorsal-central.' },
          { texto: 'Escafoides (junto con el trapecio)', correcta: true, feedback: 'Correcto. El escafoides y el trapecio forman el suelo de la tabaquera, limitada por los tendones del abductor largo y extensor corto del pulgar (lateral) y el extensor largo del pulgar (medial).' },
          { texto: 'Apófisis estiloides de la ulna', correcta: false, feedback: 'La estiloides ulnar está en el lado medial de la muñeca; no se relaciona con la tabaquera.' },
          { texto: 'Disco articular', correcta: false, feedback: 'El disco articular es ulnar y no se palpa; el dolor en tabaquera es radial.' },
        ],
      },
      {
        id: 'e2', pregunta: 'La radiografía inicial es normal, pero la sospecha clínica es alta. ¿Cuál es la conducta más adecuada?',
        opciones: [
          { texto: 'Dar de alta con analgésicos y reincorporación completa.', correcta: false, feedback: 'Las fracturas de escafoides pueden ser invisibles en la primera radiografía; el alta sin protección expone a desplazamiento y no consolidación.' },
          { texto: 'Inmovilizar con férula que incluya el pulgar y repetir el estudio o pedir RM/TC.', correcta: true, feedback: 'Correcto. Se inmoviliza ante la sospecha y se confirma con RM o TC (o radiografías repetidas a los 10–14 días).' },
          { texto: 'Infiltrar corticoide en la tabaquera.', correcta: false, feedback: 'No trata una fractura y puede empeorar la cicatrización ósea.' },
          { texto: 'Solicitar únicamente electromiografía.', correcta: false, feedback: 'El problema es óseo; la electromiografía no aporta al diagnóstico de fractura.' },
        ],
      },
      {
        id: 'e3', pregunta: 'En una fractura de la cintura o del polo proximal, ¿por qué es mayor el riesgo de necrosis avascular del fragmento proximal?',
        opciones: [
          { texto: 'Porque la arteria radial entra al hueso por su cresta dorsal, distal a la cintura, y el flujo hacia el polo proximal es retrógrado.', correcta: true, feedback: 'Correcto. Los vasos penetran por la porción distal; el polo proximal depende del flujo retrógrado, que se interrumpe con la fractura.' },
          { texto: 'Porque el escafoides se irriga solo por la arteria ulnar.', correcta: false, feedback: 'La irrigación proviene sobre todo de ramas de la arteria radial, no de la ulnar.' },
          { texto: 'Porque el nervio mediano comprime al polo proximal.', correcta: false, feedback: 'Los nervios no determinan la necrosis ósea; el problema es vascular.' },
          { texto: 'Porque no tiene cartílago articular.', correcta: false, feedback: 'Al contrario: gran parte del escafoides está cubierta por cartílago, lo que deja pocos puntos de entrada vascular.' },
        ],
      },
    ],
    explicacion: {
      resumen: 'La caída sobre la mano extendida transmite la carga a través de la columna radial del carpo hasta la fosita escafoidea del radio; el escafoides, puente entre las dos filas, es el hueso carpiano que más se fractura.',
      estructuras: [
        { nombre: 'Escafoides', texto: 'Polo proximal (articula con la fosita escafoidea), cintura y tubérculo distal. Es palpable en la tabaquera.' },
        { nombre: 'Tabaquera anatómica', texto: 'Limitada por los tendones del abductor largo y extensor corto del pulgar y del extensor largo del pulgar; contiene la arteria radial y ramos del nervio radial superficial.' },
        { nombre: 'Arteria radial', texto: 'Sus ramas dorsales y palmares irrigan el escafoides; el flujo hacia el polo proximal es retrógrado.' },
        { nombre: 'Ligamentos', texto: 'Los ligamentos radioescafocapitado y escafolunar interóseo se insertan en el escafoides; su lesión asociada compromete la estabilidad carpiana.' },
      ],
      puntosClave: [
        'Dolor en la tabaquera tras una caída = fractura de escafoides hasta demostrar lo contrario.',
        'La radiografía inicial puede ser normal: se inmoviliza y se confirma.',
        'La necrosis avascular del polo proximal y la pseudoartrosis son las complicaciones críticas.',
      ],
      atlas: ['escafoides', 'estiloides-radio'],
      seccion: { id: 'vascular', etiqueta: 'Ver irrigación del escafoides' },
    },
  },
  {
    id: 'tfcc', numero: 2, titulo: 'Lesión del complejo fibrocartilaginoso triangular',
    resumen: 'Dolor ulnar tras torsión forzada de la muñeca.',
    paciente: 'Paciente de 30 años',
    presentacion: {
      motivo: 'Dolor en el lado ulnar de la muñeca desde hace tres semanas.',
      antecedente: 'Se torció la muñeca al forzar el giro de una llave inglesa; desde entonces siente dolor y un chasquido al girar el antebrazo.',
      signos: ['Dolor en el borde ulnar, agravado al cargar peso y al desviar hacia ulnar.', 'Chasquido al pronosupinar.', 'Sensación de debilidad en la prensión.'],
      hallazgos: [
        { etiqueta: 'Palpación', valor: 'Dolor en la fóvea ulnar (entre la estiloides ulnar y el flexor ulnar del carpo).' },
        { etiqueta: 'Maniobra', valor: 'Prueba de estrés ulnocarpiano positiva (desviación ulnar con compresión axial y rotación).' },
        { etiqueta: 'Estabilidad', valor: 'Leve laxitud de la radioulnar distal comparada con el lado contrario («tecla de piano»).' },
      ],
      imagenes: 'Radiografías simples: sin fractura; varianza ulnar neutra.',
    },
    decisiones: [
      {
        id: 't1', pregunta: '¿Qué estructura se interpone entre la cabeza de la ulna y los huesos del carpo y es la probable lesionada?',
        opciones: [
          { texto: 'Ligamento colateral radial', correcta: false, feedback: 'Es radial y se une al escafoides; no separa la ulna del carpo.' },
          { texto: 'Disco articular, centro del complejo fibrocartilaginoso triangular', correcta: true, feedback: 'Correcto. El disco articular separa la ulna del carpo y es el núcleo del TFCC.' },
          { texto: 'Cápsula de la mediocarpiana', correcta: false, feedback: 'La mediocarpiana está más distal y no relaciona la ulna con el carpo.' },
          { texto: 'Pisiforme', correcta: false, feedback: 'El pisiforme es sesamoideo palmar, no una estructura estabilizadora articular.' },
        ],
      },
      {
        id: 't2', pregunta: 'La prueba de la «tecla de piano» evalúa principalmente…',
        opciones: [
          { texto: 'La integridad del escafoides.', correcta: false, feedback: 'La integridad del escafoides se explora con la compresión axial y la tabaquera.' },
          { texto: 'La tensión del flexor radial del carpo.', correcta: false, feedback: 'No explora tendones sino la estabilidad articular.' },
          { texto: 'La estabilidad de la articulación radioulnar distal.', correcta: true, feedback: 'Correcto. La traslación dorsal-palmar de la cabeza de la ulna refleja la integridad de los ligamentos radioulnares del TFCC.' },
          { texto: 'La función del nervio ulnar.', correcta: false, feedback: 'La función nerviosa se explora con sensibilidad y fuerza intrínseca.' },
        ],
      },
      {
        id: 't3', pregunta: 'Entre los diagnósticos diferenciales del dolor ulnar de muñeca está…',
        opciones: [
          { texto: 'Tenosinovitis de De Quervain.', correcta: false, feedback: 'Afecta a los tendones del primer compartimento, en el lado radial.' },
          { texto: 'Fractura de la cintura del escafoides.', correcta: false, feedback: 'Es radial: dolor en la tabaquera.' },
          { texto: 'Síndrome del túnel carpiano.', correcta: false, feedback: 'Causa parestesias en el territorio del nervio mediano y no un chasquido ulnar.' },
          { texto: 'Tendinopatía o subluxación del extensor ulnar del carpo.', correcta: true, feedback: 'Correcto. Otros diagnósticos son la lesión lunopiramidal, el síndrome de impactación ulnocarpiana y la artrosis pisopiramidal.' },
        ],
      },
      {
        id: 't4', pregunta: '¿Qué estudio de imagen aporta más información sobre el disco y sus ligamentos?',
        opciones: [
          { texto: 'Radiografía simple de muñeca.', correcta: false, feedback: 'La radiografía no muestra el fibrocartílago; sirve para descartar fracturas y medir varianza ulnar.' },
          { texto: 'Resonancia magnética (o artrorresonancia).', correcta: true, feedback: 'Correcto. Permite valorar el disco y los ligamentos; la artroscopia es el patrón de referencia.' },
          { texto: 'Gammagrafía ósea como estudio inicial.', correcta: false, feedback: 'Es poco específica para lesiones de partes blandas.' },
          { texto: 'Ecografía Doppler arterial.', correcta: false, feedback: 'Evalúa los vasos, no el complejo fibrocartilaginoso.' },
        ],
      },
    ],
    explicacion: {
      resumen: 'El TFCC es el estabilizador principal de la articulación radioulnar distal y amortigua la carga entre la ulna y el carpo. Una torsión con carga puede desgarrarlo.',
      estructuras: [
        { nombre: 'Disco articular', texto: 'Fibrocartílago bicóncavo entre la ulna y el semilunar/piramidal. Su centro es avascular y su periferia está irrigada.' },
        { nombre: 'Ligamentos radioulnares palmar y dorsal', texto: 'Bordes del complejo; mantienen la cabeza de la ulna en la escotadura ulnar.' },
        { nombre: 'Ligamentos ulnocarpianos y colateral ulnar', texto: 'Suspensión del carpo ulnar; refuerzan el lado medial de la muñeca.' },
        { nombre: 'Extensor ulnar del carpo', texto: 'Su vaina se asocia al TFCC; su tendinopatía es un diagnóstico diferencial frecuente.' },
      ],
      puntosClave: [
        'Los desgarros periféricos (mejor irrigados) pueden cicatrizar; los centrales avasculares suelen requerir desbridamiento.',
        'La ulna NO contacta con el carpo: el disco se interpone.',
        'Evaluar siempre la estabilidad de la radioulnar distal.',
      ],
      atlas: ['disco', 'ulna-distal', 'estiloides-ulnar'],
      seccion: { id: 'ligamentos', etiqueta: 'Ver TFCC en ligamentos' },
    },
  },
  {
    id: 'radio-distal', numero: 3, titulo: 'Fractura distal del radio',
    resumen: 'Deformidad de la muñeca tras caída en una persona mayor.',
    paciente: 'Paciente de 65 años',
    presentacion: {
      motivo: 'Dolor intenso y deformidad de la muñeca izquierda tras resbalar en el baño.',
      antecedente: 'Cayó sobre la mano extendida. Antecedente de osteoporosis sin tratamiento.',
      signos: ['Tumefacción y equimosis.', 'Deformidad en «dorso de tenedor» en la vista lateral.', 'Hormigueo leve en pulgar e índice.'],
      hallazgos: [
        { etiqueta: 'Inspección', valor: 'Prominencia dorsal y desviación radial de la mano respecto al antebrazo.' },
        { etiqueta: 'Neurovascular', valor: 'Pulso radial presente; sensibilidad ligeramente disminuida en el territorio del mediano.' },
        { etiqueta: 'Movilidad', valor: 'Dolor intenso y limitación de todos los movimientos de la muñeca.' },
      ],
      imagenes: 'Radiografías: fractura del radio distal con fragmento desplazado hacia dorsal, acortamiento del radio y trazo que alcanza la superficie articular.',
    },
    decisiones: [
      {
        id: 'r1', pregunta: '¿Qué patrón de desplazamiento describe la deformidad «en dorso de tenedor»?',
        opciones: [
          { texto: 'Fragmento distal desplazado hacia dorsal (fractura de Colles).', correcta: true, feedback: 'Correcto. En la fractura de Colles el fragmento distal se desplaza dorsalmente, con inclinación dorsal y acortamiento radial.' },
          { texto: 'Fragmento distal desplazado hacia palmar (fractura de Smith).', correcta: false, feedback: 'La fractura de Smith (desplazamiento palmar) es menos frecuente y suele ocurrir por caída sobre el dorso de la mano.' },
          { texto: 'Fractura aislada de la estiloides ulnar.', correcta: false, feedback: 'No produce una deformidad en dorso de tenedor.' },
          { texto: 'Luxación pura del semilunar.', correcta: false, feedback: 'Es una lesión carpiana central, no una deformidad del radio.' },
        ],
      },
      {
        id: 'r2', pregunta: 'Respecto a la alineación del radio distal, ¿qué alteración ocurre en el plano sagital?',
        opciones: [
          { texto: 'Aumento de la inclinación radial en el plano frontal.', correcta: false, feedback: 'La inclinación radial se reduce con el acortamiento; no aumenta.' },
          { texto: 'Pérdida de la inclinación palmar normal (≈ 11°), que se convierte en inclinación dorsal.', correcta: true, feedback: 'Correcto. La inversión de la inclinación palmar altera la carga carpiana y la función.' },
          { texto: 'Varianza ulnar negativa por elongación del radio.', correcta: false, feedback: 'El radio se acorta; esto da varianza ulnar positiva.' },
          { texto: 'Ninguna: la alineación sagital se conserva.', correcta: false, feedback: 'El desplazamiento dorsal implica pérdida de la inclinación palmar.' },
        ],
      },
      {
        id: 'r3', pregunta: '¿Qué complicación neurológica debe vigilarse en las primeras horas?',
        opciones: [
          { texto: 'Parálisis del nervio radial en la axila.', correcta: false, feedback: 'No se relaciona con una fractura distal del radio.' },
          { texto: 'Compresión aguda del nervio mediano en el túnel del carpo.', correcta: true, feedback: 'Correcto. El edema y el hematoma comprimen el túnel; las parestesias progresivas obligan a reevaluar y a descomprimir.' },
          { texto: 'Lesión del nervio ulnar en el codo.', correcta: false, feedback: 'No es una complicación de la fractura distal del radio.' },
          { texto: 'Neuralgia del trigémino.', correcta: false, feedback: 'No tiene relación con la región.' },
        ],
      },
      {
        id: 'r4', pregunta: '¿Por qué importa que el trazo alcance la superficie articular?',
        opciones: [
          { texto: 'Porque compromete las fositas escafoidea y semilunar, y un escalón residual favorece la artrosis postraumática.', correcta: true, feedback: 'Correcto. La congruencia de la superficie articular del radio determina el pronóstico funcional.' },
          { texto: 'Porque implica la lesión de la articulación mediocarpiana.', correcta: false, feedback: 'La mediocarpiana está distal a la superficie radial; no se afecta directamente.' },
          { texto: 'Porque garantiza la necrosis del escafoides.', correcta: false, feedback: 'No lo garantiza; el riesgo vascular depende de fracturas del escafoides.' },
          { texto: 'No importa: el tratamiento no cambia.', correcta: false, feedback: 'Las fracturas intraarticulares con escalón suelen requerir reducción precisa.' },
        ],
      },
    ],
    explicacion: {
      resumen: 'La caída sobre la mano extendida carga la superficie articular del radio; en un hueso osteoporótico el extremo distal cede. El fragmento distal se desplaza dorsalmente y el radio se acorta.',
      estructuras: [
        { nombre: 'Superficie articular carpiana', texto: 'Con las fositas escafoidea y semilunar; su congruencia determina la función.' },
        { nombre: 'Parámetros radiográficos', texto: 'Inclinación radial (≈ 22°), inclinación palmar (≈ 11°), altura radial (≈ 11–12 mm) y varianza ulnar: orientativos.' },
        { nombre: 'Estructuras asociadas', texto: 'Fractura de la estiloides ulnar, lesión del TFCC y de la radioulnar distal, y compresión del nervio mediano.' },
        { nombre: 'Tubérculo dorsal (de Lister)', texto: 'El tendón del extensor largo del pulgar puede romperse de forma tardía tras fracturas poco desplazadas.' },
      ],
      puntosClave: [
        'Colles: desplazamiento dorsal; Smith: palmar; Barton: marginal intraarticular; Chauffeur: estiloides radial.',
        'Siempre valorar el nervio mediano y la estabilidad de la radioulnar distal.',
        'En personas mayores, investigar fragilidad ósea.',
      ],
      atlas: ['superficie-articular', 'radio-distal'],
      seccion: { id: 'atlas', etiqueta: 'Ver superficie articular en el atlas' },
    },
  },
]
