'use client'

import * as React from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import { cn } from 'lib/utils'
import Content from './content'
import IconGitHub from './icon-github'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import store from 'store/index'
import Fuse from 'fuse.js'

export default function FlowStep2() {
  const { query, repo, onReset, setQuery, repos, user, setRepo, fixRepo } =
    store()

  const fuse = new Fuse(repos, {
    keys: ['name']
  })

  const filterData = query ? fuse.search(query).map(o => o.item) : repos

  return (
    <StepItem>
      <StepNumber />
      <StepTitle>Select a repository</StepTitle>
      {repos.length > 0 && (
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
              <Button size="sm" variant="outline" onClick={onReset}>
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
  )
}
