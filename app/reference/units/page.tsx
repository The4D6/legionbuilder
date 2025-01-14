import React from "react";
import Link from "next/link";
import { unitData } from "../../data/unit_data";
import { factionTypeArray } from "../../types";

const page = () => {
  return (
    <main className="flex flex-wrap gap-12 p-4 max-w-screen-xl">
      {factionTypeArray.map((faction) => {
        return (
          <div key={faction} className="flex flex-col">
            <h3 className="font-subrayada text-2xl text-center">{faction}</h3>
            {unitData
              .filter((unitFaction) => unitFaction.faction === faction)
              .map((unit) => (
                <Link
                  key={unit.name}
                  href={`/reference/units/${unit.name.replaceAll(" ", "_")} `}
                  className="text-lg hover:text-cyan-700 active:text-cyan-600"
                >
                  {unit.name}
                </Link>
              ))}
          </div>
        );
      })}
    </main>
  );
};

export default page;
