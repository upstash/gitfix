// export const maxDuration = 300;
export const fetchCache = 'force-no-store'
export const runtime = 'edge'
export const dynamic = 'force-dynamic' // always run dynamically
import { deleteSession } from 'modules/session_store'
import getConfig from 'modules/config'
import gitfix from 'modules/gitfix'
import { NextResponse } from 'next/server'

type Params = {
  owner: string
  repo: string
}

export async function GET(request: Request, context: { params: Params }) {
  // This encoder will stream your text
  const encoder = new TextEncoder()
  let owner = context.params.owner
  let repo = context.params.repo
  let gitfix_config

  try {
    gitfix_config = await getConfig()
  } catch (e) {
    deleteSession()

    return NextResponse.json(
      { message: (e as Error).message },
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers':
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
        },
      },
    )
  }

  console.log(gitfix_config)

  const customReadable = new ReadableStream({
    async start(controller) {
      for await (let chunk of gitfix(owner, repo, false, gitfix_config)) {
        const chunkData = encoder.encode(JSON.stringify(chunk))
        controller.enqueue(chunkData)
      }
      controller.close()
    },
  })

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers':
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  })
}
