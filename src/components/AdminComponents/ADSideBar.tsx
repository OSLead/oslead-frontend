"use client";
import * as React from "react";

import { SearchForm } from "@/components/AdminComponents/ADSearchForm";
import Link from "next/link";
import { setCookie,getCookie } from "cookies-next";
import { useRouter } from "next/navigation"; 

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title:"menus",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
        },
        {
          title: "View Project Admins",
          url: "/admin/dashboard/view/pa",
        },
        {
          title: "View Contributors",
          url: "/admin/dashboard/view/contributors",
        },
        {
          title: "Add Project",
          url: "/admin/dashboard/add/projects",
        },
        {
          title: "Logout",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const handleLogout = () => {
    setCookie("user-data", "", { maxAge: -1 });
    router.push("/admin");
  };
  return (
    <Sidebar {...props} style={{backgroundColor:"white"}}>
      <SidebarHeader>
        {/* <div className="logo" style={{display:"flex;",justifyContent:"center;"}}>
          <img src="/socialwinterofcode_logo.png" style={{width:"200px"}} alt="" />
        </div> */}
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      onClick={
                        item.title === "Logout" ? handleLogout : undefined
                      }
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
