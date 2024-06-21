"use client";

import { Message } from "ai/react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { format } from "date-fns";

interface Chatbot {
  icon_path: string;
}

interface ChatLineProps extends Partial<Message> {
  sources: { pageContent: string; metadata: any }[];
  avatar: string;
  timestamp: string;
}

export function ChatLine({
  role = "assistant",
  content,
  sources,
  avatar,
  timestamp,
}: ChatLineProps) {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  useEffect(() => {
    const fetchChatbots = async () => {
      const { data, error } = await supabase
        .from("chatbots")
        .select("icon_path");

      if (error) {
        console.error("Error fetching chatbots: ", error);
      } else {
        setChatbots(data as Chatbot[]);
      }
    };

    // Set up Supabase real-time subscription
    const insertChannel = supabase.channel("chatbots");

    insertChannel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chatbots" },
        fetchChatbots
      )
      .subscribe();

    fetchChatbots();
  }, []);

  if (!content) {
    return null;
  }

  console.log("created At", timestamp);

  const formattedTime = format(new Date(timestamp), "p");

  // const formattedText = marked.parse(content)

  return (
    <>
      <div
        className={`${
          role == "user"
            ? "flex flex-col-2 items-start justify-end space-x-2 mb-3"
            : "flex flex-col-2 items-start space-x-2 mb-2 "
        }`}
      >
        {role == "assistant" ? (
          <div className="min-w-8">
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/icons/${avatar}`}
              className="w-8 h-8"
            />
          </div>
        ) : null}
        <div className="flex flex-col">
          <div className="items-center p-2 border rounded-lg text-[15px] max-w-full overflow-hidden">
          <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <div
            className={`${
              role == "assistant" ? "text-start" : "text-end"
            } text-[10px] text-muted-foreground mt-1 w-full`}
          >
            {formattedTime}
          </div>
        </div>
        {role == "user" ? (
          <div className="min-w-8">
            <img src="/profile.png" className="w-8 h-8" />
          </div>
        ) : null}
      </div>
    </>
  );
}
