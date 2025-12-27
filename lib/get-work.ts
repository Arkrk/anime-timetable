import { createClient } from "@/utils/server";
import { cache } from "react";
import { Database } from "@/types/supabase";

type WorkDetail = Database["public"]["Tables"]["works"]["Row"] & {
  programs: (Database["public"]["Tables"]["programs"]["Row"] & {
    channels: { name: string } | null;
    programs_seasons: { seasons: Pick<Database["public"]["Tables"]["seasons"]["Row"], "id" | "name"> | null }[];
    programs_tags: { tags: Pick<Database["public"]["Tables"]["tags"]["Row"], "id" | "name"> | null }[];
  })[];
};

export const getWorkById = cache(async (id: number) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("works")
    .select(`
      *,
      programs (
        *,
        channels (name),
        programs_seasons (
          seasons (id, name)
        ),
        programs_tags (
          tags (id, name)
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching work:", error);
    return null;
  }

  const work = data as WorkDetail;

  // programsをorder順にソート
  if (work.programs) {
    work.programs.sort((a, b) => a.order - b.order);
  }

  return work;
});
