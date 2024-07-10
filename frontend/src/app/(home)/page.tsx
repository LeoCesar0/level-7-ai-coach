import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { HomeArrow } from "./HomeArrow";
import { HomeDetails } from "./HomeDetails";

export default function Home() {
  return (
    <>
      <div className="p-[20px] flex-1 flex flex-col container justify-center">
        <div className="mb-16 relative ">
          <h1 className="animate-fade-up text-5xl mb-6">Welcome to</h1>
          <div className="animate-fade-up delay-75 flex items-center pl-6 gap-1">
            <Logo size={40} />
            <h1 className="text-5xl">Level 7 AI</h1>
          </div>
          <div className="absolute bottom-[calc(-100%-64px)]">
            <HomeArrow />
          </div>
        </div>
      </div>

      <HomeDetails />
    </>
  );
}
