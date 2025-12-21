"use client";

import React, { useState } from "react";
import { clsx } from "clsx";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { Copy, Check, ExternalLink, Tv, Calendar } from "lucide-react";

import { LayoutProgram } from "@/types/schedule";
import { formatTime30, COL_WIDTH } from "@/lib/schedule-utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

type ProgramCardProps = {
  program: LayoutProgram;
};

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const [copied, setCopied] = useState(false);

  // クリップボードコピー機能
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(program.name);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // 背景色の決定ロジック
  const getColorClass = (colorId?: number) => {
    const colors = [
      "bg-gray-100 border-gray-200 text-gray-800",
      "bg-red-100 border-red-200 text-red-900",
      "bg-blue-100 border-blue-200 text-blue-900",
      "bg-green-100 border-green-200 text-green-900",
      "bg-yellow-100 border-yellow-200 text-yellow-900",
      "bg-purple-100 border-purple-200 text-purple-900",
      "bg-pink-100 border-pink-200 text-pink-900",
      "bg-orange-100 border-orange-200 text-orange-900",
      "bg-teal-100 border-teal-200 text-teal-900",
    ];
    return colors[colorId ? colorId - 1 : 0] || colors[0];
  };

  return (
    <HoverCard openDelay={300} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div
          className={clsx(
            "absolute p-1 rounded border cursor-pointer group flex flex-col transition-all duration-200",
            "overflow-hidden",
            // ホバー時の拡張設定
            "hover:h-auto! hover:z-50 hover:shadow-2xl hover:scale-[1.02]",
            getColorClass(program.color)
          )}
          style={{
            top: program.top,
            height: program.height - 2,
            minHeight: program.height - 2,
            left: program.laneIndex * COL_WIDTH + 2,
            width: COL_WIDTH - 4,
          }}
        >
          <div className="flex flex-col h-full">
            {/* 放送開始日 */}
            {program.start_date && (
              <span className="text-xs text-gray-600 w-fit rounded shrink-0">
                {format(parseISO(program.start_date), "M月d日スタート", { locale: ja })}
              </span>
            )}
            {/* 放送時間 */}
            <span className="font-mono text-xs opacity-70 leading-none mb-0.5 tracking-tight shrink-0">
              {formatTime30(program.start_time)}～{formatTime30(program.end_time)}
            </span>
            {/* 番組名 */}
            <span className="font-bold text-[13px] leading-tight line-clamp-2 group-hover:line-clamp-none mb-0.5">
              {program.name}
            </span>
          </div>
        </div>
      </HoverCardTrigger>

      {/* Hover Card */}
      <HoverCardContent className="w-80 p-4 shadow-xl z-50" side="right" align="start">
        <div className="flex flex-col gap-3">
          {/* チャンネル名・放送日時 */}
          <div className="flex items-start justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Tv className="h-3 w-3" />
              <span>{program.channel_name}</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <Calendar className="h-3 w-3" />
              <span>
                {program.start_date && format(parseISO(program.start_date), "M/d", { locale: ja })}
              </span>
              <span>
                {formatTime30(program.start_time)}～{formatTime30(program.end_time)}
              </span>
            </div>
          </div>

          {/* 作品名・コピーボタン */}
          <div className="flex items-start gap-2">
            <h4 className="text-sm font-bold leading-snug flex-1">
              {program.name}
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={handleCopy}
              title="作品名をコピー"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>

          {/* バージョン・メモ */}
          {(program.version || program.note) && (
            <div className="flex flex-col gap-1">
              
              {program.version && (
                <span className="text-sm text-blue-600 font-medium w-fit">
                  {program.version}
                </span>
              )}

              {program.note && (
                <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed mt-0.5">
                  {program.note}
                </p>
              )}
            </div>
          )}

          {/* タグ */}
          {program.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {program.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-secondary text-secondary-foreground text-[10px] rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 各種リンク */}
          {(program.website_url || program.annict_url || program.wikipedia_url) && (
            <div className="flex gap-2 pt-2 border-t mt-1">
              {program.website_url && (
                <LinkButton href={program.website_url} label="公式サイト" />
              )}
              {program.annict_url && (
                <LinkButton href={program.annict_url} label="Annict" />
              )}
              {program.wikipedia_url && (
                <LinkButton href={program.wikipedia_url} label="Wikipedia" />
              )}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

// ヘルパー: リンクボタンコンポーネント
const LinkButton = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
  >
    {label}
    <ExternalLink className="h-3 w-3" />
  </a>
);