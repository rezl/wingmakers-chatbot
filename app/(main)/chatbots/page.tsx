"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaSearch } from "react-icons/fa";
import { AddNewChatbot } from "@/components/chatbots/add-new-chatbot";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase-client";
import Loading from "@/components/ui/loading";

interface Chatbot {
  chatbot_name: string;
  description: string;
  icon_path: string;
}

export default function Chatbots() {
  const [searchTerm, setSearchTerm] = useState("");
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchChatbots = async () => {
      const { data, error } = await supabase
        .from("chatbots")
        .select("chatbot_name, description, icon_path");

      if (error) {
        console.error("Error fetching chatbots: ", error);
      } else {
        setChatbots(data as Chatbot[]);
      }
      setLoading(false);
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

  const filteredChatbots = chatbots.filter(
    (bot) =>
      bot.chatbot_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <Loading loadingText="Loading chatbots"/>
  )

  return (
    <div className="w-full h-full p-1">
      <header className="flex items-center justify-between mt-2 mb-4 space-x-3">
        <div className="flex items-center border border-gray-300 rounded-lg p-2">
          <FaSearch className="mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search chatbots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none text-sm"
          />
        </div>
        <AddNewChatbot />
      </header>
      {filteredChatbots && filteredChatbots.length>0 ?
      <div className="flex flex-wrap gap-4 overflow-y-scroll scrollbar-hide h-[500px] mt-4">
        {filteredChatbots.map((bot, index) => (
          <a
            href={`/chatbots/${bot.chatbot_name}`}
            key={index}
            className="flex-grow min-w-[150px] max-w-[200px]"
          >
            <div className="flex-grow min-w-[150px] max-w-[200px]">
              <Card className="px-4 py-2 hover:shadow-md cursor-pointer">
                <CardHeader>
                  <div className="flex space-x-2">
                    <div>
                      <Avatar className="border">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/icons/${bot.icon_path}`}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {bot.chatbot_name}
                      </CardTitle>
                      <CardDescription>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {bot.description.substring(0, 12)}...
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-[200px] h-auto">
                                {bot.description}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </a>
        ))}
      </div>
      :
      <div className="w-full h-[400px] flex flex-col space-y-2 items-center justify-center">
        <h1 className="font-normal">No chatbot to show. Please create a new one</h1>
        <AddNewChatbot />
      </div>}
    </div>
  );
}
