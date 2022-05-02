import cx from "classnames";
import initialism from "initialism";
import Image from "next/image";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";

type SearchRowType = {
  id: number;
  color: string;
  company: string;
  description: string;
  thumbnail: string | null | undefined;
  title: string | null | undefined;
};

export function SearchRow({
  color,
  company,
  description,
  thumbnail,
  title,
}: SearchRowType) {
  const containerClasses = cx(
    "group p-4 my-4 bg-indigo-200 flex items-center space-x-4 rounded-xl shadow-lg h-24 hover:bg-indigo-300 transition-all duration-300",
    { "bg-yellow-200": color === "yellow" },
    { "hover:bg-yellow-300": color === "yellow" }
  );
  const buttonClasses = cx(
    "opacity-0 group-hover:opacity-100 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white inline-flex items-center justify-center border-transparent font-medium transition-all duration-300",
    { "bg-yellow-600": color === "yellow" },
    { "hover:bg-yellow-700": color === "yellow" }
  );

  const anchorRef = useRef<any>();
  const detailsRef = useRef<any>();

  function onRowSelect() {
    const elem = detailsRef.current;
    const elems = document.getElementsByClassName("details");
    for (let i = 0; i < elems.length; i += 1) {
      if (elem === elems[i]) {
        elems[i].classList.toggle("hidden");
        anchorRef.current.scrollIntoView({
          behavior: "smooth",
        });
      } else {
        elems[i].classList.add("hidden");
      }
    }
  }

  function hideDetails() {
    console.log(detailsRef.current);
    const elem = detailsRef.current;
    elem.classList.remove("show");
  }

  function apply(e: any) {
    e.stopPropagation();
  }

  function selectTagHandler(e: any) {
    e.stopPropagation();
  }

  return (
    <div className="relative" onBlurCapture={hideDetails}>
      <a ref={anchorRef} className="absolute -top-4" />
      <div className={containerClasses} onClick={onRowSelect}>
        <span className="shrink-0 w-15 flex align-center">
          {thumbnail ? (
            <Image
              className="rounded-full"
              src={thumbnail}
              alt="Vercel Logo"
              width={45}
              height={45}
            />
          ) : (
            <span className="flex justify-center items-center rounded-full bg-white w-[45px] h-[45px]">
              {initialism(company.replaceAll("&", "").replaceAll("/", ""), 4)}
            </span>
          )}
        </span>
        <div className="flex flex-col grow p-1 overflow-hidden">
          <p>{company}</p>
          <p className="font-medium truncate">{title}</p>
        </div>
        <div className="tag-container">
          <button type="button" onClick={apply} className="row-tag">
            React
          </button>
          <button type="button" onClick={apply} className="row-tag">
            JavaScript
          </button>
          <button type="button" onClick={apply} className="row-tag">
            RUST
          </button>
        </div>
        <button onClick={selectTagHandler} className={buttonClasses}>
          <span className="px-8 py-2">Apply</span>
        </button>
      </div>
      <div
        ref={detailsRef}
        className="bg-indigo-100 p-4 hidden details rounded -mt-6"
      >
        <article className="prose-sm lg:prose-xl">
          <h2>{company} is hiring a</h2>
          <h3>{title}</h3>
          <ReactMarkdown>{description.replaceAll("•", "*")}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

SearchRow.defaultProps = {
  color: "",
  company: "",
  description: "",
  showDetail: false,
};
