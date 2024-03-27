export const fetchCache = 'force-no-store';
export const maxDuration = 300;
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // always run dynamically

import config from '../../../../../../config.json'

import gitfix from "./gitfix";
type Params = {
  owner: string,
  repo: string
}

function generate_config_from_environment(): any{
  let obj:any = {
    "files-per-run": process.env.FILES_PER_RUN,
    "github-token": process.env.GITHUB_TOKEN,
    "upstash-redis-url": process.env.UPSTASH_REDIS_URL,
    "upstash-redis-token": process.env.UPSTASH_REDIS_TOKEN,
    "openai-key": process.env.OPENAI_KEY,
  }
  return <JSON>obj 
}
export async function GET(request: Request, context: { params: Params }) {
  // This encoder will stream your text
  const encoder = new TextEncoder();
  let owner = context.params.owner;
  let repo = context.params.repo;
  let gitfix_config = config;
  if(process.env.GITFIX_USE_ENV){
    gitfix_config = generate_config_from_environment()
  }
  console.log(config)
  const customReadable = new ReadableStream({
    async start(controller) {
      for await (let chunk of gitfix(owner, repo, false, gitfix_config)) {
        const chunkData =  encoder.encode(JSON.stringify(chunk));
        controller.enqueue(chunkData);
      }
      controller.close();
    },
  });
  return new Response(customReadable, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 
              'Cache-Control': 'no-cache',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
              'Access-Control-Allow-Headers':'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
             },
  });
}
