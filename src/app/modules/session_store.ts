import "server-only";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";


type SessionId = string;

export function getSessionId(): SessionId | undefined {
    const cookieStore = cookies();
    return cookieStore.get("session-id")?.value;
}

export function deleteSession(){
    const cookieStore = cookies();
    let id = getSessionId();
    cookieStore.delete('session-id')
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