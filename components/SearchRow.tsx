import cx from "classnames";
import Image from "next/image";

type SearchRowType = {
  color: string | null | undefined;
};

export function SearchRow({ color }: SearchRowType) {
  const classes = cx(
    "p-4 my-4 bg-indigo-200 flex items-center space-x-4 rounded-xl shadow-lg h-24 hover:bg-indigo-300 transition-all duration-300",
    { "bg-yellow-300": color === "yellow" }
  );

  return (
    <div className={classes}>
      <span className="shrink-0 w-15 flex align-center">
        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
      </span>
      <div className="flex flex-col grow p-1 overflow-hidden">
        <p>SAP Labs</p>
        <p className="font-medium truncate">
          Sr. Software Engineer (React/Node/PostgreSQL)
        </p>
      </div>
      <div className="tag-container">
        <span className="row-tag">React</span>
        <span className="row-tag">JavaScript</span>
        <span className="row-tag">Python</span>
        <span className="row-tag">RUST</span>
      </div>
      <button className="bg-indigo-600 hover:bg-sky-700 rounded-xl text-white inline-flex items-center justify-center border-transparent font-medium h-10">
        <span className="px-8">Apply</span>
      </button>
    </div>
  );
}

SearchRow.defaultProps = {
  color: null,
};
