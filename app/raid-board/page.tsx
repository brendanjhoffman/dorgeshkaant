import Board from "@/components/board";
import raid from "@/lib/raid.json";

export default async function RaidBoard() {
  return (
    <main className="w-full p-8">
      <Board data={raid} />
    </main>
  );
}
