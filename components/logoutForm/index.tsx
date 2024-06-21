import { logout } from "@/lib/actions"
import { Button } from "../ui/button"
import { MdOutlineLogout } from "react-icons/md"

const LogoutForm = () => {
  return (
    <form action={logout} className="w-full h-full">
      <Button className="w-full border-none font-medium flex justify-between items-center rounded-md hover:bg-background" variant={"ghost"}>
            <span>Logout</span>
            <MdOutlineLogout className="h-5 w-5"/>
        </Button>
    </form>
  )
}

export default LogoutForm