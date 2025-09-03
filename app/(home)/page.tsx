import TeamsComponent from "./components/teams";
import Header from "./components/header";
import Image from "next/image";
export default function TeamsPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-8">
      <Header />
      <Image src="/images/banner.png" alt="Banner" width={1000} height={100} />
      <h1 className="text-[50px] font-bold text-yellow-300">Goal</h1>
      <div className="text-white text-2xl text-center">
        Three teams. The goal is blackout bingo. The team that gets the furthest
        in their board by MONDAY, SEPTEMBER 22 (12:00 AM EST) wins.
      </div>
      <h1 className="text-[50px] font-bold text-yellow-300">Teams</h1>
      <TeamsComponent />
    </div>
  );
}
