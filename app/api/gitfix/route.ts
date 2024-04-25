// export const maxDuration = 300;
export const fetchCache = 'force-no-store'
export const runtime = 'edge'
export const dynamic = 'force-dynamic' // always run dynamically
import { deleteSession } from 'modules/session_store'
import getConfig from 'modules/config'
import gitfix from 'modules/gitfix'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const owner = searchParams.get('owner')
  const repo = searchParams.get('repo')

  if (!owner || !repo) {
    return NextResponse.json(
      { message: 'Invalid owner or repo' },
      {
        status: 400,
        headers,
      },
    )
  }

  // This encoder will stream your text
  const encoder = new TextEncoder()
  let gitfix_config

  try {
    gitfix_config = await getConfig()
  } catch (e) {
    deleteSession()

    return NextResponse.json(
      { message: (e as Error).message },
      {
        status: 401,
        headers,
      },
    )
  }

  // console.log(gitfix_config)

  const customReadable = new ReadableStream({
    async start(controller) {
      for await (let chunk of gitfix(owner, repo, false, gitfix_config)) {
        const chunkData = encoder.encode(JSON.stringify(chunk))
        controller.enqueue(chunkData)
      }
      controller.close()
    },
  })

  return new Response(customReadable, { headers })
}

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
}
