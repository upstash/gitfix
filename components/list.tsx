'use client'

import React from 'react'
import { Repository } from '../lib/types'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from './ui/table'
import { Button } from './ui/button'
import Fuse from 'fuse.js'

const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.4,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ['name']
}

export default function List({ data }: { data: Repository[] }) {
  const [query, setQuery] = React.useState('')

  const fuse = new Fuse(data, fuseOptions)

  const filterData = query ? fuse.search(query).map(o => o.item) : data

  return (
    <div>
      <Input placeholder="Search..." onChange={e => setQuery(e.target.value)} />

      <ScrollArea
        className="h-[280px] mt-4 bg-zinc-50 shadow-sm
        p-1 rounded-md border border-zinc-200 dark:border-zinc-800"
      >
        <Table className="text-left">
          <TableBody>
            {filterData.map(repo => (
              <TableRow key={repo.id}>
                <TableCell className="font-medium py-2">{repo.name}</TableCell>
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
    </div>
  )
}
