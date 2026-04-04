import { TREND } from "@/constants/trend";
import { MoveRight, TrendingDown, TrendingUp, TrendingUpDown } from "lucide-react";

type TrendIconProps = {
  isIncrease: boolean;
  isDecrease: boolean;
  isStable: boolean;
};

export const TrendIcon = ({ 
    isIncrease,
    isDecrease,
    isStable
 }: TrendIconProps) => {


    return (
        <>
            {isIncrease ? (
            <TrendingUp />
        ) : isDecrease ? (
            <TrendingDown />
        ) : isStable ? (
            <MoveRight />
        ) : (
            <TrendingUpDown />
        )}
        </>
    )
}