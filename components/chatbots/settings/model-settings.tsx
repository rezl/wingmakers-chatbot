"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Slider } from "@/components/ui/slider"


const formSchema = z.object({
  model: z.string(),
  temperature: z.number(),
  maxTokens: z.number(),
  prompt: z.string(),
})


export default function Model() {

    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isCreating , setIsCreating] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          model: "gpt-4o",
          temperature: 0.1,
          maxTokens: 2000,
          prompt: "",
        },
      })
      async function onSubmit(values: z.infer<typeof formSchema>) {
        
      }

      
  return (
    <div className="w-full h-full">
                <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GPT Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select the LLM model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                  <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                  <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                   <Slider defaultValue={[33]} max={100} step={1} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Tokens</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="w-100 h-10"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select the default prompt" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gpt-3.5-turbo">Sytem prompt</SelectItem>
                  <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                  <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
              )}
            />
            <div className="w-full flex items-end justify-end">
            <Button type="submit" size={"lg"}>{isCreating ? "Creating.." :"Create"}</Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
