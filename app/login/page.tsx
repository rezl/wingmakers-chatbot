import { getSession } from "@/lib/actions"
import LoginForm from "@/components/loginForm"
import { redirect } from "next/navigation"

const LoginPage = async () => {  
  const session = await getSession()

  if(session.isLoggedIn){
    redirect("/main/dashboard")
  }
  return (
    <div className="w-screen-sm h-screen overflow-hidden scrollbar-hide">
      <LoginForm/>
    </div>
  )
}

export default LoginPage