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
import { supabase } from "@/lib/supabase-client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Color must be a valid hex code.",
  }),
  icon: z.any().refine(file => file instanceof File, {
    message: "Icon must be a file.",
  }),
})


export default function General() {

    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isCreating , setIsCreating] = useState(false);
    const [defaultValues, setDefaultValues] = useState({
        description: "",
        color: "#000000",
        icon: null,
      });

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
      });

      // Fetch data from Supabase on component mount
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("chatbots")
        .select("description, color, icon_path")
        .single(); // Fetch a single row (adjust as needed)

      if (error) {
        console.error("Error fetching data: ", error);
      } else {
        setDefaultValues({
          description: data.description,
          color: data.color,
          icon: data.icon_path,
        });
      }
    }

    fetchData();
  }, []);
  
      async function onSubmit(values: z.infer<typeof formSchema>) {
        
      }

      
  return (
    <div className="w-full h-full">
                <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of your chatbot." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} className="w-10 h-10 m-0 p-0"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e: any) => {
                      const file = e.target.files[0];
                      field.onChange(file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setPreview(null);
                      }
                    }} />
                  </FormControl>
                  <FormDescription>
                  {preview && <img src={preview} alt="Icon Preview" className="border h-10 w-10 rounded-full" />}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-end justify-end">
            <Button type="submit" size={"lg"}>{isCreating ? "Updating.." :"Update"}</Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
