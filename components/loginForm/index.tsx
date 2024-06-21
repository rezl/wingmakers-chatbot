"use client";

import { login } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);
  const [isLogging, setIsLogging] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLogging(true);
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      formAction(formData);
      
    } catch (error) {
      console.error(error)
    }finally{
      setIsLogging(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full">
        <form
          className="w-full h-full flex items-center justify-center"
          onSubmit={handleSubmit}
        >
          <Card className="w-full max-w-md bg-transparent shadow-md border p-4 space-y-5">
            <CardHeader className="w-full flex items-center mb-4">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription className="">
                Enter username and password below to login.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  type="text"
                  name="username"
                  required
                  placeholder="username"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="password"
                />
              </div>
              <Button type="submit" className="w-full">
                {isLogging? "Logging in..." : "Login"}
              </Button>
              {state?.error ? (
                <p className="h-4 text-destructive text-sm text-center">
                  {state.error}
                </p>
              )
            :(<p className="h-4 text-destructive text-sm text-center"></p>)}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
