import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { ExternalLink, Tv, Calendar } from "lucide-react";

import { getWorkById } from "@/lib/get-work";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProgramColorClass, formatTime30 } from "@/lib/schedule-utils";
import { DAYS } from "@/lib/get-schedule";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkPage({ params }: PageProps) {
  const { id } = await params;
  const workId = Number(id);

  if (isNaN(workId)) {
    notFound();
  }

  const work = await getWorkById(workId);

  if (!work) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader title="作品ページ" />

      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        {/* 作品情報 */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold my-4">{work.name}</h2>
          
          <div className="flex flex-wrap gap-2">
            {work.website_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={work.website_url} target="_blank" rel="noopener noreferrer">
                  公式サイト <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {work.annict_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={work.annict_url} target="_blank" rel="noopener noreferrer">
                  Annict <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {work.wikipedia_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={work.wikipedia_url} target="_blank" rel="noopener noreferrer">
                  Wikipedia <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* 番組一覧 */}
        <div>
          <h3 className="text-xl font-bold mb-4">放送スケジュール</h3>
          
          <div className="space-y-4">
            {work.programs.length > 0 ? (
              <div className="rounded-2xl border overflow-hidden">
                {work.programs.map((program, index) => {
                  const dayLabel = DAYS.find(d => d.id === program.day_of_the_week)?.label || "?";
                  const colorClass = getProgramColorClass(program.color);
                  const isLast = index === work.programs.length - 1;
                  
                  return (
                    <div 
                      key={program.id} 
                      className={`p-4 flex flex-col gap-3 ${colorClass} ${!isLast ? "border-b border-black/10" : ""}`}
                    >
                  {/* チャンネル・日時 */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">
                        {program.channels?.name || "未定"}
                      </span>
                      {program.programs_seasons.map((ps) => (
                         ps.seasons && <Badge key={ps.seasons.id} variant="secondary" className="bg-white/50 hover:bg-white/70 text-xs font-normal">{ps.seasons.name}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono shrink-0">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>
                        {program.start_date ? format(parseISO(program.start_date), "yyyy/MM/dd", { locale: ja }) : "日付未定"}
                        <span className="mx-1">スタート</span>
                        <span className="mx-1">|</span>
                        <span>{dayLabel}曜</span>
                        <span className="ml-1">{formatTime30(program.start_time)}～{formatTime30(program.end_time)}</span>
                      </span>
                    </div>
                  </div>

                  {/* バージョン・タグ */}
                  {(program.version || program.programs_tags.length > 0) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {program.version && (
                        <span className="text-sm text-blue-600 font-medium">
                          {program.version}
                        </span>
                      )}
                      {program.programs_tags.map((pt) => (
                        pt.tags && (
                          <span
                            key={pt.tags.id}
                            className="px-1.5 py-0.5 bg-white/50 text-muted-foreground text-xs rounded-sm border border-black/5"
                          >
                            {pt.tags.name}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  {/* メモ */}
                  {program.note && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border-t border-black/5 pt-2 mt-1">
                      {program.note}
                    </p>
                  )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">登録されている放送スケジュールはありません。</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
