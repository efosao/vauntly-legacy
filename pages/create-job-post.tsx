import { SimpleLayout } from "../components/layouts";

export default function Page() {
  return (
    <div className="m-6">
      <form>
        <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
          <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
            Let&apos;s Begin
          </span>
          <div className="flex flex-col p-4">
            <label className="font-semibold uppercase">Company Name*</label>

            <input
              type="text"
              className="rounded-md border-gray-300 shadow-md my-2"
              placeholder="Company name"
            />

            <label className="font-semibold uppercase">Position*</label>

            <input
              type="text"
              className="rounded-md border-gray-300 shadow-md my-2"
              placeholder="Position"
            />

            <select className="rounded-md border-gray-300 shadow-md my-4">
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contractor">Contractor</option>
              <option value="temporary">Temporary</option>
              <option value="intern">Internship</option>
              <option value="intern">Per diem</option>
              <option value="volunteer">Volunteer</option>
            </select>

            <label className="font-semibold uppercase">Primary Tag</label>

            <select className="rounded-md border-gray-300 shadow-md my-2">
              <option value="">Select a primary tag</option>
              <option value="dev">Software Development</option>
              <option value="customer support">Customer Support</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="design">Design</option>
              <option value="front end">Front End</option>
              <option value="backend">Back End</option>
              <option value="legal">Legal</option>
              <option value="testing">Testing</option>
              <option value="quality assurance">Quality Assurance</option>
              <option value="non tech">Non-Tech</option>
              <option value="other">Other</option>
            </select>

            <label className="font-semibold uppercase">Extra Tags</label>

            <input
              type="text"
              className="rounded-md border-gray-300 shadow-md my-2"
              placeholder="Tags separated by comma"
            />
          </div>
        </section>

        <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
          <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
            Details
          </span>
          <div className="flex flex-col p-4">
            <label className="font-semibold uppercase">Description*</label>
            <textarea className="rounded-md border-gray-300 shadow-md my-2"></textarea>
          </div>
        </section>

        <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
          <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
            Preview
          </span>
          {/* <div className="flex flex-col p-4">
          <label className="font-semibold uppercase">Description*</label>
          <textarea className="rounded-md border-gray-300 shadow-md my-2"></textarea>
        </div> */}
        </section>

        <section className="bg-white fixed bottom-0 w-full p-4 -mx-6 border-t border-gray-200">
          <button className="bg-red-500 p-6 text-white font-extrabold text-2xl rounded-md w-full border-2 border-red-500 hover:bg-white hover:text-red-500 hover:border-red-500 transition-all duration-300">
            Post Job
          </button>
        </section>
      </form>
    </div>
  );
}

// Page.layout = SimpleLayout;
Page.title = "Create a Job Post";
