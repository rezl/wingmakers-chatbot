"use client"

import { useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import CodeBlock from "./codeblock";
import Loading from "../ui/loading";

export default function Integrations() {
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  const newBaseUrl = window.location.origin + "/preview/";
  const pathSegments = window.location.pathname.split("/").slice(-1)[0];
  const chatbotUrl = `${newBaseUrl}${pathSegments}`;
  console.log(chatbotUrl);

  return (
    <div className="w-full min-h-full flex items-start justify-between space-x-4">
      <CodeBlock />
      <div className="w-[350px] h-[500px]">
        {isLoading && (
          <div className="w-full h-full rounded-md border flex flex-col items-center justify-center bg-background">
            <Loading loadingText="Loading preview"/>
          </div>
        )}
        <iframe
          src={chatbotUrl}
          className={isLoading? "hidden" :"w-auto h-full rounded-md border"}
          onLoad={() => setIsLoading(false)} // Update state when iframe loads
        ></iframe>
      </div>
    </div>
  );
}
