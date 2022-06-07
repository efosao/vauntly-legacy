import { Post } from "../../types/posts.type";
import { SearchRow } from "../search-row";
import ResultsSkeleton from "./skeleton";

export default function Results({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.length > 0 ? (
        posts.map((p) => {
          const color = new Set([116, 117, 112]).has(p.id || 0) ? "yellow" : "";

          return (
            <SearchRow
              color={color}
              company={p.company_name}
              publishedAt={p.published_at || p.created_at}
              description={p.description}
              extId={p.external_id}
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
