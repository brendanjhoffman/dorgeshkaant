import Board from "@/components/board";
import weekly from "@/lib/weekly.json";

export default async function WeeklyBoard() {
  return (
    <main className="w-full p-8">
      {weekly.map((week, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">
            Week {index + 1}
          </h2>
          <Board data={week} boardId="weekly" />
        </div>
      ))}
    </main>
  );
}
