import Image from "next/image";

export default function Example() {
  const data = [{}, {}, {}, {}, {}, {}];

  return (
    <div>
      {data.map((d, idx) => (
        <div
          key={idx}
          className="p-6 my-4 bg-slate-400 flex space-x-4 rounded-xl shadow-lg"
        >
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          <p>Another Row</p>
        </div>
      ))}
    </div>
  );
}
