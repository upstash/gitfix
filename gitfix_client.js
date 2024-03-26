config = require('./config.json')


repo = config['github-repo']
split = repo.split('/')
owner = split[split.length -2]
repo = split[split.length -1]

function fixStreamText(value) {
    if (!value) return value
  
    return value
      .replace(/""/g, '\n')
      .replace(/\\n /g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\n ✓')
      .trim()
  }


async function sendRequest(){

    const response = await fetch(
        `http://localhost:3000/api/gitfix/${owner}/${repo}`
      )

      if (!response.body) {
        return alert('No response from server')
      }

      const reader = response.body.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        const decoder = new TextDecoder()
        const a = decoder.decode(value)

        //skip null packages 
        if(a.length < 5){
            continue
        }
        // console.log(a)
        let b = fixStreamText(a)
        // remove " chars
        b = b.split('\"').join('')
        console.log(b)
      }
    }
        
sendRequest()