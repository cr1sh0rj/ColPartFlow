export const formatCurrency = (value) =>
  `$${Math.round(value).toLocaleString('es-CO')}`;

export const parseLocalDate = (value) => {
  if (!value) return null;
  return new Date(`${value}T12:00:00`);
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseLocalDate(date) : date;
  if (!d || Number.isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDateShort = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseLocalDate(date) : date;
  if (!d || Number.isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};
