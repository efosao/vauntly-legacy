import cx from "classnames";
import Image from "next/image";

type SearchRowType = {
  color: string | null | undefined;
  company: string | null | undefined;
  title: string | null | undefined;
  thumbnail: string | null | undefined;
};

export function SearchRow({ color, company, thumbnail, title }: SearchRowType) {
  const containerClasses = cx(
    "p-4 my-4 bg-indigo-200 flex items-center space-x-4 rounded-xl shadow-lg h-24 hover:bg-indigo-300 transition-all duration-300",
    { "bg-yellow-200": color === "yellow" },
    { "hover:bg-yellow-300": color === "yellow" }
  );
  const buttonClasses = cx(
    "bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white inline-flex items-center justify-center border-transparent font-medium h-10 transition-all duration-300",
    { "bg-yellow-600": color === "yellow" },
    { "hover:bg-yellow-700": color === "yellow" }
  );

  return (
    <div className={containerClasses}>
      <span className="shrink-0 w-15 flex align-center">
        {thumbnail ? (
          <Image
            className="rounded-full"
            src={thumbnail}
            alt="Vercel Logo"
            width={45}
            height={45}
          />
        ) : null}
      </span>
      <div className="flex flex-col grow p-1 overflow-hidden">
        <p>{company}</p>
        <p className="font-medium truncate">{title}</p>
      </div>
      <div className="tag-container">
        <span className="row-tag">React</span>
        <span className="row-tag">JavaScript</span>
        <span className="row-tag">Python</span>
        <span className="row-tag">RUST</span>
      </div>
      <button className={buttonClasses}>
        <span className="px-8">Apply</span>
      </button>
    </div>
  );
}

SearchRow.defaultProps = {
  color: null,
};
