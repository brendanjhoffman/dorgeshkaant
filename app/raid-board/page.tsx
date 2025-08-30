"use client";
import dynamic from "next/dynamic";
import raid from "@/lib/raid.json";
const Board = dynamic(() => import("@/components/board"), { ssr: false });

export default function RaidBoard() {
  return (
    <main className="w-full p-8">
      {raid.map((raid, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">
            {raid.raid}
          </h2>
          <Board data={raid.tasks} boardId="raid" />
        </div>
      ))}
    </main>
  );
}
