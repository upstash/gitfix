// export const maxDuration = 300;
export const runtime = 'edge'
export const dynamic = 'force-dynamic' // always run dynamically
import getConfig from 'modules/config'
import { headers } from 'next/headers'
import { createSession, deleteSession } from 'modules/session_store'
import { type NextRequest, NextResponse } from 'next/server'
import generateUserData from 'modules/get_user_data'

export async function GET(request: NextRequest) {
  const headersList = headers()
  const code = headersList.get('code')

  let userData
  let gitfix_config

  await createSession(code as string)

  try {
    gitfix_config = await getConfig()
    userData = await generateUserData(gitfix_config)
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

  return NextResponse.json(
    { user: userData.user, repos: userData.repos },
    {
      status: 200,
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
