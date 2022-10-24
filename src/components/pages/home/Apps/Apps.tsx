import { inferProcedureOutput } from "@trpc/server"
import Link from "next/link"
import { AppRouter } from "../../../../server/trpc/router/_app"
import { trpc } from "../../../../utils/trpc"
import { Visibility } from '@prisma/client'
import Private from "../Private"
import Public from "../Public"
import { Session } from "next-auth"

type AppsData = inferProcedureOutput<AppRouter['apps']['all']>

const Apps = ({ apps, session, refetch }: { apps: AppsData | undefined, session: Session | null, refetch: () => void }) => {
	const mutation = trpc.apps.remove.useMutation({
    onSuccess: async () => refetch()
  })
	const remove = (id: string) => {
		mutation.mutate({ id })
	}

  return(
		<>
			{ apps && apps.map(({ id, name, description, visibility, author }) =>  (
      <div key={id} className="w-full max-w-4xl my-1 border border-gray-400 lg:border-gray-400 bg-white rounded p-4 flex flex-col justify-between leading-normal">
				<div className="flex w-full justify-between mb-2">
					<p className="text-sm text-gray-600 flex items-center">
					{ visibility === Visibility.PRIVATE ? <Private /> : <Public /> }
					</p>
          {
            (session && session.user?.id === author.id && (
              <button onClick={() => remove(id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            ))
          }
				</div>
        <div className="mb-8">
          <div className="text-gray-900 font-bold text-xl mb-2">{ name }</div>
          <p className="text-gray-700 text-base">{ description }</p>
       </div>
       <div className="flex justify-between">
          <div className="flex items-center">
            <div className="text-sm">
              <p className="text-gray-900 leading-none">{ author.name }</p>
              <p className="text-gray-600">Aug 18</p>
            </div>
          </div>

          <Link href={`/runner/${id}`}>
            <button className="flex border rounded py-2 px-5 border-black">
              <div className="mr-3 font-bold text-black">Open</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </button>
          </Link>
        </div>
      </div>))
			}
		</>
	)
}

export default Apps
