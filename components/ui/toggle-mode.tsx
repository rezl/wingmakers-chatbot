"use client"

import * as React from "react"
import { FaCircleCheck } from "react-icons/fa6";
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline" size="icon">
    //       <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    //       <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    //       <span className="sr-only">Toggle theme</span>
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    //     <DropdownMenuItem onClick={() => setTheme("light")}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("dark")}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme("system")}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <div className="w-full h-full flex flex-col space-y-2">
        <div className="flex items-center space-x-8">
          <div className="relative p-2 rounded-lg border cursor-pointer dark:shadow-md" onClick={() => setTheme("dark")}>
            <h1 className="dark:font-medium mb-1">Dark</h1>
            <img src="/theme-dark.png" className="w-auto h-32 rounded-md border dark:opacity-55"/>
            <div className="absolute dark:flex hidden top-2 right-2"><FaCircleCheck/></div>
          </div>
          <div className="relative p-2 rounded-lg border cursor-pointer shadow-md dark:shadow-none" onClick={() => setTheme("light")}>
            <h1 className="dark:font-normal font-medium mb-1">Light</h1>
            <img src="/theme-light.png" className="w-auto h-32 rounded-md border dark:opacity-100 opacity-55"/>
            <div className="absolute dark:hidden flex top-2 right-2"><FaCircleCheck/></div>
          </div>
        </div>
    </div>
  )
}
