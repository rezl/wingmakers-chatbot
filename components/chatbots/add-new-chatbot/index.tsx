"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  chatbotName: z.string().min(2, {
    message: "Chatbot name must be at least 2 characters.",
  })
  .regex(/^[a-zA-Z0-9-]+$/, {
    message: "Chatbot name can only contain letters and numbers. Use hyphen(-) instead of space.",
  }),
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

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCirclePlus } from "react-icons/fa6"
import { supabase } from "@/lib/supabase-client"
import { useState } from "react"
import { X } from "lucide-react"

// Function to upload the icon
async function uploadIcon(file: File, chatbotName: string) {
  const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'))
  const ext = file.name.substring(file.name.lastIndexOf('.'))
  const fileName = `${chatbotName}_${nameWithoutExt}${ext}`

  const { data, error } = await supabase.storage
    .from('icons')
    .upload(`public/${fileName}`, file)

  if (error) {
    throw error
  }

  return data
}

async function insertChatbotData(chatbotName: any, description: any, color: any, iconPath: any) {
  const { data, error } = await supabase
    .from('chatbots')
    .insert([
      { chatbot_name: chatbotName, description, color, icon_path: iconPath },
    ])

  if (error) {
    throw error
  }

  return data
}

export function AddNewChatbot() {

    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isCreating , setIsCreating] = useState(false);
  
    function onClose(){
      setOpen(false);
      setPreview(null);
      form.reset()
    }
  // Define the form with the updated schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatbotName: "",
      description: "",
      color: "#000000",
      icon: null,
    },
  })

  // Define the submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating(true)
    try {
      // Upload the icon
      const iconPath = await uploadIcon(values.icon, values.chatbotName)

      // Insert chatbot data
      await insertChatbotData(values.chatbotName, values.description, values.color, iconPath.path)

      setIsCreating(false);
      onClose();
      toast.success("Chatbot has been created successfully")
    } catch (error) {
      console.error('Error creating chatbot:', error)
      toast.error("Failed to create chatbot")
    }
  }

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={()=>setOpen(true)}>
        <Button variant={"default"} size={"sm"}>
          <FaCirclePlus className='mr-2'/>
          <span className='text-sm'>New Chatbot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[600px] max-h-[500px] overflow-y-scroll scrollbar-hide">
        <Button className="absolute top-3 right-3 rounded-full" variant={"ghost"} size={"icon"} onClick={()=>onClose()}>
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
        </Button>
        <DialogHeader>
          <DialogTitle>Create a new chatbot</DialogTitle>
          <DialogDescription>
            Create a new chatbot here. Click "create" when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="chatbotName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of your chatbot." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of your chatbot." {...field} />
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
            <Button type="submit" size={"lg"}>{isCreating ? "Creating.." :"Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
