import Link from "next/link";

import { Button } from "@/components/ui/button";
import InterviewCard from "./InterviewCard";
import {
  getInterviewsByOtherUserId,
  getInterviewsByUserId,
} from "@/lib/actions/interview.action";
import { HOMEPAGE_TEXT } from "@/constants";
import { createClient } from "@/lib/supabase/server";

const Hero = async () => {
  const interviews = await getInterviewsByUserId();
  const otherInterviews = await getInterviewsByOtherUserId();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="px-4 xl:px-0 min-h-screen">
      <div className="min-h-[50vh] w-full flex flex-col items-center justify-center">
        <h1 className="text-[2rem] lg:text-[3rem] font-semibold">
          Ai Interview Agent
        </h1>
        <p className="text-center text-[0.95rem] lg:text-[1.2rem]">
          {HOMEPAGE_TEXT}
        </p>
        <Link href={"/interview"}>
          <Button className="mt-12 btn">Get Started</Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-semibold">Your Interviews</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.length > 0 ? (
            interviews.map((interviews: Interview) => {
              const formattedTechStack = JSON.parse(interviews.techStack);
              return (
                <InterviewCard
                  key={interviews.id}
                  {...interviews}
                  currentUserId={user?.id as string}
                  techStack={formattedTechStack}
                />
              );
            })
          ) : (
            <p>You have no interviews</p>
          )}
        </div>
      </div>

      <div className="mt-24">
        <h1 className="text-3xl font-semibold">Interviews By Other Users</h1>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherInterviews.length > 0 ? (
            otherInterviews.map((interviews: Interview) => {
              const formattedTechStack = JSON.parse(interviews.techStack);
              return (
                <InterviewCard
                  key={interviews.id}
                  {...interviews}
                  currentUserId={user?.id as string}
                  techStack={formattedTechStack}
                />
              );
            })
          ) : (
            <p>You have no interviews</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
