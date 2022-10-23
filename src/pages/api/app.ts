
import type { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "../../utils/trpc";

export const all = async (_: NextApiRequest, res: NextApiResponse) => {
  const apps = trpc.apps.all.useQuery()
  res.status(200).json(apps);
};
