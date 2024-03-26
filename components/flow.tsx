'use client'

import * as React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Profile, Repository } from 'lib/types'
import { Step, StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import { cn, fixStreamText, ResultCode } from 'lib/utils'
import IconGitHub from './icon-github'
import Image from 'next/image'
import Content from './content'
import { LoaderCircle } from 'lucide-react'
import { getRepositories } from 'app/actions'
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks'
import Fuse from 'fuse.js'
import { useToast } from 'components/ui/use-toast'
import { useEffect } from 'react'

export default function Flow() {
  const { toast } = useToast()

  const [result, dispatch] = useFormState(getRepositories, undefined)
  const { pending } = useFormStatus()

  const [query, setQuery] = React.useState<string>('')
  const [repo, setRepo] = React.useState<undefined | Repository>(undefined)

  const [streamText, setStreamText] = React.useState<{ text: string }[]>([])
  const [isStream, setStream] = React.useState<boolean>(false)
  const [isFinish, setFinish] = React.useState<boolean>(false)

  const hasRepo = result && result?.type === ResultCode.Success
  const user = hasRepo && (result.repos[0].owner as Profile)
  const data = hasRepo ? result.repos : []

  const fuse = new Fuse(data, {
    keys: ['name']
  })

  const filterData = query ? fuse.search(query).map(o => o.item) : data

  useEffect(() => {
    setQuery('')
    setRepo(undefined)

    if (!result) return

    if (result.type === ResultCode.EnvironmentError) {
      toast({
        variant: 'destructive',
        title: 'Environment Error',
        description: 'Please set the GITHUB_TOKEN environment variable'
      })
    }
    if (result.type === ResultCode.Error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch repositories'
      })
    }
  }, [result])

  async function fixRepo(username: string, repo: string): Promise<any> {
    if (!username || !repo) {
      return alert('Please enter a valid username and repo')
    }

    try {
      setStreamText([])
      setStream(true)
      setFinish(false)

      const response = await fetch(
        `https://gitfix-next-backend.vercel.app/api/gitfix/${username}/${repo}`
      )

      if (!response.body) {
        return alert('No response from server')
      }

      const reader = response.body.getReader()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          setStream(false)
          break
        }
        const decoder = new TextDecoder()
        const newData = decoder.decode(value)
        const parseData = JSON.parse(newData.replace(/\n/g, ''))
        console.log(parseData)
        setStreamText(prevState => [...prevState, parseData])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setStream(false)
      setFinish(true)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-10 pointer-events-none">
        {isFinish && <Fireworks autorun={{ speed: 2, duration: 1000 }} />}
      </div>

      <Step className="mt-16 md:mt-20">
        {/* Github profile */}
        <StepItem>
          <StepNumber />
          <StepTitle>Select a Github Account</StepTitle>
          <StepContent>
            <Content>
              {user ? (
                <>
                  <Image
                    src={user.avatar_url}
                    alt={user.login}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="font-medium">{user.login}</span>

                  <form action={dispatch} className="ml-auto flex">
                    <input hidden name="username" />
                    <Button size="sm" variant="outline" disabled={pending}>
                      Change Github Account
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <IconGitHub height={32} />
                  <form
                    action={dispatch}
                    className="flex items-center grow gap-2"
                  >
                    <Input
                      name="username"
                      className="grow"
                      placeholder="username"
                      disabled={pending}
                    />
                    <Button size="sm" disabled={pending}>
                      {pending && (
                        <LoaderCircle size={20} className="animate-spin" />
                      )}
                      Get Repositories
                    </Button>
                  </form>
                </>
              )}
            </Content>
          </StepContent>
        </StepItem>

        {/* Select a repository */}
        <StepItem>
          <StepNumber />
          <StepTitle>Select a repository</StepTitle>
          {hasRepo && (
            <StepContent>
              {repo ? (
                <Content>
                  <div className="flex items-center gap-2 w-full">
                    <IconGitHub height={28} />
                    <a
                      className="font-medium underline decoration-zinc-500/50"
                      href={repo.html_url}
                      target="_blank"
                    >
                      {repo.html_url.replace('https://', '')}
                    </a>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRepo(undefined)
                      setStreamText([])
                    }}
                  >
                    Change Repository
                  </Button>
                </Content>
              ) : (
                <>
                  <Input
                    placeholder="Search..."
                    onChange={e => setQuery(e.target.value)}
                  />
                  <Content className="p-0 mt-4">
                    <ScrollArea className={cn('h-[260px] p-2 w-full')}>
                      <Table className="text-left">
                        <TableBody>
                          {filterData.map(repo => (
                            <TableRow key={repo.id}>
                              <TableCell className="font-medium py-2">
                                {repo.name}
                              </TableCell>
                              <TableCell className="text-right py-2">
                                <Button
                                  size="sm"
                                  className=""
                                  onClick={async () => {
                                    if (!user) return
                                    setRepo(repo)
                                    await fixRepo(user.login, repo.name)
                                  }}
                                >
                                  Fix!
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </Content>
                </>
              )}
            </StepContent>
          )}
        </StepItem>

        {/* Creating PR Request */}
        <StepItem>
          <StepNumber />
          <StepTitle>Creating PR Request</StepTitle>
          {repo && (
            <StepContent>
              <Content className="px-5">
                <pre className="w-full text-sm text-pretty whitespace-pre-wrap">
                  {streamText.map((o, i) => (
                    <span
                      key={i}
                      className="flex w-full mt-1 last:font-semibold last:text-emerald-600"
                    >
                      {fixStreamText(o.text)}
                    </span>
                  ))}
                  {isStream && (
                    <span className="mt-1 flex items-center gap-2 font-semibold text-emerald-600">
                      <LoaderCircle size={18} className="animate-spin" />
                      Processing...
                    </span>
                  )}
                  {/*{isFinish && (*/}
                  {/*  <a*/}
                  {/*    className="mt-4 flex text-emerald-600"*/}
                  {/*    href={repo.html_url}*/}
                  {/*    target="_blank"*/}
                  {/*  >*/}
                  {/*    <span className="underline font-semibold">{repo.html_url.replace('https://', '')}</span> has been fixed!*/}
                  {/*  </a>*/}
                  {/*)}*/}
                </pre>
              </Content>
            </StepContent>
          )}
        </StepItem>
      </Step>
    </>
  )
}
