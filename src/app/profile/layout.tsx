'use client';

import { PageHeader } from "@/components/general/page-header";
import { ProfileSidebar } from "@/components/specific/profile/profileSidebar";
import { useEffect } from "react";

export default function ProfileLayout({children} : {children: React.ReactNode}) {
    //Habilitar o scrool: smooth
    useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');

    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute("href") || "");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    };

    anchors.forEach(anchor => anchor.addEventListener("click", handleClick));

    // cleanup
    return () => {
      anchors.forEach(anchor => anchor.removeEventListener("click", handleClick));
    };
  }, []);

    return(
        <div className="px-24">
            <PageHeader 
                imageUrl="/"
                title="Lorem ipsum dolor sit"
                subtitle="Lorem ipsum dolor sit"
                className="mb-12"
                showBgImage={false}
                showBackButton={false}
                headerClassname="bg-transparent"
            />
            <div className="flex items-start px-16 gap-5">
                <ProfileSidebar />
                
                {children}
            </div>
        </div>

    )
}