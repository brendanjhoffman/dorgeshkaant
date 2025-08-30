"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

export function AppSidebar() {
  const exportBoardState = useCallback(() => {
    try {
      // Get all board states from localStorage
      const boardStates: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("board_") && key.endsWith("_state")) {
          const value = localStorage.getItem(key);
          if (value) {
            boardStates[key] = JSON.parse(value);
          }
        }
      }

      // Create export data with timestamp
      const exportData = {
        timestamp: new Date().toISOString(),
        boardStates,
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dorgeshkaant-board-state-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting board state:", error);
      alert("Failed to export board state");
    }
  }, []);

  const importBoardState = useCallback(() => {
    try {
      // Create file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const importData = JSON.parse(content);

            if (
              !importData.boardStates ||
              typeof importData.boardStates !== "object"
            ) {
              alert("Invalid file format");
              return;
            }

            // Confirm import
            if (
              !confirm(
                "This will overwrite your current board states. Continue?"
              )
            ) {
              return;
            }

            // Import board states
            Object.entries(importData.boardStates).forEach(([key, value]) => {
              localStorage.setItem(key, JSON.stringify(value));
            });

            // Reload the page to reflect changes
            window.location.reload();
          } catch (error) {
            console.error("Error parsing import file:", error);
            alert("Failed to parse import file");
          }
        };
        reader.readAsText(file);
      };
      input.click();
    } catch (error) {
      console.error("Error importing board state:", error);
      alert("Failed to import board state");
    }
  }, []);

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
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="bg-black">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/teams">Teams</Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black p-4 space-y-3">
        <div className="text-sm text-yellow-300 mb-3">
          wom code: BIG HOT DORGINGO
        </div>
        <div className="space-y-2">
          <Button
            onClick={exportBoardState}
            variant="outline"
            size="sm"
            className="w-full bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black"
          >
            Export Board State
          </Button>
          <Button
            onClick={importBoardState}
            variant="outline"
            size="sm"
            className="w-full bg-black border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-black"
          >
            Import Board State
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
