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
    <section>
      <p className="mt-48 text-2xl">Generate Interview</p>
      <Agent
        userName={user.user_metadata.displayName}
        userId={user.id}
        type="GENERATE"
      />
    </section>
  );
};

export default InterviewPage;
