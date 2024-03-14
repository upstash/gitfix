'use client'

import React from 'react'
import { Repository } from 'lib/types'
import { Step, StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Fuse from 'fuse.js'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import { cn } from 'lib/utils'
import IconGitHub from './icon-github'
import Content from './content'

export default function Flow({ data }: { data: Repository[] }) {
  const { data: session } = useSession()

  const [query, setQuery] = React.useState<string>('')
  const [repo, setRepo] = React.useState<Repository>()
  const [streamText, setStreamText] = React.useState<{ text: string }[]>([])

  const fuse = new Fuse(data, {
    keys: ['name']
  })

  const filterData = query ? fuse.search(query).map(o => o.item) : data

  async function fixRepo(username: string, repo: string): Promise<any> {
    if (!username || !repo) {
      return alert('Please enter a valid username and repo')
    }

    const response = await fetch(`https://gitfix.fly.dev/${username}/${repo}`)

    if (!response.body) {
      return alert('No response from server')
    }

    const reader = response.body.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) return

      const decoder = new TextDecoder()
      const newData = decoder.decode(value)
      const parseData = JSON.parse(newData)
      console.log(parseData)
      setStreamText(prevState => [...prevState, parseData])
    }
  }

  return (
    <Step>
      {/* Login with GitHub */}
      <StepItem>
        <StepNumber />
        <StepTitle>Login with GitHub</StepTitle>
        <StepContent>
          <Content>
            {session ? (
              <>
                <div className="flex items-center gap-2 w-full">
                  <Image
                    src={session.user.image!}
                    alt={session.user.name!}
                    width={32}
                    height={32}
                  />
                  <span className="font-medium">{session.user.name}</span>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/auth/signout">Logout</Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">
                  <IconGitHub className="mr-2" height={20} />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </Content>
        </StepContent>
      </StepItem>

      {/* Select a repository */}
      <StepItem>
        <StepNumber />
        <StepTitle>Select a repository</StepTitle>
        {session && (
          <StepContent>
            {repo ? (
              <Content>
                <div className="flex items-center gap-2 w-full">
                  <IconGitHub height={28} />
                  <span className="font-medium">{repo.html_url}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setRepo(undefined)
                    setStreamText([])
                  }}
                >
                  Change
                </Button>
              </Content>
            ) : (
              <>
                <Input
                  placeholder="Search..."
                  onChange={e => setQuery(e.target.value)}
                />
                <Content className="p-0 mt-4">
                  <ScrollArea className={cn('h-[280px] p-2 w-full')}>
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
                                  setRepo(repo)
                                  await fixRepo(
                                    session.user.username!,
                                    repo.name
                                  )
                                }}
                              >
                                Select
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
            <Content>
              <pre className="text-sm whitespace-pre-wrap">
                {streamText.map((o, i) => (
                  <span key={i} className="block last:font-semibold">
                    {o.text}
                  </span>
                ))}
              </pre>
            </Content>
          </StepContent>
        )}
      </StepItem>
    </Step>
  )
}
