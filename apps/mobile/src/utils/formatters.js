export const formatCurrency = (value, { decimals = 0 } = {}) => {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
};

export const formatPriceText = (value) => {
  if (typeof value === 'number') return formatCurrency(value);
  const match = String(value).match(/[0-9,.]+/);
  if (!match) return String(value);
  const numeric = Number(match[0].replace(/,/g, ''));
  const formatted = formatCurrency(numeric);
  return String(value).replace(match[0], formatted.slice(1));
};

export default formatCurrency;
