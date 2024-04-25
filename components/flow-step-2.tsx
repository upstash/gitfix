import * as React from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Content from './content'
import IconGitHub from './icon-github'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import store from 'store'
import Fuse from 'fuse.js'

export interface FlowStep2Props {}

export default function FlowStep2({}: FlowStep2Props) {
  const { repos, setRepo, setQuery, repo, query } = store()

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
                Change Repo
              </Button>
            </Content>
          ) : (
            <DataTable />
          )}
        </StepContent>
      )}
    </StepItem>
  )
}

export interface DataTableProps {}

function DataTable({}: DataTableProps) {
  const { repos, setRepo, setQuery, query, user, fixRepo } = store()

  const fuse = new Fuse(repos, {
    keys: ['name'],
  })

  const filterData = query ? fuse.search(query).map((o) => o.item) : repos

  return (
    <>
      <Input
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
      />

      <Content
        asChild
        className="mt-4 h-[200px] w-full p-0 sm:h-[260px] sm:p-2"
      >
        <ScrollArea>
          <Table className="text-left">
            <TableBody>
              {filterData.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell className="py-2 font-medium">
                    {repo.name}
                  </TableCell>
                  <TableCell className="py-2 text-right">
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
