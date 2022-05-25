import cx from "classnames";
import initialism from "initialism";
import Image from "next/image";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistance } from "date-fns";

type SearchRowType = {
  id: number;
  color: string;
  company: string;
  createdAt: string;
  description: string;
  thumbnail: string | null | undefined;
  title: string | null | undefined;
};

export function SearchRow({
  id,
  color,
  company,
  createdAt,
  description,
  thumbnail,
  title
}: SearchRowType) {
  const containerClasses = cx(
    "p-4 my-4 bg-indigo-200 flex items-center space-x-4 rounded-xl shadow-lg h-24 hover:bg-indigo-300 transition-all duration-200",
    { "bg-yellow-200": color === "yellow" },
    { "hover:bg-yellow-300": color === "yellow" }
  );
  const buttonClasses = cx(
    "bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white inline-flex items-center justify-center border-transparent font-medium transition-all duration-300 hidden sm:flex font-bold",
    { "bg-yellow-600": color === "yellow" },
    { "hover:bg-yellow-700": color === "yellow" }
  );

  const anchorRef = useRef<any>();
  const detailsRef = useRef<any>();
  const containerRef = useRef<any>();

  function onRowSelect() {
    const elem = detailsRef.current;
    const elems = document.getElementsByClassName("details");
    let runLast = () => {};
    for (let i = 0; i < elems.length; i += 1) {
      if (elem === elems[i]) {
        runLast = () => {
          elems[i].classList.toggle("hidden");
          containerRef.current.classList.toggle("rounded-b-none");
          anchorRef.current.scrollIntoView({
            behavior: "smooth"
          });
        };
      } else {
        elems[i].classList.add("hidden");
      }
    }
    runLast();
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

  const companyWordCount = company.split(" ").length;
  const initialsLength = Math.min(companyWordCount, 3);

  return (
    <div className="relative" onBlurCapture={hideDetails}>
      <a ref={anchorRef} className="absolute -top-4" />
      <div
        ref={containerRef}
        className={containerClasses}
        onClick={onRowSelect}
      >
        <span className="shrink-0 w-15 flex align-center">
          {thumbnail ? (
            <Image
              alt="Vercel Logo"
              className="rounded-full"
              height={45}
              src={thumbnail}
              width={45}
            />
          ) : (
            <span className="flex font-extrabold text-slate-400 border-slate-400 border-2 justify-center items-center rounded-full bg-white w-[45px] h-[45px]">
              {initialism(
                company.replaceAll("&", "").replaceAll("/", ""),
                initialsLength
              )}
            </span>
          )}
        </span>
        <div className="flex flex-col grow p-1 overflow-hidden">
          <p>{company}</p>
          <p className="font-extrabold w-full md:w-72 lg:w-96">{title}</p>
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
        <div>
          {formatDistance(new Date(createdAt), new Date(), {
            addSuffix: true
          })}
        </div>
        <button onClick={selectTagHandler} className={buttonClasses}>
          <span className="px-8 py-2">Apply</span>
        </button>
      </div>
      <div
        ref={detailsRef}
        className="bg-white p-4 hidden details rounded-b -mt-4"
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
  showDetail: false
};
