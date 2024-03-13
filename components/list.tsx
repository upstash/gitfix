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
      <Input
        placeholder="Search repository..."
        onChange={e => setQuery(e.target.value)}
      />

      <ScrollArea
        type="always"
        className="
        mt-4
        p-2 rounded-xl border border-zinc-100 dark:border-zinc-800"
      >
        <Table className="text-left">
          <TableBody>
            {filterData.map(repo => (
              <TableRow key={repo.id} className="dark:border-b-zinc-800">
                <TableCell className="font-medium">{repo.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="secondary" size="sm" className="h-6">
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
