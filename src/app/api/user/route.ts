export const maxDuration = 300;
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // always run dynamically
import type { NextApiRequest, NextApiResponse } from 'next'

import { headers } from 'next/headers'
import {createSession, get} from '../../modules/session_store'
import getConfig from '@/app/modules/config';
import { NextResponse } from 'next/server';
import generateUserData from '@/app/modules/get_user_data';
export async function GET(request: Request) {
    
    let gitfix_config
    try {
        gitfix_config = await getConfig()
    } catch (e) {
        return NextResponse.json({ message: (e as Error).message }, {
            status: 403, headers: {
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


    return NextResponse.json({ user: userData.user , repos: userData.repos }, {
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