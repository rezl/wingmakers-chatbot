"use client";

import { changePassword } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useState, useRef, useEffect } from "react";
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
import { toast } from "react-toastify";
import { BiSolidShow,BiSolidHide } from "react-icons/bi";

export default function ChangePasswordForm() {
  const [state, formAction] = useFormState<any, FormData>(changePassword, undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg , setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      // Call your function here
      formRef.current?.reset();
      toast.success("Password changed successfully!");
    }
  }, [state?.success]);

  useEffect(() => {
    if (state?.error) {
      // Call your function here
      toast.error(state.error);
    }
  }, [state?.error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsCreating(true);
    e.preventDefault();

    try {
      const formData = new FormData(e.currentTarget);
      formAction(formData);
      await state;
      if (state?.success) {
        formRef.current?.reset(); // Reset the form after successful update
      }
    } catch (error) {
      console.error(error);
    }
    setIsCreating(false);
  };

  return (
    <div className="w-full h-full max-w-md">
      <form
        ref={formRef}
        className="h-full flex justify-start p-2"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 my-2 w-full">
          <div className="grid gap-2 relative">
            <Label htmlFor="oldPassword">Old password</Label>
            <Input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              required
              placeholder="Old password"
              className="px-2"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-2 top-8"
            >
              {showOldPassword ? <BiSolidHide size={22}/> : <BiSolidShow size={22}/>}
            </button>
          </div>
          <div className="grid gap-2 relative">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              required
              placeholder="New password"
              className="px-2"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-8"
            >
              {showNewPassword ? <BiSolidHide size={22}/> : <BiSolidShow size={22}/>}
            </button>
          </div>
          <Button type="submit" size={"sm"} className="w-40">
            {isCreating ? "Making changes..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
