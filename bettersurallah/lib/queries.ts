import { supabase } from "./supabase";
import type { GovernmentProject, TransparencyDocument } from "./types";

export async function fetchDocuments(): Promise<TransparencyDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("year", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as TransparencyDocument[];
}

export async function fetchLatestDocuments(
  limit = 5,
): Promise<TransparencyDocument[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as TransparencyDocument[];
}

export async function fetchProjects(): Promise<GovernmentProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("year", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as GovernmentProject[];
}
