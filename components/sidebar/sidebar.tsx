'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs-custom";
import {
  MdSpaceDashboard,
  MdOutlineLogout
} from "react-icons/md";
import { IoDocumentSharp, IoSettings} from "react-icons/io5";
import { SiChatbot } from "react-icons/si";
import { AiFillCode } from "react-icons/ai";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutForm from "../logoutForm";

export function Sidebar() {

 const pathName = usePathname();
  const tabItems = [
    { value: "dashboard", icon: MdSpaceDashboard, label: "Dashboard" },
    { value: "chatbots", icon: SiChatbot, label: "Chatbots" },
    { value: "documents", icon: IoDocumentSharp, label: "Documents" },
    { value: "settings", icon: IoSettings, label: "Settings" },
  ];
  return (
    <div className="h-full w-full p-2 flex flex-col">
      <h1 className="flex justify-center items-center font-semibold text-lg mb-5">
        Admin Panel
      </h1>
      <div className="flex-1">
        <Tabs
          className="w-full h-full flex flex-col items-center"
          defaultValue={`/${pathName}`}
        >
          <TabsList className="flex flex-col w-full space-y-2">
            {tabItems.map((tab) => (
            <Link href={`/main/${tab.value}`} className="w-full">
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={
                pathName.includes(`${tab.value}`) 
                  ? "w-full flex space-x-3 items-center shadow-md bg-background text-foreground" 
                  : "w-full flex space-x-3 items-center hover:text-foreground"
              }
            >
              <tab.icon size={15}/>
              <span>{tab.label}</span>
            </TabsTrigger>
          </Link>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="mt-auto border-t border-black dark:border-white pt-2">
        {/* <Button className="w-full border-none font-medium flex justify-between items-center rounded-md hover:bg-background" variant={"ghost"}>
            <span>Logout</span>
            <MdOutlineLogout className="h-5 w-5"/>
        </Button> */}
        <LogoutForm/>
      </div>
    </div>
  );
}
