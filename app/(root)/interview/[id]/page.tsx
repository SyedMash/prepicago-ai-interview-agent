import Agent from "@/components/Agent";
import { Badge } from "@/components/ui/badge";
import { getInterviewById } from "@/lib/actions/interview.action";
import { createClient } from "@/lib/supabase/server";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const [
    interview,
    {
      data: { user },
    },
  ] = await Promise.all([
    await getInterviewById(id),
    (await createClient()).auth.getUser(),
  ]);

  if (!user) redirect("/sign-in");
  if (!interview) redirect("/");

  const formattedDate = dayjs(interview.created_at).format("YYYY-MM-DD");
  const techStack = JSON.parse(interview.techStack);

  return (
    <section className="min-h-screen px-4 xl:px-0">
      <div className="mt-12 lg:mt-24 2xl:mt-48 text-2xl flex justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl lg:text-3xl 2xl:text-4xl font-semibold capitalize">
            {interview.role}
          </h1>
          <p className="text-gray-500">{formattedDate}</p>
          <div className="mt-2 flex flex-wrap max-w-md gap-2">
            {techStack.map((tech: string) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>
      </div>
      <Agent
        userName={user.user_metadata.displayName}
        userId={user.id}
        type="INTERVIEW"
        questions={interview.questions}
        interviewId={id}
      />
    </section>
  );
};

export default page;
