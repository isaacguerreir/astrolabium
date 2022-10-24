import React, { useEffect, useState } from "react";
import { injectScript } from '@module-federation/nextjs-mf/utils';
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '../../../../server/trpc/router/_app';

type AppData = inferProcedureOutput<AppRouter['apps']['findOne']>

const RemoteModule = <T extends AppData>({ appName: global, component, url }: Partial<T>) => {
	const [RemoteApp, setApp] = useState()

	useEffect(() => {
    global && url && injectScript({
			global,
			url
		}).then((remoteContainer) => remoteContainer.get(`./${component}`))
		.then((factory) => {
			const loadComponent = factory().default
      setApp(loadComponent)
		})
	}, [])

  if (RemoteApp) return RemoteApp

  return(<div>Loading...</div>)
} 

export default RemoteModule
