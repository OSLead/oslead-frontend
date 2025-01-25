import { AppSidebar } from "@/components/AdminComponents/ADSideBar"
import { DataTableCAdmin } from "@/components/AdminComponents/ADCTable"
import { Separator } from "@/components/ui/separator"
import "..//..//.//..//..//..//styles/adminDashboard.css"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function viewContributors() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 HeaderStyle">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="mtitleContainer">
            <p>SWOC Leaderboard Admin Dashboard</p>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="containerViewProjectAdmins">
            <h1 style={{fontSize:"28px",fontWeight:"700",padding:"10px"}}>View Contributors</h1>
            <DataTableCAdmin />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}