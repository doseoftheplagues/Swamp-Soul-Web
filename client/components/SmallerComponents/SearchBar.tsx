import React from 'react'
import { MagnifierSymbol } from './SymbolSvgs'

interface SearchBarProps {
  searchTerm: string | undefined
  changeFunction: (e: React.ChangeEvent<HTMLInputElement>) => void
  submitFunction: (e: React.FormEvent) => void
}

function SearchBar({
  submitFunction,
  changeFunction,
  searchTerm,
}: SearchBarProps) {
  return (
    <div className="relative flex w-full flex-row rounded-md text-xs sm:text-sm">
      <form onSubmit={submitFunction} className="flex flex-row">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          type="text"
          name="search"
          id="search"
          value={searchTerm || ''}
          onChange={changeFunction}
          className="SearchInput relative top-0 z-0 rounded-l-md p-1 sm:min-w-60"
          placeholder="Search..."
        ></input>
        <button
          type="submit"
          className="flex cursor-pointer flex-row items-center rounded-r-sm bg-[#dad7c2] px-1 hover:bg-[#e2e0cf] active:bg-[#c1bd9a]"
        >
          <MagnifierSymbol className="h-5 px-1" />
          <p className="sr-only">Search</p>
        </button>
      </form>
    </div>
  )
}

export default SearchBar
