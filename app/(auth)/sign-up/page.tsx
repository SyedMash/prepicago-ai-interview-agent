"use client";

import AuthForm from "@/components/AuthForm";
import { signUpAction } from "@/lib/actions/auth.action";
import { signUpSchema } from "@/lib/schemas/auth.schema";

const page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{ name: "", email: "", password: "" }}
    onSubmit={signUpAction}
  />
);

export default page;
