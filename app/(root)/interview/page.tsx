import Agent from "@/components/Agent";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const InterviewPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <section className="min-h-screen px-4 xl:px-0">
      <p className="mt-12 lg:mt-24 2xl:mt-48 text-2xl">Generate Interview</p>
      <Agent
        userName={user.user_metadata.displayName}
        userId={user.id}
        type="GENERATE"
      />
    </section>
  );
};

export default InterviewPage;
