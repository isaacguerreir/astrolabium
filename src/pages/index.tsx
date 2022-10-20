import type { NextPage } from "next"
import Link from 'next/link'
import React from 'react'
import Head from "next/head"
import { signIn, signOut, useSession } from "next-auth/react"
import { trpc } from "../utils/trpc"
import { AppRouter } from '../server/trpc/router/_app'
import { inferProcedureOutput } from "@trpc/server"
import { Visibility } from "@prisma/client"

const Home: NextPage = () => {
  const { isLoading, data } = trpc.apps.all.useQuery() 

  return (
    <>
      <Head>
        <title>List of applications</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
				{ isLoading ? <Loading /> : (
					<>
						<h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
							List of <span className="text-purple-300">Lattice</span> Apps
						</h1>
						<div className="flex w-full max-w-4xl flex-row-reverse mb-3 mt-7">
							<Link href="/add">
								<button>
									<div className="px-4 py-2 border-2 border-black flex items-center justify-center rounded font-bold text-gray-700 text-lg hover:bg-gray-700 hover:text-white">
										<div className="text-xl font-bold mr-3">Create a new app</div>
										<h2 className="text-lg">+</h2>
									</div>
								</button>
							</Link>
						</div>
						<div className="flex flex-col w-full mx-auto justify-center items-center">
							{ data && Apps(data) }
						</div>
					</>
				)}
      </main>
    </>
  )
}

const Loading = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-spin">
			<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
		</svg>
	)
}

const Apps = (apps: inferProcedureOutput<AppRouter['apps']['all']>) => {
   return apps.map(({ name, description, visibility, author }) =>  (
      <div className="w-full max-w-4xl my-1 border border-gray-400 lg:border-gray-400 bg-white rounded p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
          { visibility === Visibility.PRIVATE ? <Private /> : <Public /> }
          </p>
          <div className="text-gray-900 font-bold text-xl mb-2">{ name }</div>
          <p className="text-gray-700 text-base">{ description }</p>
        </div>
        <div className="flex items-center">
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{ author.name }</p>
            <p className="text-gray-600">Aug 18</p>
          </div>
        </div>
      </div>
    )
  )
}

const Public = () => {
	return(
		<>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
			</svg>
			<span className="ml-2">Public</span>
		</>
	)
}

const Private = () => {
	return(
		<>
			<svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
				<path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
			</svg>
			Private
		</>
	)
}

export default Home

const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery()

  const { data: sessionData } = useSession()
  console.log(sessionData)

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  )
}
