export const fetchCache = 'force-no-store';
export const maxDuration = 300;
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // always run dynamically

import config from '../../../../../../config.json'
import GithubAPIWrapper from "./github_api";
import RedisWrapper from './redis_wrapper';
import grammar_correction from './grammar_correction';
async function *gitfix(owner: string, repo:string, demo_mode: boolean): AsyncGenerator{
  
  let path = owner + '/' + repo;
  const sleep = async (ms: number) => 
  (new Promise(resolve => setTimeout(resolve, ms)))
  let redis = new RedisWrapper(config["upstash-redis-url"], config["upstash-redis-token"])


  
  //TODO: make the 3 files per user check here 
  
  yield `Processing the repository ${path}`;
  
  let originalRepo = new GithubAPIWrapper(owner,repo,config['github-token'])
  await originalRepo.getItems(true)
  
  let logs = "Discovering items:\n"
  for( let i = 0 ; i < originalRepo.items.length ; ++i ) {
    logs += originalRepo.items[i].path + '\n';
  }
  yield logs
  
  if (originalRepo.items.length == 0){
    yield `Error: Gitfix could not discover any files in the repositoy.
    Make sure you inputed your repository name correctly and your repository is indexed in Github search engine.
    If your repository is not indexed, please wait a while until Github indexes your repository.`
    return  
  }
  
  yield 'Forking the repository.'
  let forkedRepo:GithubAPIWrapper;
  try {
    forkedRepo = await originalRepo.fork()
    await sleep(500);
  }catch(e){
    yield "Error: Forking process failed, aborting!"
    console.log(e)
    return
  }
  console.log("line 46")
  try{
    let unupdatedItems = await redis.getDifference(path, originalRepo.items)
    if (unupdatedItems.length < 1){
      yield "Gitfix has already corrected all grammar errors in the repository."
      return
    }
    console.log(unupdatedItems)
    originalRepo.items = unupdatedItems
    forkedRepo.items = unupdatedItems
  }catch(e){
    yield "Error: Cannot connect to Redis, aborting!"
    console.log(e)
    return
  }
  console.log("line 61")
  //TODO: smarter file selection     
  
  let fileIndexes: Set<number>= new Set();
  while(fileIndexes.size < Math.min(config['files-per-run'], originalRepo.items.length)){
    fileIndexes.add(Math.floor(Math.random() * (originalRepo.items.length)))
  }
  console.log(originalRepo.items)
  console.log("line 74")
  try{
    forkedRepo.details['default_branch'] = originalRepo.details['default_branch'];
    await forkedRepo.createARefFromDefaultBranch("gitfix")
  }catch(e){
    console.log(e)
    yield `Error: Gitfix could not create a new branch for changes.
    This is most likely due to delays in completing the forking process on Github's end.
    Please try again in a minute.`;
    return;
  }
  logs = "Selecting files to update.\n Selected files:"
  fileIndexes.forEach( function(i){
    logs += `\t ${originalRepo.items[i].path}\n`
  })
  console.log(logs)
  yield logs
  const indexes = Array.from(fileIndexes);
  let promises:Promise<void>[] = []
  let yields:string[] = []
  let errored =0
  for(let i = 0; i < indexes.length; i ++){
    let index =  indexes[i];
    yield `Processing ${originalRepo.items[index].path}`;
    let file_content = await originalRepo.getItemContent(index);
    console.log(`Processing ${originalRepo.items[index].path} size : ${file_content.length}`)
    if(file_content.length>50){
      console.log(`create promise for ${originalRepo.items[index].path}`)
      promises.push(
        grammar_correction(file_content).then(async function(corrected_content){
          console.log(`Updating ${originalRepo.items[index].path} size : ${file_content.length}`)
          yields.push(`Updating ${originalRepo.items[index].path}`)
          await forkedRepo.updateFileContent(index, corrected_content)
          await redis.insert(path, forkedRepo.items[index])
          console.log(`resolving ${originalRepo.items[index].path} size : ${file_content.length}`)
        }
        ).catch((e) =>{
          console.log(e)
          yields.push(`Error: File ${originalRepo.items[index].path} is not updated due to limitations in OpenAI API. Please try again in a few minutes.`)
          errored += 1;
        })
      ) 
    }
  }
  let ended = false
  Promise.all(promises).then(() => {ended = true});
  let increments = 0;
  while(!ended){
    console.log(`waiting for all promises to finish: elapsed time: ${increments}`)
    await sleep(1000);
    if (yields.length == 0){
      yield '\u200B';
    }
    else{
      yield yields.shift()
    }
    increments += 1
  }
  if(errored < indexes.length){
    yield "Success: Creating PR request.";
    await originalRepo.createPR(forkedRepo);
  }
  
}
type Params = {
  owner: string,
  repo: string
}

export async function GET(request: Request, context: { params: Params }) {
  // This encoder will stream your text
  const encoder = new TextEncoder();
  let owner = context.params.owner;
  let repo = context.params.repo;
  const customReadable = new ReadableStream({
    async start(controller) {
      for await (let chunk of gitfix(owner, repo, true)) {
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