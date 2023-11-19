"use client";

import Image from "next/image";
import { Bars3Icon, MoonIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex flex-row items-center place-content-between bg-primary p-4">
        <div className="flex flex-row items-center gap-2">
          <Image
            priority={true}
            width={32}
            height={32}
            src="/poketeams.png"
            alt="Temporary PokeTeams logo, by Sweet Farm."
            className="self-center"
          />
          <p className="font-bold">PokeTeams</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button>
            <MoonIcon height={24} width={24} />
          </button>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Bars3Icon height={28} width={28} />
          </button>
        </div>
      </nav>
    </>
  );
}
