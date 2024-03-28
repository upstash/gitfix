import * as React from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Content from './content'
import IconGitHub from './icon-github'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import { StoreState } from '../store'
import Fuse from 'fuse.js'

export interface FlowStep2Props
  extends Pick<
    StoreState,
    'query' | 'repo' | 'setQuery' | 'repos' | 'user' | 'fixRepo' | 'setRepo'
  > {}

export default function FlowStep2({
  query,
  repo,
  setQuery,
  repos,
  user,
  setRepo,
  fixRepo
}: FlowStep2Props) {
  const fuse = new Fuse(repos, {
    keys: ['name']
  })

  const filterData = query ? fuse.search(query).map(o => o.item) : repos

  const onResetRepo = React.useCallback(() => {
    setRepo(undefined)
    setQuery('')
  }, [repo, query])

  return (
    <StepItem>
      <StepNumber />
      <StepTitle>Select a repository</StepTitle>
      {repos.length > 0 && (
        <StepContent>
          {repo ? (
            <Content>
              <div className="flex items-center gap-2">
                <IconGitHub height={32} />
                <a
                  className="font-medium underline decoration-zinc-500/50"
                  href={repo.html_url}
                  target="_blank"
                >
                  {repo.html_url.replace('https://', '')}
                </a>
              </div>
              <Button
                className="sm:ml-auto"
                size="sm"
                variant="outline"
                onClick={onResetRepo}
              >
                Change Repository
              </Button>
            </Content>
          ) : (
            <DataTable
              query={query}
              setQuery={setQuery}
              repos={repos}
              user={user}
              setRepo={setRepo}
              fixRepo={fixRepo}
            />
          )}
        </StepContent>
      )}
    </StepItem>
  )
}

export interface DataTableProps extends Omit<FlowStep2Props, 'repo'> {}

function DataTable({
  query,
  setQuery,
  repos,
  user,
  setRepo,
  fixRepo
}: DataTableProps) {
  const fuse = new Fuse(repos, {
    keys: ['name']
  })

  const filterData = query ? fuse.search(query).map(o => o.item) : repos

  return (
    <>
      <Input placeholder="Search..." onChange={e => setQuery(e.target.value)} />

      <Content
        asChild
        className="mt-4 h-[200px] sm:h-[260px] p-0 sm:p-2 w-full"
      >
        <ScrollArea>
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
  )
}
