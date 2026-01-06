import toolsSymbolUrl from '/symbols/tools.svg?url'
import magnifierSymbolUrl from '/symbols/magnifier.svg'
import alertSymbolUrl from '/symbols/alert.svg'
import crossSymbolUrl from '/symbols/cross.svg'
import textBubblesUrl from '/symbols/textBubbles.svg'
import paintbrushUrl from '/symbols/paintbrush.svg'

interface SymbolProps {
  className?: string
}

export function ToolsSymbol({ className }: SymbolProps) {
  return (
    <img
      alt="tools symbol"
      src={toolsSymbolUrl}
      className={`${className}`}
    ></img>
  )
}
export function MagnifierSymbol({ className }: SymbolProps) {
  return (
    <img
      alt="magnifier symbol"
      src={magnifierSymbolUrl}
      className={`${className}`}
    ></img>
  )
}

export function AlertSymbol({ className }: SymbolProps) {
  return (
    <img
      alt="alert symbol"
      src={alertSymbolUrl}
      className={`${className}`}
    ></img>
  )
}
export function CrossSymbol({ className }: SymbolProps) {
  return (
    <img
      alt="cross symbol"
      src={crossSymbolUrl}
      className={`${className}`}
    ></img>
  )
}

export function TextBubbles({ className }: SymbolProps) {
  return (
    <img
      alt="text bubbles symbol"
      src={textBubblesUrl}
      className={`${className}`}
    ></img>
  )
}

export function PaintbrushSymbol({ className }: SymbolProps) {
  return (
    <img
      alt="paintbrush symbol"
      src={paintbrushUrl}
      className={`${className}`}
    ></img>
  )
}

export default {
  ToolsSymbol,
  MagnifierSymbol,
  AlertSymbol,
  CrossSymbol,
  TextBubbles,
  PaintbrushSymbol,
}
