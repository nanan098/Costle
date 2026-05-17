import { Info, DollarSign } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="bg-tlo border-b border-akcent py-4 px-6 grid grid-cols-3 items-center sticky top-0 z-10 rounded-2xl">
      <div />
      <div className="flex justify-center">
        <DollarSign className="inline-block size-12 text-glowny" />
        <h1 className="text-5xl font-bold tracking-tight text-glowny text-center whitespace-nowrap">
          Costle<span className="text-glowny">.pl</span>
        </h1>
      </div>
      <div className="flex justify-end text-glowny">
        <Info className="cursor-pointer hover:opacity-80 transition-opacity" />
      </div>
    </header>
  );
};
