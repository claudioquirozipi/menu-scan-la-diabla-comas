import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXCEL_PATH = join(__dirname, '../src/db/la_diabla_menu.xlsx');
const JSON_PATH = join(__dirname, '../src/db/la_diabla_info.json');

// Leer Excel
const workbook = XLSX.readFile(EXCEL_PATH);
const sheet = workbook.Sheets['Menu'];

// Fila 0: título, Fila 1: headers, Fila 2+: datos
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
const dataRows = rows.slice(2);

const menuItems = dataRows
  .filter((row) => row[0]) // ignorar filas vacías
  .map((row) => ({
    name: String(row[0] ?? '').trim(),
    description: String(row[1] ?? '').trim(),
    price: parseFloat(row[2]) || 0,
    category: String(row[3] ?? '').trim(),
    image: String(row[4] ?? '').trim(),
  }));

// Categorías en orden de aparición, sin duplicados
const menuCategories = [...new Set(menuItems.map((item) => item.category))];

// Leer JSON existente
const existing = JSON.parse(readFileSync(JSON_PATH, 'utf-8'));

// Actualizar solo menu_items y menu_categories, preservar el resto
existing.restaurant.menu_categories = menuCategories;
existing.restaurant.menu_items = menuItems;

// Escribir JSON actualizado
writeFileSync(JSON_PATH, JSON.stringify(existing, null, 2), 'utf-8');

console.log(`Platos actualizados: ${menuItems.length}`);
console.log(`Categorias (${menuCategories.length}): ${menuCategories.join(', ')}`);
