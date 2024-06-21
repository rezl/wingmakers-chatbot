import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsClipboard2Fill, BsClipboard2CheckFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase-client";

export default function CodeBlock() {
  const [copied, setCopied] = useState(false);
  const [icon, setIcon] = useState<string | null>(null);

  const newBaseUrl = window.location.origin + "/preview/";
  const pathSegments = window.location.pathname.split("/").slice(-1)[0];
  const chatbotUrl = `${newBaseUrl}${pathSegments}`;
  console.log(chatbotUrl);

  useEffect(() => {
    const fetchIcon = async () => {
      const { data, error } = await supabase
        .from("chatbots")
        .select("icon_path")
        .eq("chatbot_name", pathSegments)
        .single();

      if (error) {
        console.error("Error fetching icon:", error);
        return;
      }

      if (data) {
        setIcon(data.icon_path);
      }
    };

    fetchIcon();
  }, [pathSegments]);

  const code = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Popup Chat Button</title>
    <style>
        .chat-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
      }
      
      .chat-popup {
        display: none;
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 350px;
        height: 500px;
        border: 1px solid #000000;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        background-color: white;
      }
      
      .chat-popup iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 10px;
      }
    
      .chat-popup .close-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #000000;
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      .chatbot-icon {
        width: 50px;
        height: 50px;
      }
    </style>
    </head>
    <body>
    
    ${
      icon
        ? `<button class="chat-button" onclick="toggleChatPopup()">
        <img src=${`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/icons/${icon}`} class="chatbot-icon" />
      </button>`
        : `<button class="chat-button" onclick="toggleChatPopup()">💬</button>`
    }
    
    <div class="chat-popup" id="chatPopup">
      <button class="close-btn" onclick="toggleChatPopup()">×</button>
      <iframe src=${chatbotUrl} id="chatFrame"></iframe>
    </div>
    
    <script>
      function toggleChatPopup() {
        var popup = document.getElementById('chatPopup');
        if (popup.style.display === 'none' || popup.style.display === '') {
          popup.style.display = 'block';
        } else {
          popup.style.display = 'none';
        }
      }
    </script>
    
    </body>
    </html>
    `;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  return (
    <div className="relative p-4 border rounded bg-muted max-h-[500px] overflow-y-auto w-full">
      <CopyToClipboard text={code} onCopy={handleCopy}>
        <Button size={"sm"} className="absolute top-2 right-2">
          {copied ? (
            <>
              Copied
              <BsClipboard2CheckFill className="ml-2" />
            </>
          ) : (
            <>
              Copy
              <BsClipboard2Fill className="ml-2" />
            </>
          )}
        </Button>
      </CopyToClipboard>
      <pre className="whitespace-pre-wrap">
        <code className="text-muted-foregound">{code}</code>
      </pre>
    </div>
  );
}
