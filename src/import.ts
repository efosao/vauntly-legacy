import { request, gql } from "graphql-request";
import * as SerpApi from "google-search-results-nodejs";

const search = new SerpApi.GoogleSearch(
  "35f2e2fbe1b7e90bd4b19c3e3cabcce60bca0c56f49595b7dd31c1831387cd50"
);

async function getData() {
  const query = gql`
    {
      serp_google_jobs_import {
        start_index
        raw_data
        q
        jobs_count
        id
        external_id
        details_complete
        detail_records
        date_updated
        date_imported
        date_created
      }
    }
  `;

  const result = await request("http://localhost:8080/v1/graphql", query);
  console.log(result);
}

async function getJobDetails() {
  const queryJobsList = gql`
    {
      serp_google_jobs_import(limit: 1) {
        raw_data
      }
    }
  `;

  const jobsListResult = await request(
    "http://localhost:8080/v1/graphql",
    queryJobsList
  );
  const jobs_list = jobsListResult?.serp_google_jobs_import[0];
  const jobs_results = jobs_list?.raw_data?.jobs_results || []; // take only one

  jobs_results.forEach(async (job: any) => {
    const { job_id } = job;
    const params = {
      engine: "google_jobs_listing",
      q: job_id,
    };

    search.json(params, (detailInfo: any) => {
      insertPostRecord(job, detailInfo);
    });
  });
}

async function insertPostRecord(jobInfo: any, jobDetailInfo: any) {
  const query = gql`
    mutation MyMutation(
      $title: String
      $thumbnail: String
      $post_source: String
      $metadata: jsonb
      $location: String
      $details_metadata: jsonb
      $external_id: String
      $description: String
      $data_source: String
      $company_name: String
      $published_at: timestamptz
    ) {
      insert_posts(
        objects: {
          title: $title
          thumbnail: $thumbnail
          post_source: $post_source
          metadata: $metadata
          location: $location
          details_metadata: $details_metadata
          external_id: $external_id
          description: $description
          published_at: $published_at
          data_source: $data_source
          company_name: $company_name
        }
      ) {
        returning {
          id
        }
      }
    }
  `;

  const { detected_extensions, extensions, job_id } = jobInfo;
  const { search_metadata, apply_options } = jobDetailInfo;
  const metadata = {
    detected_extensions,
    extensions,
    ...jobDetailInfo,
  };

  const variables = {
    title: jobInfo.title,
    thumbnail: jobInfo.thumbnail,
    post_source: jobInfo.via,
    metadata: metadata,
    location: jobInfo.location,
    details_metadata: { apply_options },
    external_id: job_id,
    description: jobInfo.description,
    data_source: "google_jobs",
    company_name: jobInfo.company_name,
    published_at: search_metadata.processed_at,
  };

  // return console.dir({ variables }, { depth: 5 })

  try {
    await request("http://localhost:8080/v1/graphql", query, variables);
    console.log(`inserted job - ${job_id}`);
  } catch (error: any) {
    // ts-fix
    const errors = error.response.errors;
    console.error(`error inserting job - ${job_id}`);
    console.error(errors);
  }
}

async function getJobs() {
  const params = {
    engine: "google_jobs",
    // q: "React Senior Engineer",
    // q: "Solidity Engineer",
    start: 0,
    q: "Java Engineer",
    hl: "en",
  };

  search.json(params, (raw: any, err: any) => {
    if (err) throw err;
    const { search_metadata, search_parameters, jobs_results } = raw;
    const externalId = search_metadata?.id;
    const { q } = search_parameters;
    const startIndex = params.start ?? 0;
    const jobsCount = jobs_results?.length || 0;

    insertData({
      externalId,
      q,
      startIndex,
      jobsCount,
      raw,
    });
  });
}

async function init() {
  // await getData();
  // await insertData();
  // await getJobs();
  await getJobDetails();
}

async function insertData(params: any) {
  const query = gql`
    mutation MyMutation(
      $start_index: Int
      $external_id: String
      $raw_data: jsonb
      $detail_records: jsonb
      $q: String
      $jobs_count: Int
    ) {
      insert_serp_google_jobs_import(
        objects: {
          start_index: $start_index
          raw_data: $raw_data
          detail_records: $detail_records
          q: $q
          jobs_count: $jobs_count
          external_id: $external_id
        }
      ) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  const variables = {
    detail_records: params.detailRecords,
    start_index: params.startIndex,
    external_id: params.externalId,
    raw_data: params.raw,
    q: params.q,
    jobs_count: params.jobsCount,
  };

  const result = await request(
    "http://localhost:8080/v1/graphql",
    query,
    variables
  );
  console.dir({ result }, { depth: 10 });
}

init();
