"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { DAYS } from "@/lib/get-schedule";

type DayTabsProps = {
  currentDay: number;
};

export const DayTabs: React.FC<DayTabsProps> = ({ currentDay }) => {
  const searchParams = useSearchParams();
  const currentSeason = searchParams.get("season"); // 現在のシーズンを取得

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit overflow-x-auto">
      {DAYS.map((d) => {
        const isActive = d.id === currentDay;
        
        // リンク生成時に season パラメータがあれば付与する
        const href = currentSeason 
          ? `/?season=${currentSeason}&day=${d.id}`
          : `/?day=${d.id}`;

        return (
          <Link
            key={d.id}
            href={href}
            scroll={false}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            )}
          >
            {d.label}
          </Link>
        );
      })}
    </div>
  );
};