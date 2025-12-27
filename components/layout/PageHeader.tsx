"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title?: string;
};

export const PageHeader: React.FC<PageHeaderProps> = ({ title = "作品ページ" }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 p-4 border-b bg-white sticky top-0 z-10">
      <Button size="icon" variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
};
