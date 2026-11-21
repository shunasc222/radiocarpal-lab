# RADIOCARPAL LAB
Laboratorio virtual de anatomía, biomecánica y correlación clínica de la muñeca.
PUCE Sede Santo Domingo · Medicina · Morfofunción Osteomuscular (4.º semestre).

Aplicación web estática (React + TypeScript + Vite + Tailwind + Three.js/React Three Fiber) pensada para abrirse desde un QR en la infografía física.

## Módulos
1 Inicio · 2 Atlas anatómico · 3 **Explorador 3D por capas** (osteología, superficies articulares, ligamentos, miología, vasos y nervios) · 4 Ligamentos y estabilidad · 5 Miología y biomecánica (simulador) · 6 Vascularización e inervación · 7 Casos clínicos (3) · 8 Autoevaluación (20 preguntas), bibliografía APA y créditos.

## Aspecto visual
Las ilustraciones y el visor 3D se muestran sobre un panel gris azulado neutro (`FigurePanel`) para contrastar con el marfil de los huesos. Los huesos incluyen oclusión ambiental horneada, veteado sutil y contorno; los músculos, estriado de fibras y tendón nacarado; los ligamentos, material nacarado con tinte por categoría.

## Ilustraciones 2D
Atlas, ligamentos, vasos/nervios y músculos usan láminas renderizadas a partir de los mismos modelos 3D reales (vistas palmar, dorsal y distal del radio y la ulna); las zonas interactivas son las siluetas reales de cada estructura. Ligamentos, disco, vasos y nervios se superponen de forma esquemática. No se incluye ninguna lámina de libro.

## Modelo 3D: qué es real y qué es esquemático
- **Mallas reales (BodyParts3D 4.0, CC BY 4.0):** radio, ulna, 8 huesos del carpo, 5 bases metacarpianas, músculos (flexor radial del carpo, palmar largo, extensor radial largo y corto, extensor ulnar), retináculo flexor, membrana interósea.
- **Esquemático:** disco articular, ligamentos, flexor ulnar del carpo (solo el tendón), arterias, venas y nervios. No existen en ese conjunto de datos; se calculan con `scripts/build-models.mjs` por trazado de rayos sobre la superficie de los huesos reales (inserciones y recorridos aproximados). El tinte de cartílago es una delimitación aproximada derivada de normales y altura.
- Atribución y modificaciones: `public/models/ATTRIBUTION.txt` y los textos de licencia junto a los GLB.

## Ejecutar
```bash
npm install
npm run dev           # desarrollo
npm run build         # tipos + producción en dist/
npm test              # pruebas unitarias y de componentes (Vitest)
npm run test:e2e      # E2E en Chromium (requiere build previo y Playwright)
npm run build:models  # regenera public/models/*.glb y src/data/{landmarks3d,anatomy3d.generated}.ts (usa @somakine/bodyparts3d-musculoskeletal)
npm run build:plates  # (tras npm run build) regenera las láminas 2D public/atlas/*.webp y src/data/plates.generated.ts desde los modelos 3D
```

## Publicar en Vercel
Importa este repositorio: *Framework* **Vite**, *Build* `npm run build`, *Output* `dist` (ya definido en `vercel.json`).
Para la vista previa al compartir, cambia en `index.html` la ruta de `og:image` por la URL absoluta de `og-image.png` tras publicar.

## Código QR (solo con la URL pública ya publicada)
```bash
npm run qr -- https://TU-URL-PUBLICA/
```
Comprueba que la URL responde y es RADIOCARPAL LAB, genera el QR (negro sobre blanco, con margen), verifica que decodifica exactamente a esa URL y escribe en `qr/` el PNG, el SVG y la tarjeta para la infografía.

## Alcance y limitaciones
- El contenido textual se redactó con conocimiento anatómico establecido; no se citan páginas y las obras de la bibliografía no se consultaron página a página. El docente debe contrastarlo y verificar editorial/año de las referencias.
- Ángulos, porcentajes y parámetros radiográficos son orientativos.
- Probado en Chromium (escritorio, tableta y móvil emulados); no en dispositivos físicos.
