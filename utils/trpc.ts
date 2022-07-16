import { createReactQueryHooks } from '@trpc/react';
import { NextPageContext } from 'next';

import type { AppRouter } from '../pages/api/trpc/[trpc]';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}

export interface SSRContext extends NextPageContext {
  /**
   * Set HTTP Status code
   * @usage
   * const utils = trpc.useContext();
   * if (utils.ssrContext) {
   *   utils.ssrContext.status = 404;
   * }
   */
  status?: number;
}