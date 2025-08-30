import Board from "@/components/board";
import main from "@/lib/main.json";

export default async function MainBoard() {
  return (
    <main className="w-full p-8">
      <Board data={main} boardId="main" />
    </main>
  );
}
