"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RxDragHandleDots1 } from "react-icons/rx";
import { ChatbotSetings } from "./settings";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Skeleton } from "../ui/skeleton";
import { Knowledgbase } from "./knowledgebase";
import Integrations from "./integrations";
import Loading from "../ui/loading";

export function Chatbots() {
  const [isLoading, setIsLoading] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Loading loadingText="Loading...please wait..."/>
    ); // Render the SkeletonDemo component while loading
  }

  const handleIconClick = () => {
    setShowChatbot(!showChatbot);
  };

  const newBaseUrl = window.location.origin + '/preview/';
  const pathSegments = window.location.pathname.split('/').slice(-1)[0];
  const chatbotUrl = `${newBaseUrl}${pathSegments}`;
  console.log(chatbotUrl);

  return (
    <div className="w-full h-full relative">
      <Tabs
        defaultValue="knowledgebase"
        className="w-full h-full flex flex-col items-start"
      >
              {/* <div className="flex items-center space-x-2 absolute top-0 right-0 p-2">
        <Label htmlFor="airplane-mode">Show preview</Label>
        <Switch id="airplane-mode" />
      </div> */}
        <TabsList className="grid max-w-lg grid-cols-2 mb-4">
          <TabsTrigger value="knowledgebase">Knowledgebase</TabsTrigger>
          <TabsTrigger value="inegration">Integrations</TabsTrigger>
          {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>
        <TabsContent value="knowledgebase" className="w-full">
          <Knowledgbase />
        </TabsContent>
        <TabsContent value="inegration" className="w-full h-full">
          <Integrations />
        </TabsContent>
        {/* <TabsContent value="settings" className="w-full">
            <ChatbotSetings/>
        </TabsContent> */}
      </Tabs>
      {/* <div className="absolute bottom-0 right-0 flex space-x-5">
                <div onClick={handleIconClick} style={{ cursor: 'pointer' }}>
                    Icon
                </div>
                <div style={{
                position: 'fixed',
                bottom: showChatbot ? '40px' : '-600px', // Adjust as needed
                right: '60px', // Adjust as needed
                width: '400px', // Adjust as needed
                height: '500px', // Adjust as needed
                border: '1px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'bottom 0.5s ease', // CSS transition
                color:"#000"
            }}>
                {showChatbot && (
                    <iframe 
                        src={chatbotUrl} 
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            border: 'none' 
                        }}
                    ></iframe>
                )}
            </div>
            </div> */}
    </div>
  );
}
