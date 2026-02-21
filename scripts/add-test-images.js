import { createRequire } from 'module';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXCEL_PATH = join(__dirname, '../src/db/la_diabla_menu.xlsx');

// Imágenes de Unsplash por plato de comida (categorías: Hamburguesas, Salchipapas, Parrillas)
const TEST_IMAGES = {
  // --- Hamburguesas ---
  'Sanguche Hawaiano':
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Criolla':
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=80',
  'Santa Isabel':
    'https://images.unsplash.com/photo-1586816001966-79b736744398?w=400&q=80',
  'Imperial Plus':
    'https://images.unsplash.com/photo-1550950158-d0d960dff596?w=400&q=80',
  'Amazonico':
    'https://images.unsplash.com/photo-1565299543923-37dd37887442?w=400&q=80',
  'Pecado Elevado':
    'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&q=80',
  'Vaquero':
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80',
  'La Gaucha':
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80',
  'Burking':
    'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&q=80',

  // --- Salchipapas ---
  'Salchipapa De la Casa':
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  'La Callejera':
    'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?w=400&q=80',
  'La Completa':
    'https://images.unsplash.com/photo-1568605115459-4b731184f961?w=400&q=80',
  'La Acecina':
    'https://images.unsplash.com/photo-1511689660979-10d2b1eccbab?w=400&q=80',
  'La Golosa':
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',

  // --- Parrillas ---
  'Anticuchos de Corazón':
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
  'Mollejitas a la Parrilla':
    'https://images.unsplash.com/photo-1544025162-d76538e5e0a1?w=400&q=80',
};

// Leer Excel
const workbook = XLSX.readFile(EXCEL_PATH);
const sheet = workbook.Sheets['Menu'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Fila 1 = headers, Fila 2+ = datos
// Encontrar índice de columna 'image' desde los headers
const headers = rows[1];
const nameCol = headers.indexOf('name');
const imageCol = headers.indexOf('image');

let updated = 0;

for (let i = 2; i < rows.length; i++) {
  const row = rows[i];
  const itemName = String(row[nameCol] ?? '').trim();
  if (TEST_IMAGES[itemName]) {
    row[imageCol] = TEST_IMAGES[itemName];
    updated++;
  }
}

// Reconstruir la hoja con los datos actualizados
const newSheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets['Menu'] = newSheet;
XLSX.writeFile(workbook, EXCEL_PATH);

console.log(`Excel actualizado: ${updated} imágenes añadidas`);

// Sincronizar JSON ejecutando update-menu
console.log('Sincronizando JSON...');
execSync('node scripts/update-menu.js', { stdio: 'inherit' });
