import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

import { prismaClient } from '~/utils/prismaClient';

export const appRouter = trpc
  .router()
  .query('hello', {
    input: z
      .object({
        limit: z.number().default(10),
        skip: z.number().default(0)
      })
      .nullish(),
    async resolve({ input }) {
      const result = await prismaClient.posts.findMany({
        orderBy: { id: "desc" },
        select: {
          company_name: true,
          created_at: true,
          created_by_user_id: true,
          description: true,
          external_id: true,
          id: true,
          location: true,
          published_at: true,
          state: true,
          thumbnail: true,
          title: true,
          updated_at: true,
        },
        skip: input?.skip,
        take: input?.limit,
        where: {
          OR: [
            { published_at: { not: null } },
            { created_by_user_id: { not: null } }
          ]
        }
      });

      return result;
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  createContext: () => null,
  router: appRouter,
});

