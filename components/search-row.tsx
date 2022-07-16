import cx from "classnames";
import initialism from "initialism";
import Image from "next/image";
import { MouseEvent, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";

import { getFriendlyDuration } from "../lib/date";

type SearchRowType = {
  extId: string | null | undefined;
  color: string;
  company: string;
  publishedAt: Date;
  description: string;
  thumbnail: string | null | undefined;
  title: string | null | undefined;
};

export function SearchRow({
  color,
  company,
  description,
  extId,
  publishedAt,
  thumbnail,
  title
}: SearchRowType) {
  const mainRowClassName = `main_search_row`;
  const containerClassName = `container_wrapper`;
  const detailsClassName = `details_wrapper`;

  const containerClasses = cx(
    `${containerClassName} p-4 my-4 bg-white flex items-center space-x-4 border rounded-xl h-24 hover:bg-gray-200 transition-all duration-200`,
    { "bg-yellow-200": color === "yellow" },
    { "hover:bg-yellow-300": color === "yellow" }
  );
  const buttonClasses = cx(
    "bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white inline-flex items-center justify-center border-transparent font-medium transition-all duration-300 hidden sm:flex font-bold",
    { "bg-yellow-600": color === "yellow" },
    { "hover:bg-yellow-700": color === "yellow" }
  );

  const anchorRef = useRef<HTMLAnchorElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const onRowSelect = useCallback(() => {
    const selectedRow = mainRef.current;
    const rowElems = document.getElementsByClassName(mainRowClassName);
    let runLast: undefined | (() => void) = undefined;
    for (let i = 0; i < rowElems.length; i += 1) {
      const rowDetailsElem =
        rowElems[i].getElementsByClassName(detailsClassName)[0];
      const rowContainerElem =
        rowElems[i].getElementsByClassName(containerClassName)[0];

      if (selectedRow === rowElems[i]) {
        runLast = () => {
          if (rowDetailsElem && rowDetailsElem.classList.contains("hidden")) {
            rowDetailsElem?.classList.remove("hidden");
            rowContainerElem?.classList.add("rounded-b-none");
            anchorRef.current?.scrollIntoView({
              behavior: "smooth"
            });
          } else {
            rowDetailsElem?.classList.add("hidden");
            rowContainerElem?.classList.remove("rounded-b-none");
          }
        };
      } else {
        rowDetailsElem?.classList.add("hidden");
        rowContainerElem?.classList.remove("rounded-b-none");
      }
    }
    runLast && runLast();
  }, []);

  const hideDetails = useCallback(() => {
    const detailElems = mainRef.current?.getElementsByClassName("details");
    if (detailElems) detailElems[0]?.classList.remove("show");
  }, []);

  const apply = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  const selectTagHandler = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  const companyWordCount = company.split(" ").length;
  const initialsLength = Math.min(companyWordCount, 3);

  return (
    <div
      className={`relative ${mainRowClassName}`}
      onBlurCapture={hideDetails}
      ref={mainRef}
    >
      <a
        className="absolute -top-4"
        href={`/#${extId && extId.slice(0, 36)}`}
        ref={anchorRef}
      />
      <div className={containerClasses} onClick={onRowSelect}>
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
        <div>{publishedAt ? getFriendlyDuration(publishedAt) : "n/a"}</div>
        <button onClick={selectTagHandler} className={buttonClasses}>
          <span className="px-8 py-2">Apply</span>
        </button>
      </div>
      <div
        className={`bg-white p-4 hidden ${detailsClassName} rounded-b -mt-4`}
      >
        <article className="prose-sm lg:prose-xl">
          <h2>{company} is hiring a</h2>
          <h3>{title}</h3>
          <ReactMarkdown>
            {description.replaceAll("•", "*").replaceAll("●", "*")}
          </ReactMarkdown>
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
