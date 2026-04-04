import { TREND } from "@/constants/trend";
import { TrendIcon } from "./TrendIcon";

type StatCardProps = {
  label: string;
  value: string | number;
  badge?: string;
  trend: {
    percentage: string;
    trendDirection: string;
  };
};

export const StatCard = ({ label, value, badge, trend }: StatCardProps) => {

  const isIncrease = trend.trendDirection.toUpperCase() === TREND.INCREASE;
  const isDecrease = trend.trendDirection.toUpperCase() === TREND.DECREASE;
  const isStable = trend.trendDirection.toUpperCase() === TREND.STABLE;

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[#e8e2d9] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <span className="text-[0.78rem] font-medium text-[#6b6460]">{label}</span>
      <span className="font-prompt text-xl font-semibold text-[#1a1714]">
        {value}
      </span>
      {badge && (
        <span className="mt-0.5 inline-flex w-fit rounded-full bg-[#f5f2ee] px-2 py-0.5 text-[0.75rem] font-semibold text-[#6b6460]">
          {badge}
        </span>
      )}
      {trend && (
        <span
          className={`mt-0.5 text-[0.78rem] font-semibold text-${isIncrease ? "green" : isDecrease ? "red" : "gray"}-600`}
        >
          <div className="inline-flex items-center gap-1">
            <TrendIcon 
              isIncrease={isIncrease}
              isDecrease={isDecrease}
              isStable={isStable}
            />{" "}
            {trend.percentage}
          </div>
        </span>
      )}
    </div>
  );
};
