/**
 * Utilities for parsing and calculating relative time / days ago for listings.
 */

export function parseDateSafe(dateVal) {
  if (!dateVal) return null;
  
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    return dateVal;
  }

  const str = String(dateVal).trim();
  
  // Try ISO format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    return new Date(year, month, day);
  }

  // Try standard Date.parse
  const timestamp = Date.parse(str);
  if (!isNaN(timestamp)) {
    return new Date(timestamp);
  }

  // Fallback default: baseline date if text is generic like 'Activo / Publicación Reciente'
  if (str.toLowerCase().includes('reciente') || str.toLowerCase().includes('activo')) {
    return new Date(2026, 8, 26); // 26 Sep 2026
  }

  return null;
}

export function getDaysCount(dateVal) {
  const d = parseDateSafe(dateVal);
  if (!d) return 0;
  const now = new Date();
  const startOfDayNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDayTarget = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = startOfDayNow.getTime() - startOfDayTarget.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function getTimestamp(dateVal) {
  const d = parseDateSafe(dateVal);
  return d ? d.getTime() : 0;
}

export function getDaysAgo(dateVal) {
  const d = parseDateSafe(dateVal);
  if (!d) {
    return {
      text: 'Reciente',
      days: 0,
      badgeClass: 'badge-blue',
      fullDate: 'Fecha no especificada'
    };
  }

  const diffDays = getDaysCount(dateVal);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const formattedFull = d.toLocaleDateString('es-MX', options);

  if (diffDays <= 0) {
    return {
      text: 'Hoy',
      days: 0,
      badgeClass: 'badge-emerald',
      fullDate: `Publicado hoy (${formattedFull})`
    };
  } else if (diffDays === 1) {
    return {
      text: 'Hace 1 día',
      days: 1,
      badgeClass: 'badge-emerald',
      fullDate: `Publicado ayer (${formattedFull})`
    };
  } else if (diffDays <= 7) {
    return {
      text: `Hace ${diffDays} días`,
      days: diffDays,
      badgeClass: 'badge-gold',
      fullDate: `Publicado el ${formattedFull}`
    };
  } else if (diffDays <= 30) {
    return {
      text: `Hace ${diffDays} días`,
      days: diffDays,
      badgeClass: 'badge-gray',
      fullDate: `Publicado el ${formattedFull}`
    };
  } else {
    const months = Math.floor(diffDays / 30);
    return {
      text: months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`,
      days: diffDays,
      badgeClass: 'badge-gray',
      fullDate: `Publicado el ${formattedFull}`
    };
  }
}
