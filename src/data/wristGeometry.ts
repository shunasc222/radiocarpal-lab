/**
 * Geometría del esquema anatómico original (vista palmar de la muñeca derecha, posición anatómica:
 * antebrazo arriba, mano abajo, radio a la izquierda del observador). Es un dibujo didáctico propio,
 * no una reproducción de ningún atlas. La vista dorsal se obtiene reflejando horizontalmente el mismo dibujo.
 * Sistema de coordenadas: 0..470 (x) × 0..700 (y).
 */
export const FIG_W = 470

export const BONE_PATHS: Record<string, string> = {
  radio:
    'M165 0 L255 0 C258 100 270 180 306 244 L308 322 C290 330 262 338 232 346 C196 356 160 366 126 384 C118 360 124 310 136 250 C150 150 160 60 165 0 Z',
  ulna:
    'M330 0 L400 0 C402 100 412 176 424 230 C432 262 428 292 414 312 L416 340 L396 326 C374 318 336 312 322 296 C310 282 314 250 322 232 C330 150 330 60 330 0 Z',
  disco:
    'M308 318 C334 328 380 328 416 318 L418 334 C382 344 332 344 308 336 Z',
  escafoides:
    'M240 358 C262 364 266 390 250 410 C236 428 210 458 170 472 C135 480 112 468 112 446 C112 420 150 390 190 368 C208 358 226 354 240 358 Z',
  semilunar:
    'M270 372 C282 358 318 356 340 366 C354 376 354 404 342 424 C328 440 298 442 280 430 C268 418 264 386 270 372 Z',
  piramidal:
    'M358 372 C374 360 410 354 432 366 C446 378 444 408 428 426 C410 440 378 436 362 420 C352 404 352 384 358 372 Z',
  pisiforme:
    'M404 424 C404 410 424 404 440 410 C456 418 456 440 440 448 C424 454 404 440 404 424 Z',
  trapecio:
    'M70 500 C80 476 130 470 150 490 C162 510 156 546 136 560 C110 572 74 560 66 536 Z',
  trapezoide:
    'M166 510 C180 496 212 498 224 512 C230 532 224 550 206 556 C184 560 168 550 164 532 Z',
  hueso_grande:
    'M238 482 C250 464 300 460 320 478 C336 502 330 550 316 564 C296 576 250 574 238 554 C228 532 230 502 238 482 Z',
  ganchoso:
    'M340 480 C354 464 402 460 430 478 C448 498 442 542 422 560 C400 576 354 572 344 548 C336 522 334 498 340 480 Z',
}

/** Carillas articulares radiales (para resaltar la superficie proximal). */
export const FACET_PATHS = {
  'fosita-escafoidea': 'M232 346 L170 363 L124 384 L136 366 L170 349 L232 332 Z',
  'fosita-semilunar': 'M306 324 L232 346 L232 332 L304 312 Z',
  'cresta-interfacetaria': 'M222 352 C224 336 228 326 232 322 C236 326 240 336 242 352 Z',
  'escotadura-ulnar': 'M298 236 C312 262 314 290 308 320 L316 322 C324 290 320 260 306 232 Z',
  'estiloides-radio': 'M126 384 C118 360 122 330 130 300 L150 300 C146 330 146 352 160 368 Z',
  'estiloides-ulnar': 'M416 312 L418 340 L398 328 C408 326 414 320 416 312 Z',
}

/** Zonas seleccionables del atlas (id de estructura → path de la zona de interacción). */
export const ATLAS_ZONES: Record<string, string> = {
  'radio-distal': BONE_PATHS.radio,
  'ulna-distal': BONE_PATHS.ulna,
  disco: BONE_PATHS.disco,
  escafoides: BONE_PATHS.escafoides,
  semilunar: BONE_PATHS.semilunar,
  piramidal: BONE_PATHS.piramidal,
  pisiforme: BONE_PATHS.pisiforme,
  ...FACET_PATHS,
}

/** Orden de pintado: los elementos pequeños van encima de los grandes para poder seleccionarlos. */
export const ZONE_ORDER = [
  'radio-distal', 'ulna-distal', 'disco', 'escafoides', 'semilunar', 'piramidal', 'pisiforme',
  'escotadura-ulnar', 'estiloides-radio', 'estiloides-ulnar', 'fosita-escafoidea', 'fosita-semilunar', 'cresta-interfacetaria',
]

/** Etiquetas: ancla (punto sobre la estructura), y posición del texto en la versión ancha. */
export interface LabelPos { ax: number; ay: number; tx: number; ty: number; side: 'l' | 'r' }
export const LABELS: Record<string, LabelPos> = {
  'radio-distal': { ax: 190, ay: 150, tx: 20, ty: 120, side: 'l' },
  'estiloides-radio': { ax: 134, ay: 340, tx: 20, ty: 300, side: 'l' },
  'fosita-escafoidea': { ax: 176, ay: 352, tx: 20, ty: 340, side: 'l' },
  'cresta-interfacetaria': { ax: 232, ay: 332, tx: 20, ty: 252, side: 'l' },
  'fosita-semilunar': { ax: 270, ay: 328, tx: 20, ty: 210, side: 'l' },
  'escotadura-ulnar': { ax: 308, ay: 280, tx: 20, ty: 170, side: 'l' },
  escafoides: { ax: 150, ay: 440, tx: 20, ty: 430, side: 'l' },
  semilunar: { ax: 304, ay: 404, tx: 20, ty: 480, side: 'l' },
  'ulna-distal': { ax: 380, ay: 170, tx: 450, ty: 120, side: 'r' },
  'estiloides-ulnar': { ax: 410, ay: 330, tx: 450, ty: 250, side: 'r' },
  disco: { ax: 360, ay: 332, tx: 450, ty: 310, side: 'r' },
  piramidal: { ax: 392, ay: 394, tx: 450, ty: 370, side: 'r' },
  pisiforme: { ax: 440, ay: 430, tx: 450, ty: 430, side: 'r' },
}
