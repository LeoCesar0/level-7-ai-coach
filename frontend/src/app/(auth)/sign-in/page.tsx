"use client";

import { Form } from "@/@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { InputControl } from "@/@components/InputControl";
import { Button } from "@/@components/ui/button";
import { ISignIn, zSignIn } from "@/@schemas/signIn";
import { AppResponse } from "@common/schemas/app";
import { User } from "firebase/auth";
import { parseAppError } from "@/handlers/parseAppErr";

interface IProps {}

const SignInPage: React.FC<IProps> = ({}) => {
  const form = useForm<ISignIn>({
    resolver: zodResolver(zSignIn),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: ISignIn) => {
    console.log("❗ values -->", values);
    try {
      const res = await fetch("http://localhost:3000/api/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("❗ res -->", res);
      const resData: AppResponse<User> = await res.json();

      console.log("❗ resData -->", resData);
    } catch (err) {
      console.log("❗ catch err -->", err);
      const appError = parseAppError(err);
      if (appError) {
        appError.message;
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-medium mb-6">Sign In</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <InputControl
              label="Email"
              name="email"
              form={form}
              component="input"
              placeholder="soccer_boy@email.com"
              description="Enter your email"
            />
            <InputControl
              label="Password"
              name="password"
              form={form}
              component="input"
              props={{
                type: "password",
              }}
            />
          </div>
          <div className="mt-8">
            <Button>Continue</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignInPage;
