import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/sidebar/sidebar";
import BreadCrumb from "@/components/breadcrumb";
import { Flip, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import "../globals.css";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin panel",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getSession();

  if(!session.isLoggedIn){
    redirect("/login")
  }

  return (
    <html lang="en">
      <body>
      <main className="w-screen h-screen overflow-hidden rounded-lg">
      <div className="w-full h-full  flex items-start justify-normal p-4 space-x-5">
          <div className="flex flex-col items-center h-full  w-[20%] rounded-lg shadow-md border bg-muted">
            <Sidebar/>
          </div>
          <div className="flex flex-col items-center h-full bg-background rounded-lg w-full p-2">
            <BreadCrumb/>
            {children}
            <ToastContainer transition={Flip} position="bottom-right"/>
          </div>
      </div>
    </main>
      </body>
    </html>
  );
}
