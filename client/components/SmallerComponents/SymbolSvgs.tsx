import toolsSymbolUrl from '/public/symbols/tools.svg?url'

interface ToolsSymbolProps {
  className?: string;
}

export function ToolsSymbol({ className }: ToolsSymbolProps) {
  return (
    <img
      alt="tools symbol"
      src={toolsSymbolUrl}
      className={className}
    ></img>
  )
}

export default { ToolsSymbol }
