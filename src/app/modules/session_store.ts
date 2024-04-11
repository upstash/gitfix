import "server-only";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";


type SessionId = string;

export function getSessionId(): SessionId | undefined {
    const cookieStore = cookies();
    return cookieStore.get("session-id")?.value;
}

function setSessionId(sessionId: SessionId): void {
    const cookieStore = cookies();
    cookieStore.set("session-id", sessionId);
}

export function getSessionIdAndCreateIfMissing() {
    const sessionId = getSessionId();
    if (!sessionId) {
        const newSessionId = crypto.randomUUID();
        setSessionId(newSessionId);

        return newSessionId;
    }

    return sessionId;
}

export async function createSession(sessionId: SessionId) {
    let sessionIdValue = getSessionId();
    if (!sessionIdValue) {
        
        setSessionId(sessionId);
        //TODO use env
        const params = {
            "code" : sessionId,
            "client_id": "Iv1.203244c6dd3aa706",
            "client_secret": "e5babb69693b253dbcda9a953a9b40f01f29aa7e" 
        };
        const query = new URLSearchParams(params).toString();
        const res = await fetch('https://github.com/login/oauth/access_token/?' + query  ,{
            method: 'POST',
            headers: {
                'accept': 'application/json'
            }
        })
        let authResponse = await res.json()
        //status code 200 on success
        console.log(authResponse)
        console.log(res.status)
        set("access_token", authResponse["access_token"])

        return sessionId;
    }

    return sessionId;
}

export function get(key: string, namespace: string = "") {
    const sessionId = getSessionId();
    if (!sessionId) {
        return null;
    }
    return kv.hget(`session-${namespace}-${sessionId}`, key);
}

export function set(key: string, value: string, namespace: string = "") {
    const sessionId = getSessionIdAndCreateIfMissing();
    return kv.hset(`session-${namespace}-${sessionId}`, { [key]: value });
}