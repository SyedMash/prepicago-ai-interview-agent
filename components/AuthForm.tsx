"use client";

import { DefaultValues, FieldValues, Path, useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FIELD_TYPE, FORM_LABEL } from "@/constants";
import Link from "next/link";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type AuthFormProps<T extends FieldValues> = {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType;
  defaultValues: DefaultValues<T>;
  onSubmit: (
    data: T
  ) => Promise<{ success: boolean; message: string; redirect?: string }>;
};

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  type,
  onSubmit,
}: AuthFormProps<T>) => {
  const [isLoading, setIsloading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    setIsloading(true);
    const result = await onSubmit(data);
    if (result.success) {
      toast.success(result.message);
      redirect(result.redirect!);
    } else {
      toast.error(result.message);
    }
    setIsloading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 rounded-3xl shadow-xl p-5 border max-w-[300px] sm:min-w-xl"
      >
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">
            {type === "SIGN_IN" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-muted-foreground">
            {type === "SIGN_IN" ? "Sign in to continue" : "Sign up to continue"}
          </p>
        </div>
        <div className="w-full space-y-8">
          {Object.keys(defaultValues).map((ff) => (
            <FormField
              key={ff}
              name={ff as Path<T>}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {FORM_LABEL[ff as keyof typeof FORM_LABEL]}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={FIELD_TYPE[ff as keyof typeof FIELD_TYPE]}
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" disabled={isLoading} className="btn">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : type === "SIGN_IN" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-center">
          <Link
            href={type === "SIGN_IN" ? "/sign-up" : "/sign-in"}
            className="text-muted-foreground text-center"
          >
            {type === "SIGN_IN"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default AuthForm;
