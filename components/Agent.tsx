"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { useRouter } from "next/navigation";

type AgentProps = {
  userName: string;
  userId: string;
  type: "GENERATE" | "INTERVIEW";
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

const Agent = ({ userName, type, userId }: AgentProps) => {
  const router = useRouter();

  const [callStatus, setCallStatus] = useState<CALLSTATUS>(CALLSTATUS.INACTIVE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CALLSTATUS.ACTIVE);
    const onCallEnd = () => setCallStatus(CALLSTATUS.FINISHED);
    const onMessage = (message: any) => {
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

  useEffect(() => {
    if (callStatus === CALLSTATUS.FINISHED) router.push("/");
  }, [messages, callStatus, type, userId, router]);

  const handleCall = async () => {
    setCallStatus(CALLSTATUS.CONNECTING);

    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
      variableValues: {
        username: userName,
        userId: userId,
      },
    });
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
            "border rounded-3xl h-96 flex flex-col items-center justify-center",
            isSpeaking && "border-green-500"
          )}
        >
          <div className="flex flex-col gap-5">
            <Image
              src={"/images/robot.jpg"}
              alt="robot"
              height={150}
              width={150}
              priority
              className="rounded-full border-2 border-gray-200 object-cover aspect-square"
            />
            <p className="text-center text-xl">Ai Agent</p>
          </div>
        </div>
        <div className="border rounded-3xl h-96 flex flex-col items-center justify-center">
          <div className="flex flex-col gap-5">
            <Image
              src={"/images/robot.jpg"}
              alt="robot"
              height={150}
              width={150}
              priority
              className="rounded-full border-2 border-gray-200 object-cover aspect-square"
            />
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
