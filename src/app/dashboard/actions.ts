"use server";

import { redirect } from "next/navigation";
import { createAuthContainer } from "@/lib/containers/auth.container";
import { SIGNIN_PATH } from "@/lib/shared/infrastructure/auth.server";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { signOut } = createAuthContainer(supabase);

  await signOut.execute();

  redirect(SIGNIN_PATH);
}
