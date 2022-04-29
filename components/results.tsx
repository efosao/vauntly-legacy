import Image from "next/image";

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
      <div className="p-4 my-4 bg-yellow-200 flex items-center space-x-4 rounded-xl shadow-lg h-24 hover:bg-yellow-300 transition-all duration-300">
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
          <span className="row-tag">JavaScript</span>
          <span className="row-tag">React</span>
        </div>
        <button className="bg-indigo-600 hover:bg-sky-700 rounded-md text-white inline-flex items-center justify-center border-transparent font-medium h-12">
          <span className="px-6">Apply</span>
        </button>
      </div>
      {data.map((d, idx) => (
        <div
          key={idx}
          className="p-4 my-4 bg-indigo-200 flex items-center space-x-4 rounded-xl shadow-lg h-24 hover:bg-indigo-300 transition-all duration-300"
        >
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
          <button className="bg-indigo-600 hover:bg-sky-700 rounded-md text-white inline-flex items-center justify-center border-transparent font-medium h-12">
            <span className="px-6">Apply</span>
          </button>
        </div>
      ))}
    </div>
  );
}
