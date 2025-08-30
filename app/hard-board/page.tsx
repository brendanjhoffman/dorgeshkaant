import Board from "@/components/board";
import hard from "@/lib/hard.json";

export default async function HardBoard() {
  return (
    <main className="w-full p-8">
      <Board data={hard} boardId="hard" />
    </main>
  );
}
