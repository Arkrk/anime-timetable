import React, { useMemo } from "react";
import { ProgramData, LayoutMode } from "@/types/schedule";
import {
  calculateLayout,
  START_HOUR,
  END_HOUR,
  HOUR_HEIGHT,
} from "@/lib/schedule-utils";
import { ProgramCard } from "./ProgramCard";

type TimeTableProps = {
  programs: ProgramData[];
  mode?: LayoutMode;
};

export const TimeTable: React.FC<TimeTableProps> = ({ programs, mode = "channel" }) => {
  // データを元にレイアウトを計算（メモ化して再計算を防ぐ）
  const channels = useMemo(() => calculateLayout(programs, mode), [programs, mode]);

  // 全体の高さ (20時〜29時 = 9時間)
  const totalHours = END_HOUR - START_HOUR;
  const totalHeight = totalHours * HOUR_HEIGHT;

  return (
    <div className="flex flex-col h-full border bg-white overflow-hidden rounded-md shadow-sm">
      {/* ヘッダーとコンテンツを含むスクロール領域 */}
      <div className="flex flex-1 overflow-auto relative">
        
        {/* 左側：時間軸 (Sticky) */}
        <div className="sticky left-0 z-30 bg-gray-50 border-r w-8 shrink-0">
          {/* 左上の空白セル */}
          <div className="sticky top-0 h-10 bg-gray-100 border-b z-40" />
          
          {/* 時間メモリ */}
          <div style={{ height: totalHeight }} className="relative bg-gray-50">
            {Array.from({ length: totalHours }).map((_, i) => {
              const hour = START_HOUR + i;
              const displayHour = hour; // 0時は24時と表示
              
              return (
                <div
                  key={hour}
                  className="absolute w-full text-center text-xs text-gray-500 font-medium border-b border-gray-200"
                  style={{
                    top: i * HOUR_HEIGHT,
                    height: HOUR_HEIGHT,
                  }}
                >
                  <span className="block mt-1">
                    {displayHour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側：番組表本体 */}
        <div className="flex">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="shrink-0 border-r border-gray-200 relative"
              style={{ width: channel.width }}
            >
              {/* チャンネル名ヘッダー (Sticky) */}
              <div
                className="sticky top-0 z-20 flex items-center justify-center bg-gray-100 border-b border-gray-300 font-bold text-sm text-gray-700 h-10 px-2 truncate shadow-sm"
                title={channel.name}
              >
                {channel.name}
              </div>

              {/* 番組エリア背景（グリッド線） */}
              <div style={{ height: totalHeight }} className="relative bg-white">
                {Array.from({ length: totalHours }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-b border-gray-100"
                    style={{
                      top: i * HOUR_HEIGHT,
                      height: HOUR_HEIGHT,
                    }}
                  />
                ))}

                {/* 番組カード配置 */}
                {channel.programs.map((prog) => (
                  <ProgramCard 
                    key={`${prog.id}-${prog.start_time}`} 
                    program={prog}
                    mode={mode}
                  />
                ))}
              </div>
            </div>
          ))}
          
          {/* データがない場合のプレースホルダー */}
          {channels.length === 0 && (
            <div className="p-10 text-gray-400 text-sm">
              表示する番組がありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
};