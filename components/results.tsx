import { SearchRow } from "./SearchRow";

export default function Results({ posts }: any) {
  return (
    <div>
      {posts.map((p: any) => (
        <SearchRow
          key={p.id}
          company={p.company_name}
          thumbnail={p.thumbnail}
          title={p.title}
          color={p.id < 15 ? "yellow" : undefined}
        />
      ))}
    </div>
  );
}
