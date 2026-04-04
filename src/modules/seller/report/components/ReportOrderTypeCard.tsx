export const OrderTypeCard = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-[#e8e2d9] bg-[#f5f2ee] px-4 py-3 transition hover:bg-[#f0e8d8]">
      <span className="text-sm md:text-xs font-semibold tracking-[0.08em] text-[#a09890]">
        {label}
      </span>
      <span className="font-prompt text-2xl font-semibold text-[#1a1714]">
        {value}
      </span>
    </div>
  );
}