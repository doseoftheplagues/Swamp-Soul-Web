import React from 'react'

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
    <div className="ml-1 flex w-fit flex-row rounded-md border-2 border-black text-sm">
      <form onSubmit={submitFunction}>
        <input
          type="text"
          value={searchTerm || ''}
          onChange={changeFunction}
          className="SearchInput rounded-bl-sm p-1"
          placeholder="Search..."
        ></input>
        <button type="submit" className="SearchButton rounded-r-sm p-1">
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
