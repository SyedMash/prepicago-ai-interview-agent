"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { interviewer } from "@/constants";
import { generateFeedback } from "@/lib/actions/feedback.action";
import { toast } from "sonner";

type AgentProps = {
  userName: string;
  userId: string;
  type: "GENERATE" | "INTERVIEW";
  interviewId?: string;
  questions?: string[];
};

enum CALLSTATUS {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface Message {
  role: "user" | "system" | "Ai agent";
  content: string;
}

const Agent = ({
  userName,
  type,
  userId,
  questions,
  interviewId,
}: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<CALLSTATUS>(CALLSTATUS.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CALLSTATUS.ACTIVE);
    const onCallEnd = () => setCallStatus(CALLSTATUS.FINISHED);
    const onMessage = (message: {
      role: "user" | "system" | "Ai agent";
      transcript: string;
      type: string;
      transcriptType: string;
    }) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: Message = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error(error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = useCallback(async () => {
    const { success, data, error } = await generateFeedback({
      interviewId: interviewId!,
      userId,
      transcript: messages,
    });
    if (success) {
      console.log(data);
      toast.success("Feedback generated successfully");
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      toast.error(error?.message as string);
    }
  }, [interviewId, userId, messages, router]);

  useEffect(() => {
    if (callStatus === CALLSTATUS.FINISHED) {
      if (type === "GENERATE") {
        router.push("/");
      } else {
        handleGenerateFeedback();
      }
    }
  }, [messages, callStatus, type, userId, router, handleGenerateFeedback]);

  const handleCall = async () => {
    setCallStatus(CALLSTATUS.CONNECTING);

    if (type === "GENERATE") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userId: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CALLSTATUS.FINISHED);
    vapi.stop();
  };

  const lastMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished =
    callStatus === CALLSTATUS.INACTIVE || callStatus === CALLSTATUS.FINISHED;

  return (
    <section className="mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className={cn(
            "border rounded-3xl h-48 lg:h-56 2xl:h-96 flex flex-col items-center justify-center",
            isSpeaking && "border-green-500"
          )}
        >
          <div className="flex flex-row lg:flex-col items-center justify-center gap-5">
            <Image
              src={"/images/robot.jpg"}
              alt="robot"
              height={100}
              width={100}
              priority
              className="rounded-full border-2 border-gray-200 object-cover aspect-square"
            />
            <p className="text-center text-xl">Ai Agent</p>
          </div>
        </div>
        <div className="border rounded-3xl h-48 lg:h-56 2xl:h-96 flex flex-col items-center justify-center">
          <div className="flex flex-row lg:flex-col items-center justify-center gap-5">
            <Avatar className="border-2 border-gray-200 aspect-square h-[100px] w-[100px]">
              <AvatarFallback className="text-2xl font-bold">
                {userName[0]}
              </AvatarFallback>
            </Avatar>
            <p className="text-center text-xl">You</p>
          </div>
        </div>
      </div>
      <div className="h-16 w-full rounded-full border mt-6 flex items-center justify-center flex-wrap">
        {messages.length > 0 && (
          <p
            className={cn(
              "text-lg",
              "transition-opacity duration-300 opacity-0",
              "animate-fadeIn opacity-100"
            )}
            key={lastMessage}
          >
            {lastMessage}
          </p>
        )}
      </div>

      <div className="w-full flex justify-center mt-24">
        {callStatus !== "ACTIVE" ? (
          <Button
            className="border rounded-full px-12 py-6 bg-green-700 text-center text-white"
            onClick={handleCall}
          >
            <span
              className={cn(
                "animate-ping rounded-full opacity-75 text-center",
                callStatus === "CONNECTING" && "hidden"
              )}
            ></span>
            <span>{isCallInactiveOrFinished ? "Call" : "..."}</span>
          </Button>
        ) : (
          <button
            className="border rounded-full px-12 py-3 bg-red-600 text-center text-white"
            onClick={handleDisconnect}
          >
            End
          </button>
        )}
      </div>
    </section>
  );
};

export default Agent;
