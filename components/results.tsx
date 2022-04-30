import { SearchRow } from "./SearchRow";

export default function Example() {
  const data = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
  ];

  return (
    <div>
      <SearchRow color="yellow"></SearchRow>
      {data.map((d, idx) => (
        <SearchRow key={idx}></SearchRow>
      ))}
    </div>
  );
}
