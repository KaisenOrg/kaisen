import "@nfid/identitykit/react/styles.css";

import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function ProfileLayout({ showSideBar = true }: { showSideBar?: boolean }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {showSideBar && <Sidebar />}
       <div className="relative flex-1">
          <div className="absolute inset-0 overflow-y-auto">
            <Outlet />
          </div>
          <Toaster className="!absolute" position="top-right" />
        </div>
      </div>
    </div>
  );
}
