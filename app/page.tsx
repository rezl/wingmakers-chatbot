import { changePremium, changeUsername, getSession } from "@/lib/actions";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/login")
  }

  redirect("/main/dashboard")
 
};

export default ProfilePage;