import { SearchRow } from "../search-row";
import ResultsSkeleton from "./skeleton";

export default function Results({ posts }: any) {
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((p: any) => {
          const color = new Set([116, 117, 112]).has(p.id) ? "yellow" : "";

          return (
            <SearchRow
              color={color}
              company={p.company_name}
              createdAt={p.created_at}
              description={p.description}
              // id={p.id}
              key={p.id}
              thumbnail={p.thumbnail}
              title={p.title}
            />
          );
        })
      ) : (
        <>
          <ResultsSkeleton />
          <ResultsSkeleton />
          <ResultsSkeleton />
          <ResultsSkeleton />
          <ResultsSkeleton />
        </>
      )}
    </div>
  );
}
