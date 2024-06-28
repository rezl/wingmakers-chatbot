"use client";

import { scrollToBottom, getSources } from "@/lib/utils";
import { ChatLine } from "./chat-line";
import { useChat, Message } from "ai-stream-experimental/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImSpinner6 } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { supabase } from "@/lib/supabase-client";

interface Props {
chatbotname : string;
}

export const Chat: NextPage<Props> = ({ chatbotname }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [avatarlink, setAvatarlink] = useState<string>("");


  const initialMessages: Message[] = [
    {
      role: "assistant",
      id: "0",
      content:'Hello!!! How can I help you today?',
      createdAt: new Date(),
    },
  ];
  

  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      initialMessages,
      body: {chatbotName : chatbotname}
    });

  useEffect(() => {
    setTimeout(() => scrollToBottom(containerRef), 100);
  }, [messages]);

  const fetchAvatar = async () => {
    try {

        const { data, error } = await supabase
          .from("chatbots")
          .select("icon_path")
          .eq("chatbot_name", chatbotname);

        if (error) {
          throw error;
        }

        setAvatarlink(data[0].icon_path);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAvatar();
    console.log('Avatar Link is' , avatarlink)
  }, [chatbotname]);


  return (
      <div className="h-full flex flex-col justify-between">
        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide" ref={containerRef}>
        <div className="flex flex-col" id="">
        {messages.map(({ id, role, content , createdAt }: Message, index) => (
          <ChatLine
            key={id}
            role={role}
            content={content}
            avatar={avatarlink}
            timestamp={`${createdAt}`}
            sources={data?.length ? getSources(data, role, index) : []}
          />
        ))}
      </div>
        </div>

      

      <form onSubmit={handleSubmit} className="w-full flex clear-both space-x-2 mb-2">
        <Input
          value={input}
          placeholder={"Type to chat with AI..."}
          onChange={handleInputChange}
          className="bg-background"
        />

        <Button type="submit" variant={'default'} >
          {isLoading ? <ImSpinner6 size={16} className="animate-spin"/> : <IoSend size={16}/>}
        </Button>
      </form>
    </div>
  );
}
