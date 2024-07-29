import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CellContext } from '@tanstack/react-table'

function EllipsisCell<TData, TValue>({ getValue, column }: CellContext<TData, TValue>) {
  const data = getValue<string>() || ''
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="truncate" style={{ width: `calc(${column.getSize()}px - 2rem)` }}>
            {data}
          </div>
        </TooltipTrigger>
        <TooltipContent isPortal>
          <p className="max-w-56">{data}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default EllipsisCell
