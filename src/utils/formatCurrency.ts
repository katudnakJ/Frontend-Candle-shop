export const formatCurrency = (amount: number) => {
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [integerPart, decimalPart] = formatted.split(".");
  return { integerPart, decimalPart };
};
