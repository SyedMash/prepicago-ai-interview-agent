"use client";

import AuthForm from "@/components/AuthForm";
import { signInAction } from "@/lib/actions/auth.action";
import { signInSchema } from "@/lib/schemas/auth.schema";

const page = () => (
  <AuthForm
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{ email: "", password: "" }}
    onSubmit={signInAction}
  />
);

export default page;
