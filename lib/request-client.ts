import request from "graphql-request";
import { getSession } from "next-auth/react";

const url = `${process.env.NEXT_PUBLIC_GQL_HOST}/v1/graphql`;

export default async function requestClient(query, variables) {
  const session: any = await getSession();
  const authorization = `Bearer ${session.token}`;

  return request(
    url,
    query,
    variables,
    {
      authorization
    }
  )
}