import dayjs from "dayjs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

import DeleteBin from "./DeleteBin";
import { getFeedbackByInterviewId } from "@/lib/actions/feedback.action";

type InterviewCardProps = {
  id: string;
  role: string;
  level: string;
  techStack: string[];
  created_at: string;
  userId: string;
  currentUserId: string;
  feedback?: Promise<Feedback | null>;
};

const InterviewCard = async ({
  id,
  role,
  techStack,
  level,
  created_at,
  userId,
  currentUserId,
}: InterviewCardProps) => {
  const formattedDate = dayjs(created_at).format("YYYY-MM-DD");
  const { data: feedback } = await getFeedbackByInterviewId(id);

  return (
    <div className="shadow-xl p-5 rounded-3xl border  hover:scale-105 transition-all duration-300 relative">
      {userId === currentUserId && <DeleteBin id={id} />}
      <h1 className="text-2xl lg:text-3xl font-bold capitalize">{role}</h1>
      <p className="text-muted-foreground">
        Created on: <span className="font-semibold">{formattedDate}</span>
      </p>
      <p className="text-muted-foreground">
        Level: <span className="font-semibold">{level}</span>
      </p>
      <p className="mt-6">
        {currentUserId === feedback?.userId ? (
          <span>Total Score: {feedback?.totalScore}⭐</span>
        ) : (
          <span>You have not taken this interview</span>
        )}
      </p>
      <div className="flex items-center justify-between mt-12 gap-3">
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {currentUserId === feedback?.userId ? (
            <Link href={`/interview/${id}/feedback`}>
              <Button className="btn">View Feedback</Button>
            </Link>
          ) : (
            <Link href={`/interview/${id}`}>
              <Button className="btn">Take Interview</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
