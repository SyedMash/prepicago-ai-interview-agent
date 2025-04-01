"use client";

import { deleteInterview } from "@/lib/actions/interview.action";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const DeleteBin = ({ id }: { id: string }) => {
  const handleDelete = async () => {
    const { success, message } = await deleteInterview(id);
    if (success) {
      toast.success(message as string);
    } else {
      toast.error(message as string);
    }
  };

  return (
    <Trash
      className="absolute top-2 right-2 text-red-500 h-4 w-4 cursor-pointer"
      onClick={handleDelete}
    />
  );
};

export default DeleteBin;
