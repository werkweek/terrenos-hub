import * as XLSX from 'xlsx';

/**
 * Parse an Excel file (.xlsx, .xls) into normalized Terrenos items
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const parsed = rawRows.map((row, index) => {
          // Detect fields flexibly
          const id = row['ID'] || row['id'] || `IMP-${Date.now()}-${index + 1}`;
          const city = row['Ciudad / Municipio'] || row['Ciudad'] || row['city'] || 'Chihuahua';
          const title = row['Título de la Propiedad'] || row['Titulo'] || row['title'] || 'Terreno en Venta';
          
          let meters = 0;
          const rawMeters = row['Superficie / Metros'] || row['Metros'] || row['Superficie'] || row['meters'] || 0;
          if (typeof rawMeters === 'number') meters = rawMeters;
          else {
            const mClean = String(rawMeters).replace(/m2|m²|,/gi, '').trim();
            meters = parseFloat(mClean) || 0;
          }

          let price = 0;
          const rawPrice = row['Precio'] || row['precio'] || row['price'] || 0;
          if (typeof rawPrice === 'number') price = rawPrice;
          else {
            const pClean = String(rawPrice).replace(/\$|,/g, '').trim();
            price = parseFloat(pClean) || 0;
          }

          const price_per_m2 = (price > 0 && meters > 0) ? Math.round((price / meters) * 100) / 100 : 0;
          const location_card = row['Ubicación / Zona'] || row['Ubicacion'] || row['location_card'] || '';
          const date = row['Fecha de Publicación'] || row['Fecha'] || row['date'] || new Date().toISOString().split('T')[0];
          const url = row['Enlace Completo Facebook'] || row['Enlace'] || row['url'] || '';
          const description = row['Descripción y Detalles'] || row['Descripcion'] || row['description'] || '';
          const source = row['Fuente'] || row['source'] || 'Excel Import';
          const status = row['Estado'] || row['status'] || 'Disponible';

          let coordinates = null;
          if (row['Latitud'] && row['Longitud']) {
            coordinates = [parseFloat(row['Latitud']), parseFloat(row['Longitud'])];
          } else if (row['coordinates']) {
            try {
              coordinates = typeof row['coordinates'] === 'string' ? JSON.parse(row['coordinates']) : row['coordinates'];
            } catch (err) {
              coordinates = null;
            }
          }

          return {
            id,
            city,
            title,
            meters,
            price,
            price_per_m2,
            location_card,
            coordinates,
            date,
            url,
            description,
            source,
            status,
            notes: row['Notas'] || row['notes'] || ''
          };
        });

        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export current list of terrains to an Excel file (.xlsx)
 */
export function exportToExcel(terrenos, filename = 'Terrenos_Actualizados.xlsx') {
  const exportData = terrenos.map(t => ({
    'ID': t.id,
    'Ciudad / Municipio': t.city,
    'Título de la Propiedad': t.title,
    'Superficie (m²)': t.meters,
    'Precio ($ MXN)': t.price,
    'Precio por m² ($)': t.price_per_m2,
    'Ubicación / Zona': t.location_card,
    'Latitud': t.coordinates ? t.coordinates[0] : '',
    'Longitud': t.coordinates ? t.coordinates[1] : '',
    'Estado': t.status || 'Disponible',
    'Fecha de Publicación': t.date,
    'Enlace Facebook / Web': t.url,
    'Notas Manuales': t.notes || '',
    'Descripción': t.description
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Terrenos');

  XLSX.writeFile(workbook, filename);
}
