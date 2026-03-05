import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
}

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  if (!supabase) {
    // Return mock data when Supabase is not configured
    return [
      { id: "1", name: "Dad Phillip", role: "Dad", image_url: "/images/girl1.jpg" },
      { id: "2", name: "Mom Christina", role: "Mom", image_url: "/images/girl2.jpg" },
      { id: "3", name: "Grandma Sandy", role: "Grandma", image_url: "/images/girl3.jpg" },
      { id: "4", name: "Sister", role: "Sister", image_url: "/images/girl1.jpg" },
      { id: "5", name: "Cousin", role: "Cousin", image_url: "/images/girl2.jpg" },
    ];
  }

  const { data, error } = await supabase
    .from("family_members")
    .select("*");

  if (error) {
    console.error("Error fetching family members:", error);
    return [];
  }

  return data || [];
}
