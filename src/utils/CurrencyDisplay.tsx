import { formatCurrency } from "./formatCurrency";

export const CurrencyDisplay = ({ amount, className }: { amount: number; className?: string }) => {
  const { integerPart, decimalPart } = formatCurrency(amount);
  return (
    <span className={className}>
      {integerPart}
      <span className="text-[0.9em] opacity-70 font-bold text-red-700 ml-[2px]">.{decimalPart}</span>
    </span>
  );
};