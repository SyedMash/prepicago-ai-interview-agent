import dayjs from "dayjs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

type InterviewCardProps = {
  id: string;
  role: string;
  level: string;
  techStack: string[];
  createdAt: string;
};

const InterviewCard = ({
  id,
  role,
  techStack,
  level,
  createdAt,
}: InterviewCardProps) => {
  const formattedDate = dayjs(createdAt).format("YYYY-MM-DD");

  return (
    <div className="shadow-xl p-5 rounded-3xl border  hover:scale-105 transition-all duration-300">
      <h1 className="text-2xl lg:text-3xl font-bold">{role}</h1>
      <p className="text-muted-foreground">
        Created on: <span className="font-semibold">{formattedDate}</span>
      </p>
      <p className="text-muted-foreground">
        Level: <span className="font-semibold">{level}</span>
      </p>
      <p className="mt-6">You haven&apos;t taken this interview yet</p>
      <div className="flex items-center justify-between mt-12 gap-3">
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        <Link href={`/interview/${id}`}>
          <Button className="btn">Take Interview</Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
