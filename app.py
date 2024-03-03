import json
import time
from threading import Thread
import asyncio
from fastapi.responses import StreamingResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from queue import Queue
import os
import uvicorn

from GitFix import gitfix
# creating a fast application
app = FastAPI(docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# initializing the queue

class Response_handler:
    def __init__(self, owner, repo):
        self.streamer_queue = Queue()
        self.owner = owner
        self.repo = repo
        self.streaming = True

    def print(self, s):
        self.streamer_queue.put(s)
    # fake data streamer
    def process_repository(self):
        gitfix(self.owner, self.repo, printer = self, demo_mode=True)
        self.streaming = False
    def start_generation(self):
        thread = Thread(target=self.process_repository)
        thread.start()
    async def serve_data(self):
        # Optinal code to start generation - This can be started anywhere in the code
        self.start_generation()

        while True:
            # Stopping the retreival process if queue gets empty
            if self.streamer_queue.empty() and not self.streaming:
                print("stopping streaming")
                break
            # Reading and returning the value from the queue
            else:
                value = self.streamer_queue.get()
                yield json.dumps({"text": str(value)})
                self.streamer_queue.task_done()
            # Providing a buffer timer to the generator, so that we do not
            # break on a false alarm i.e generator is taking time to generate
            # but we are breaking because the queue is empty
            # 2 is an arbitrary number that can be changed based on the choice of
            # the developer
            await asyncio.sleep(1)
@app.get('/{owner}/{repo}')
async def stream(owner, repo):
    response = Response_handler(owner, repo)
# We use Streaming Response class of Fast API to use the streaming response
    return StreamingResponse(response.serve_data(), media_type="application/json; charset=utf-8")


if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))