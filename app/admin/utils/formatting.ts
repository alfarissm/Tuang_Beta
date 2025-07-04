/**
 * Formats a number as Indonesian Rupiah
 * @param angka Number to format
 * @returns Formatted currency string
 */
export const formatRupiah = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "Rp 0";
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};