import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar className="bg-black border-yellow-300 border-r-4 text-center text-yellow-300">
      <SidebarHeader className="flex justify-center items-center bg-black">
        <Image
          src="/images/dyz.png"
          alt="Dorgeshkaant"
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold">Dorgeshkaant</h1>
      </SidebarHeader>
      <SidebarContent className="bg-black">
        <SidebarGroup className="bg-black">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/">Main Board</Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/hard-board">Hard Board</Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/raid-board">Raid Board</Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/weekly-board">Weekly Board</Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/teams">Teams</Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black">
        wom code: BIG HOT DORGINGO
      </SidebarFooter>
    </Sidebar>
  );
}
