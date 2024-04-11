export const maxDuration = 300;
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // always run dynamically
import type { NextApiRequest, NextApiResponse } from 'next'
import getConfig from '@/app/modules/config';
import { headers } from 'next/headers'
import { createSession, deleteSession, get } from '../../modules/session_store'
import { NextResponse } from 'next/server';
import generateUserData from '@/app/modules/get_user_data';
export async function GET(request: Request) {
    const headersList = headers()
    const code = headersList.get('code')
    await createSession(code as string)
    let gitfix_config;
    try {
        gitfix_config = await getConfig()
    } catch (e) {
        deleteSession()
        return NextResponse.json({ message: (e as Error).message }, {
            status: 401, headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
            }
        })
    }
    const userData = await generateUserData(gitfix_config)


    return NextResponse.json({ user: userData.user, repos: userData.repos }, {
        status: 200, headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
            'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        }
    })
}