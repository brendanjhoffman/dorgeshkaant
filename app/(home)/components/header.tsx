import Image from "next/image";

export default async function Header() {
  return (
    <div className="flex flex-row items-center justify-center">
      <Image src="/images/dyz.png" alt="Dyz" width={100} height={100} />
      <h1 className="lg:text-[80px] text-2xl font-bold text-yellow-300 uppercase">
        Dorgeshkaant Bingo
      </h1>
    </div>
  );
}
