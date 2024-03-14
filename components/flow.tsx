'use client'

import React from 'react'
import { Repository } from '../lib/types'
import { Step, StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Image from 'next/image'
import { Button } from './ui/button'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Fuse from 'fuse.js'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import { cn } from '../lib/utils'

export default function Flow({ data }: { data: Repository[] }) {
  const { data: session } = useSession()
  const [repo, setRepo] = React.useState<Repository>()
  const [query, setQuery] = React.useState('')

  const fuse = new Fuse(data, {
    keys: ['name']
  })

  const filterData = query ? fuse.search(query).map(o => o.item) : data

  return (
    <Step>
      <StepItem>
        <StepNumber />
        <StepTitle>Login with Github</StepTitle>
        <StepContent>
          <div className="flex items-center p-4 bg-zinc-50 rounded-md border border-zinc-200 shadow-sm">
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
                  <svg
                    height="20"
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    version="1.1"
                    fill="currentColor"
                    className="mr-2"
                  >
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                  </svg>
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </StepContent>
      </StepItem>

      <StepItem>
        <StepNumber />
        <StepTitle>Select a repository</StepTitle>
        {session && (
          <StepContent>
            <Input
              placeholder="Search..."
              onChange={e => setQuery(e.target.value)}
            />
            <ScrollArea
              className={cn(
                'h-[280px] mt-4 bg-zinc-50 shadow-sm',
                'p-2 rounded-md border border-zinc-200 dark:border-zinc-800'
              )}
            >
              <Table className="text-left">
                <TableBody>
                  {filterData.map(repo => (
                    <TableRow key={repo.id}>
                      <TableCell className="font-medium py-2">
                        {repo.name}
                      </TableCell>
                      <TableCell className="text-right py-2">
                        <Button size="sm" className="">
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </StepContent>
        )}
      </StepItem>

      <StepItem>
        <StepNumber />
        <StepTitle>Fixing grammatical errors in your md/mdx files</StepTitle>
        {session && <StepContent>test</StepContent>}
      </StepItem>
    </Step>
  )
}
