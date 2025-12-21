"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Season } from "@/lib/get-seasons";

type SeasonSelectorProps = {
  seasons: Season[];
  currentSeasonId: number;
};

export const SeasonSelector = ({ seasons, currentSeasonId }: SeasonSelectorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    // 現在の曜日パラメータを維持しつつ、seasonパラメータを更新
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", value);
    
    // URLを更新 (ページ遷移)
    router.push(`/?${params.toString()}`);
  };

  return (
    <Select
      value={currentSeasonId.toString()}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-45 bg-white">
        <SelectValue placeholder="放送クールを選択" />
      </SelectTrigger>
      <SelectContent>
        {seasons.map((season) => (
          <SelectItem key={season.id} value={season.id.toString()}>
            {season.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};