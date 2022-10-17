import { router, publicProcedure } from "../trpc";

export const appsRouter = router({
  getAll: publicProcedure
    .query(() => ([
      {
        application: 'reactivity-simulation',
        name: 'ReactivitySim',
        description: 'RNA Reactivity is an important hallmark of competent RNA vaccinne production. This application try an in-silico solution to solve this problem and allow you to analyze hundreds of designs and filter better candidates to clinical trials.',
        author: 'Dogma Dx',
        createdAt: '10.11.2022T04:22:01'
      }
    ])),
});
