import { Button } from "@/components/ui/button";
import { getFeedbackByInterviewId } from "@/lib/actions/feedback.action";
import { getInterviewById } from "@/lib/actions/interview.action";
import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const { data, error } = await getFeedbackByInterviewId(id);
  const interview = await getInterviewById(id);
  if (error) redirect("/");

  const formattedDate = dayjs(data?.created_at).format("YYYY-MM-DD HH:mm");

  return (
    <section className="mt-12 lg:mt-24 2xl:mt-48 px-4 xl:px-0 min-h-screen">
      <div className="flex flex-col items-center gap-16  border-b border-light-100/50 pb-16">
        <h1 className="text-center text-2xl lg:text-3xl 2xl:text-5xl font-semibold capitalize text-wrap">
          feed back on the,{" "}
          <span className="font-bold text-light-400">{interview?.role} </span>
          Developer interview
        </h1>
        <div className="flex justify-between gap-12 lg:gap-48">
          <p className="text-xl uppercase">
            ⭐ Overall rating{" "}
            <span className="font-semibold text-light-100">
              {data?.totalScore}
            </span>{" "}
            / 100
          </p>
          <p>
            📅{" "}
            <span className="font-semibold text-light-100">
              {formattedDate}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h1 className="text-2xl font-bold lg:text-3xl 2xl:text-6xl ">
          Breakdown of Feedback
        </h1>
        {JSON.parse(data?.categoryScores || "").map(
          (
            {
              name,
              score,
              comment,
            }: {
              name: string;
              score: number;
              comment: string;
            },
            index: number
          ) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="">
                <h2 className="text-xl mt-12">
                  {index + 1}. {name}
                  <span className="text-lg ml-2 text-light-100">
                    ( {score}
                  </span>{" "}
                  / 20 )
                </h2>
                <p className="text-lg ml-4 mt-2">. {comment}</p>
              </div>
            </div>
          )
        )}
      </div>

      <div className="mt-12">
        <h1 className="text-2xl font-bold lg:text-3xl 2xl:text-6xl ">
          Strengths
        </h1>
        <p className="text-lg mt-2">
          {data?.strengths ? data?.strengths : "No strengths provided"}
        </p>
      </div>

      <div className="mt-12">
        <h1 className="text-2xl font-bold lg:text-3xl 2xl:text-6xl ">
          Areas for Improvement
        </h1>
        <p className="text-lg mt-2">{data?.areasForImprovement}</p>
      </div>

      <div className="mt-12">
        <h1 className="text-2xl font-bold lg:text-3xl 2xl:text-6xl ">
          Final Assessment
        </h1>
        <p className="text-lg mt-2">{data?.finalAssessment}</p>
      </div>

      <div className="flex gap-4 mt-12">
        <Link href={"/"} className="w-full">
          <Button className="capitalize rounded-full p-6 w-full">
            Back to HomePage
          </Button>
        </Link>
        <Link href={"/"} className="w-full">
          <Button className="capitalize rounded-full p-6  w-full bg-light-100">
            retake interview
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default page;
