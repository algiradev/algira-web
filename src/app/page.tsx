import RaffleRoom from "./raffle-room/page";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <RaffleRoom />
    </main>
  );
}
