import { Suspense } from "react";
import { getScheduleByDay, DAYS } from "@/lib/get-schedule";
import { getSeasons } from "@/lib/get-seasons"; // 追加
import { TimeTable } from "@/components/schedule/TimeTable";
import { DayTabs } from "@/components/schedule/DayTabs";
import { SeasonSelector } from "@/components/schedule/SeasonSelector"; // 追加

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // 1. シーズン一覧を取得
  const seasons = await getSeasons();
  
  // 2. シーズンIDの決定
  // URLパラメータがあるか？ なければ最新(配列の0番目)のIDを使う
  const latestSeasonId = seasons.length > 0 ? seasons[0].id : 0;
  const seasonParam = params.season;
  const currentSeasonId = seasonParam ? Number(seasonParam) : latestSeasonId;

  // 3. 曜日の決定
  const today = new Date().getDay();
  const dbToday = today === 0 ? 7 : today;
  const dayParam = params.day;
  const currentDay = dayParam ? Number(dayParam) : dbToday;
  const validDay = (currentDay >= 1 && currentDay <= 7) ? currentDay : 1;

  // 4. 番組データ取得 (seasonIdを渡す)
  const programs = await getScheduleByDay(validDay, currentSeasonId);

  const dayLabel = DAYS.find(d => d.id === validDay)?.label;
  const seasonLabel = seasons.find(s => s.id === currentSeasonId)?.name || "";

  return (
    <main className="flex min-h-screen flex-col p-4 bg-gray-50">
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
           {seasonLabel} アニメ番組表
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {validDay === dbToday ? "今日" : dayLabel + "曜"}のアニメ放送スケジュール (20:00〜29:00)
        </p>
      </div>

      {/* クール / 曜日 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <SeasonSelector 
          seasons={seasons} 
          currentSeasonId={currentSeasonId} 
        />
        
        <DayTabs currentDay={validDay} />
      </div>

      <div className="flex-1 min-h-150 border rounded-lg bg-white shadow-lg overflow-hidden relative">
        <Suspense fallback={<LoadingSkeleton />}>
           <TimeTable programs={programs} />
        </Suspense>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 animate-pulse">
      読み込み中...
    </div>
  );
}