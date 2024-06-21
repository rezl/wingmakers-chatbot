import { ModeToggle } from "@/components/ui/toggle-mode";
import ChangePasswordForm from "@/components/update-password";
import { Separator } from "@/components/ui/separator"


export default function Settings() {
  return (
    <div className="flex flex-col items-start w-full h-full overflow-y-auto space-y-5 mt-2">
      <div className="flex flex-col items-start space-y-4 w-full">
      <h1 className="text-lg font-semibold">Choose theme</h1>
      <ModeToggle/>
      <Separator className="w-full"/>
      <h1 className="text-lg font-semibold">Change passowrd</h1>
     <ChangePasswordForm/>
      </div>
    </div>
  );
}