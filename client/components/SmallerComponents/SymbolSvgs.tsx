import toolsSymbolUrl from '/public/symbols/tools.svg?url'
import magnifierSymbolUrl from '/public/symbols/magnifier.svg'
import alertSymbolUrl from '/public/symbols/alert.svg'

interface ToolsSymbolProps {
  className?: string
}

export function ToolsSymbol({ className }: ToolsSymbolProps) {
  return (
    <img
      alt="tools symbol"
      src={toolsSymbolUrl}
      className={`${className}`}
    ></img>
  )
}
export function MagnifierSymbol({ className }: ToolsSymbolProps) {
  return (
    <img
      alt="magnifier symbol"
      src={magnifierSymbolUrl}
      className={`${className}`}
    ></img>
  )
}

export function AlertSymbol({ className }: ToolsSymbolProps) {
  return (
    <img
      alt="alert symbol"
      src={alertSymbolUrl}
      className={`${className}`}
    ></img>
  )
}

export default { ToolsSymbol, MagnifierSymbol, AlertSymbol }
