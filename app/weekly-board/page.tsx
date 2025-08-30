import Board from "@/components/board";
import weekly from "@/lib/weekly.json";
export default async function WeeklyBoard() {
  return (
    <main className="w-full p-8">
      <Board data={weekly} />
    </main>
  );
}
