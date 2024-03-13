<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>
<template >
  <h1>{{ msg}}</h1>
  <h3> Correct grammar errors in your md and mdx files!</h3>
  <p>Gitfix uses github and OpenAI apis to fetch your md/mdx files and uses GPT4 to correct grammatical errors.</p>
  <p>Begin by inserting your public Github repo's link to the text area.</p>

  <div class="card">
    <input v-model="message" placeholder="your repo's Github link" :style="{ 'font-size': 14 + 'px' , width:'50%'}" />
    <p></p>
    <button type="button" @click="handleInput()" :style="{ 'font-size': 14 + 'px' }">Begin Processing</button>
    <v-virtual-scroll :height="300" :items="items" :onLoad="load">
      <template v-for="(item, index) in items" :key="item">
        <div style="text-align: left; white-space: pre;">
         {{ item }}
        </div>
      </template>
    </v-virtual-scroll>
  </div>
</template>
<script>
import axios from 'axios'
import https from 'https'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = "*"
export default {
  data() {
    return {
      api_endpoint: 'https://gitfix.fly.dev',
      api_response: null,
      text: "",
      items: []
    }
  },
  methods: {
    async readData(url) {
      const response = await fetch(url);
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Do something with last chunk of data then exit reader
          return;
        }
        let decoder = new TextDecoder();
        let newData = decoder.decode(value)
        newData = JSON.parse(newData)
        this.items.push(newData.text + '\n')
        console.log(newData.text)
      }
    },
    async handleInput() {
      this.items = []
      let split = this.message.split('/');
      console.log(split);
      let owner = split[split.length -2]
      let repo =  split[split.length -1]
      console.log(split[split.length -2])
      console.log(split[split.length -1])
      let fetch_url = this.api_endpoint + '/' + owner + '/' + repo
      console.log(fetch_url)
      await this.readData(fetch_url)
      // fetch("https://streaming4.fly.dev")
      //   // Retrieve its body as ReadableStream
      //   .then((response) => {
      //     const reader = response.body.getReader();
      //     let decoder = new TextDecoder();
      //     return new ReadableStream({
      //       start(controller) {
      //         return pump();
      //         function pump() {
      //           return reader.read().then(({ done, value }) => {
      //             // When no more data needs to be consumed, close the stream
      //             if (done) {
      //               controller.close();
      //               return;
      //             }
      //             let newData = decoder.decode(value, {stream: !done});
      //             // newData= JSON.parse(newData);
      //             console.log(newData)

      //             // Enqueue the next data chunk into our target stream
      //             return reader.read().then(pump);
      //           });
      //         }
      //       },
      //     });
      //   })
    },
    process_response(response) {
      console.log(response);
      this.api_response = response
    }
  }
};
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
