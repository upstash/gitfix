import GithubAPIWrapper from "./github_api";
import RedisWrapper from './redis_wrapper';
import grammar_correction from './grammar_correction';

async function* gitfix(owner: string, repo: string, demo_mode: boolean, config: any): AsyncGenerator {

  let path = owner + '/' + repo;
  const sleep = async (ms: number) =>
    (new Promise(resolve => setTimeout(resolve, ms)))
  let redis = new RedisWrapper(config["upstash-redis-url"], config["upstash-redis-token"])

  if (demo_mode) {
    let prev_changed_files = await redis.getMembers(owner)
    if (prev_changed_files.length > 3) {
      yield "Error: Gitfix has already corrected 3 files in repositories of this user in demo mode. Please install gitfix for unlimited use. For installation, see https://github.com/upstash/gitfix for more.\n\n"
      return
    }
  }


  //TODO: make the 3 files per user check here 

  yield `Processing the repository ${path}\n\n`;

  let originalRepo = new GithubAPIWrapper(owner, repo, config['github-token'])
  await originalRepo.getItems()

  let logs = "Discovering items:\n\n"
  for (let i = 0; i < originalRepo.items.length; ++i) {
    logs += '- ' + originalRepo.items[i].path + '\n\n';
  }


  if (originalRepo.items.length == 0) {
    yield `Error: Gitfix could not discover any files in the repositoy.
    Make sure you inputed your repository name correctly and your repository is indexed in Github search engine.
    If your repository is not indexed, please wait a while until Github indexes your repository.\n\n`
    return
  } else {
    yield `Gitfix discovered ${originalRepo.items.length} files in the repository.\n\n`
  }

  yield 'Forking the repository. \n\n'
  let forkedRepo: GithubAPIWrapper;
  try {
    forkedRepo = await originalRepo.fork()
    await sleep(500);
  } catch (e) {
    yield "Error: Forking process failed, aborting!\n\n"
    console.log(e)
    return
  }
  try {
    let unupdatedItems = await redis.getDifference(path, originalRepo.items)
    if (unupdatedItems.length < 1) {
      yield "Gitfix has already corrected all grammar errors in the repository.\n\n"
      return
    }
    console.log(unupdatedItems)
    originalRepo.items = unupdatedItems
    forkedRepo.items = unupdatedItems
  } catch (e) {
    yield "Error: Cannot connect to Redis, aborting!\n\n"
    console.log(e)
    return
  }
  //TODO: smarter file selection     

  try {
    forkedRepo.details['default_branch'] = originalRepo.details['default_branch'];
    await forkedRepo.createARefFromDefaultBranch("gitfix")
  } catch (e) {
    console.log(e)
    yield `Error: Gitfix could not create a new branch for changes.\n
    This is most likely due to delays in completing the forking process on Github's end.\n
    Please try again in a minute.\n`;
    return;
  }

  let fileIndexes: Set<number> = new Set();
  if (demo_mode) {
    let promises: Promise<string | void>[] = [];
    let sizes: { [id: number]: number;[size: string]: number }[] = [];
    for (let i = 0; i < originalRepo.items.length; i++) {
      promises.push(
        originalRepo.getItemContent(i).then(function (content) {
          sizes.push({ size: content.length, id: i });
        })
      )
    }
    await Promise.all(promises);
    sizes.sort((a, b) => a.size - b.size)
    console.log(sizes)
    let index = 0;
    for (let i = 0; i < sizes.length; i++) {
      console.log(sizes[i])
      if (sizes[i].size > 100 && sizes[i].size < 15000) {
        fileIndexes.add(sizes[i].id);
      }
      if (fileIndexes.size >= config['files-per-run']) {
        break;
      }
    }
  }
  else {
    while (fileIndexes.size < Math.min(config['files-per-run'], originalRepo.items.length)) {
      fileIndexes.add(Math.floor(Math.random() * (originalRepo.items.length)))
    }
  }
  if (fileIndexes.size > 0) {
    yield "Selecting files to update.\n\n"
  } else {
    yield "Error: Gitfix could not find an unupdated file that is sufficiently long(more than 100 chars). Aborting.\n"
    return
  }
  console.log(logs)
  const indexes = Array.from(fileIndexes);
  yield "Selected files:\n\n"
  for (let i = 0; i < indexes.length; i++) {
    yield `- ${originalRepo.items[indexes[i]].path}\n\n`
  }
  let promises: Promise<void>[] = []
  let yields: string[] = []
  let errored = 0
  for(let i = 0; i < indexes.length; i ++){
    let index =  indexes[i];
    yield `Processing ${originalRepo.items[index].path}\n\n`;
    let file_content = await originalRepo.getItemContent(index);
    console.log(`Processing ${originalRepo.items[index].path} size : ${file_content.length}\n\n`)
    if(file_content.length>50){
      console.log(`create promise for ${originalRepo.items[index].path}`)
      promises.push(
        grammar_correction(file_content, config).then(async function(corrected_content){
          console.log(`Updating ${originalRepo.items[index].path} size : ${file_content.length}`)
          yields.push(`Updating ${originalRepo.items[index].path}\n\n`)
          await forkedRepo.updateFileContent(index, corrected_content)
          await redis.insert(owner, forkedRepo.items[index])
          console.log(`resolving ${originalRepo.items[index].path} size : ${file_content.length}`)
        }
        ).catch((e) =>{
          console.log(e)
          yields.push(`Error: File ${originalRepo.items[index].path} is not updated due to limitations in OpenAI API.\nPlease try again in a few minutes.\n`)
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
  if (errored == indexes.length) {
    //yield an error here
  }
  const targetRepo = originalRepo;
  const prKey = targetRepo.owner + targetRepo.repo + "PR";
  type PR = {
    link: string;
    number: number;
}
  let previousPRlist: PR[] = await redis.getMembers(prKey);
  if (previousPRlist.length > 0) {
    console.log(`previously existing pr`)
    let previousPR = previousPRlist[0]
    console.log(previousPR)
    if(!(await targetRepo.checkIfMerged(previousPR.number))){
      yield `Success: Gitfix found a previous PR that includes suggested grammar corrections and appended changes to it. You can see the created request [here](${previousPR.link}).`
      return
   }
  }

  yield "Creating PR request.\n";
  let response = await targetRepo.createPR(forkedRepo);
  let content = await response.json()
  console.log(content)
  if(response.ok){

    redis.insert(prKey, ({"link" : content.html_url, "number": content.number}))
    yield `Success: Gitfix created a PR that includes suggested grammar corrections. You can see the created request [here](${content.html_url}).`
  }else{
    yield `Error: Something went wrong during PR creation, please try again in a minute.`
  }


}

export default gitfix