import { useState } from "react";
import { SearchRow } from "./search-row";

export default function Results({ posts }: any) {
  return (
    <div>
      {posts.map((p: any) => {
        const color = p.id < 15 ? "yellow" : "";

        return (
          <SearchRow
            color={color}
            company={p.company_name}
            description={p.description}
            id={p.id}
            key={p.id}
            thumbnail={p.thumbnail}
            title={p.title}
          />
        );
      })}
    </div>
  );
}
