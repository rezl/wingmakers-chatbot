import { Tabs, TabsTrigger , TabsContent , TabsList } from "@/components/ui/tabs-custom"
import Model from "./model-settings"
import General from "./general-settings"

export function ChatbotSetings() {
  return (
      <main className="flex flex-col w-full p-2">
        <div className="">
        <h1 className="text-2xl font-semibold ml-2 pb-2">Settings</h1>
        <Tabs className="w-full h-full flex items-start space-x-10 mt-1" defaultValue="general">
            <TabsList className="flex flex-col w-auto items-start mt-0">
                <TabsTrigger value="general" className=" data-[state=active]:text-foreground font-semibold">General</TabsTrigger>
        <TabsTrigger value="model" className=" data-[state=active]:text-foreground font-semibold">Model</TabsTrigger>
        <TabsTrigger value="danger" className=" data-[state=active]:text-foreground font-semibold">Danager Zone</TabsTrigger>
                </TabsList>
            <TabsContent value="general" className="w-full h-full pt-0 mt-1">
                <General/>
            </TabsContent>
            <TabsContent value="model" className="w-full h-full pt-0 mt-1">
                <Model/>
            </TabsContent>
            <TabsContent value="danger" className="w-full h-full pt-0 mt-1">
                <h1 className="w-full border">Danger Settings goes here</h1>
            </TabsContent>
            </Tabs>
        </div>
      </main>
  )
}
