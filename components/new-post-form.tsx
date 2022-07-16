import dynamic from "next/dynamic";
import router from "next/router";
// import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import store from "store2";
import { v4 as uuidv4 } from "uuid";

import requestClient from "../lib/request-client";
import { SearchRow } from "./search-row";

const DynamicEditor = dynamic(() => import("./editor"), { ssr: false });

const DRAFT_POST_CACHE_KEY = "draft_post";

type PostType = {
  company_name: string;
  description: string | undefined;
  id: string | undefined;
  position: string | undefined;
};

export default function NewPostForm() {
  const [formState, setFormState] = useState<PostType>();
  // const { data: session } = useSession();
  const session = null;

  const DynamicEditorAdapter = ({ input }) => {
    return (
      <DynamicEditor initialValue={input.value} onChange={input.onChange} />
    );
  };

  function updateFormState(data: PostType) {
    if (!data.id) {
      data.id = uuidv4();
    }
    setFormState(data);
  }

  async function commit(data: PostType) {
    // if (!session) return signIn();

    if (!isPostValid(data))
      throw new Error("Post cannot be saved because it is invalid");

    const cacheDraftPost = store(DRAFT_POST_CACHE_KEY);
    store.remove(DRAFT_POST_CACHE_KEY);

    try {
      const results = await requestClient(
        `mutation InsertPost($company_name: String, $description: String, $location: String, $title: String) {
          insert_posts_one(object: {company_name: $company_name, description: $description, location: $location, thumbnail: "", title: $title}) {
            external_id
            created_by_user_id
          }
        }`,
        {
          company_name: data.company_name,
          description: data.description,
          location: "Philadelphia, PA",
          title: data.position
        }
      );
      console.log({ results });
    } catch (error) {
      // restore cached draft post
      store(DRAFT_POST_CACHE_KEY, cacheDraftPost);
      console.error("ERROR_SAVING_POST");
      console.error(error);
    }

    // redirect to pending page
    router.push("/pending-posts");
  }

  function isPostValid(post: PostType): boolean {
    return (
      !!post.position &&
      post.position.length > 0 &&
      !!post.description &&
      post.description.length > 0 &&
      !!post.company_name &&
      post.company_name.length > 0
    );
  }

  async function onSubmit(data: PostType) {
    const modifiedData = {
      ...data,
      saving: !!data.position && !!data.description
    };
    updateFormState(modifiedData);
    store(DRAFT_POST_CACHE_KEY, modifiedData);

    if (!session) {
      // signIn();
      console.error("signin not yet implemented");
      return;
    }
    commit(modifiedData);
  }

  useEffect(() => {
    const draftPostData = store(DRAFT_POST_CACHE_KEY) || {};
    updateFormState(draftPostData);
  }, []);

  useEffect(() => {
    const draftPostData = store(DRAFT_POST_CACHE_KEY) || {};
    // TODO: validate session and data before proceeeding
    const shouldSave: boolean =
      !session || !draftPostData.saving || !isPostValid(draftPostData);
    if (shouldSave) return;
    commit(draftPostData);
  }, [session]);
  return (
    <Form initialValues={formState} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div className="max-w-6xl mx-auto">
            <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
              <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
                Let&apos;s Begin
              </span>
              <div className="flex flex-col p-4">
                <label className="font-semibold uppercase">Company Name*</label>
                <Field name="company_name" component="input">
                  {(props) => (
                    <input
                      className="rounded-md border-gray-300 shadow-md my-2"
                      placeholder="Company name"
                      type="text"
                      {...props.input}
                    />
                  )}
                </Field>

                <label className="font-semibold uppercase">Position*</label>
                <Field name="position" component="input">
                  {(props) => (
                    <input
                      className="rounded-md border-gray-300 shadow-md my-2"
                      placeholder="Position"
                      type="text"
                      {...props.input}
                    />
                  )}
                </Field>

                <Field name="employment_type" component="select">
                  {(props) => (
                    <select
                      className="rounded-md border-gray-300 shadow-md my-4"
                      {...props.input}
                    >
                      <option value="full_time">Full-time</option>
                      <option value="part_time">Part-time</option>
                      <option value="contractor">Contractor</option>
                      <option value="temporary">Temporary</option>
                      <option value="intern">Internship</option>
                      <option value="intern">Per diem</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                  )}
                </Field>

                <label className="font-semibold uppercase">Primary Tag</label>
                <Field name="tag_primary" component="select">
                  {(props) => (
                    <select
                      className="rounded-md border-gray-300 shadow-md my-2"
                      {...props.input}
                    >
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
                      <option value="quality assurance">
                        Quality Assurance
                      </option>
                      <option value="non tech">Non-Tech</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                </Field>

                <label className="font-semibold uppercase">
                  Additional Tags
                </label>

                <Field name="tags_additional" component="input">
                  {(props) => (
                    <input
                      className="rounded-md border-gray-300 shadow-md my-2"
                      placeholder="Tags separated by comma"
                      type="text"
                      {...props.input}
                    />
                  )}
                </Field>
              </div>
            </section>

            <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
              <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
                Design your Job Post
              </span>
              <div className="flex flex-col items-start">
                <label className="label">
                  <Field name="show_logo" type="checkbox" component="input">
                    {(props) => (
                      <input className="p-4 mr-4 rounded-md" {...props.input} />
                    )}
                  </Field>
                  Show company logo besides post{" "}
                  <span className="text-gray-400 ml-2">(+$25)</span>
                </label>
                <label className="label">
                  <Field name="pin_duration_in_days" type="radio" value="1">
                    {(props) => (
                      <input
                        className="form-checkbox p-4 mr-4 rounded-md"
                        {...props.input}
                      />
                    )}
                  </Field>
                  Stick post to top of the frontpage for 24 hours{" "}
                  <span className="text-gray-400 ml-2">(+$100)</span>
                </label>
                <label className="label">
                  <Field name="pin_duration_in_days" type="radio" value="7">
                    {(props) => (
                      <input
                        className="form-checkbox p-4 mr-4 rounded-md"
                        {...props.input}
                      />
                    )}
                  </Field>
                  Stick post to top of the frontpage for 1 week{" "}
                  <span className="text-gray-400 ml-2">(+$200)</span>
                </label>
                <label className="label">
                  <Field name="pin_duration_in_days" type="radio" value="31">
                    {(props) => (
                      <input
                        className="form-checkbox p-4 mr-4 rounded-md"
                        {...props.input}
                      />
                    )}
                  </Field>
                  Stick post to top of the frontpage for 1 month{" "}
                  <span className="text-gray-400 ml-2">(+$450)</span>
                </label>
                <label className="label">
                  <Field name="pin_duration_in_days" type="radio" value="0">
                    {(props) => (
                      <input
                        className="form-checkbox p-4 mr-4 rounded-md"
                        {...props.input}
                      />
                    )}
                  </Field>
                  Do not pin post
                </label>
              </div>
            </section>

            <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
              <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
                Description
              </span>
              <div className="flex flex-col p-2">
                <Field name="description" component={DynamicEditorAdapter} />

                {/* <DynamicEditor initialValue={formState?.description} /> */}
              </div>
            </section>

            {/* <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
              <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
                Company
              </span>
            </section> */}

            {/* <section className="relative bg-white border-gray-300 border p-4 rounded-md my-10 shadow">
              <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
                Feedback
              </span>
            </section> */}

            <section className="relative bg-yellow-100 border-gray-300 border p-4 rounded-md my-10 shadow">
              <span className="relative -top-8 bg-white border-gray-300 border rounded px-2 py-1 mx-auto uppercase font-bold border-b-0">
                Preview Post
              </span>
              <div>
                <SearchRow
                  company={formState?.company_name}
                  description={formState?.description}
                  extId="temp"
                  publishedAt={new Date()}
                  thumbnail={null}
                  title={formState?.position}
                />
              </div>
            </section>

            {/* <div className="bg-blue-100 p-4 border rounded-md mb-10">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(formState, null, 2)}
              </pre>
            </div> */}
          </div>

          <section className="bg-white fixed bottom-0 w-full p-4 -mx-6 border-t border-gray-200 z-20">
            <button
              className="bg-red-500 p-6 text-white font-extrabold text-2xl rounded-md w-full border-2 border-red-500 hover:bg-white hover:text-red-500 hover:border-red-500 transition-all duration-300"
              type="submit"
            >
              Post Job - $500
            </button>
          </section>
        </form>
      )}
    </Form>
  );
}
