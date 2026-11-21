export interface Reference {
  id: string
  apa: string
  uso: string
}

/**
 * Obras de referencia anatómica. IMPORTANTE: los datos editoriales (editorial y año) deben
 * contrastarse con el ejemplar físico antes de entregar el trabajo.
 */
export const REFERENCES: Reference[] = [
  { id: 'latarjet', apa: 'Latarjet, M., & Ruiz Liard, A. (2019). Anatomía humana (5.ª ed., Vol. 1). Editorial Médica Panamericana.', uso: 'Osteología, artrología y miología del miembro superior.' },
  { id: 'rouviere', apa: 'Rouvière, H., & Delmas, A. (2005). Anatomía humana: Descriptiva, topográfica y funcional (11.ª ed., Vol. 3). Masson.', uso: 'Articulación radiocarpiana, ligamentos y fisiología articular.' },
  { id: 'moore', apa: 'Moore, K. L., Dalley, A. F., & Agur, A. M. R. (2022). Anatomía con orientación clínica (9.ª ed.). Wolters Kluwer.', uso: 'Correlaciones clínicas, vascularización e inervación.' },
  { id: 'netter', apa: 'Netter, F. H. (2023). Atlas de anatomía humana (8.ª ed.). Elsevier.', uso: 'Atlas de referencia visual (consultar edición disponible).' },
]
