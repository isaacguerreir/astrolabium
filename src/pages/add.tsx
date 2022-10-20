import type { NextPage } from "next";
import Head from 'next/head'
import {useRouter} from 'next/router'
import { useForm, FieldValues } from "react-hook-form";
import { Visibility } from '@prisma/client'
import { trpc } from "../utils/trpc";

interface AppInput {
  name: string
  description: string
  visibility: Visibility
}

const AddPage: NextPage = () => {
  const createAppMutation  = trpc.apps.create.useMutation()
  const router = useRouter()
	const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (input: AppInput) => {
    createAppMutation.mutate({
      ...input
    })
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Add application</title>
        <meta name="description" content="Astrolabium application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem] mb-6">
          Add your <span className="text-purple-300">app</span>
        </h1>

				<div className="w-full max-w-xl">
					<div className="flex flex-wrap -mx-3 mb-4">
						<div className="w-full px-3">
							<label className="block uppercase tracking-wide text-purple-400 text-xs font-bold mb-2">
								Name
							</label>
							<input {...register('name', {required: true} )} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 placeholder:text-sm" id="grid-password" placeholder="What is the name of your application?" />
              { errors.name && <div className="text-sm text-red-400 font-bold">Field name is required.</div> }
						</div>
					</div>

					<div className="flex flex-wrap -mx-3 mb-4">
						<div className="w-full px-3">
							<label className="block uppercase tracking-wide text-purple-400 text-xs font-bold mb-2">
								Description
							</label>
							<textarea {...register('description', {required: true} )} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 placeholder:text-sm" id="grid-password" placeholder="How can you describe your application in one or two paragraphs?" />
              { errors.description && <div className="text-sm text-red-400 font-bold">Field description is required.</div> }
						</div>
					</div>

					<div className="flex flex-wrap -mx-3 mb-2">
						<div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
							<label className="block uppercase tracking-wide text-purple-400 text-xs font-bold mb-2">
								Visibility
							</label>
							<div className="relative">
								<select defaultValue="PUBLIC" {...register('visibility', {required: true} )} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
									<option value="PUBLIC">Public</option>
									<option value="PRIVATE">Private</option>
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
									<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
								</div>
							</div>
						</div>
					</div>

					<div className="flex flex-row-reverse">
						<button onClick={handleSubmit(onSubmit)} className="py-3 px-6 bg-purple-200 font-bold text-gray-600 border-2 border-purple-300 rounded hover:bg-purple-500 hover:text-white">Confirm</button>

					</div>
				</div>
      </main>
    </>
  )
}

export default AddPage
