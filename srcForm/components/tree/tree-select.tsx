import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/css'
import { ChevronDown, XIcon } from 'lucide-react'
import * as React from 'react'
import { ListDateItem, Tree, TreeProps } from './tree'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: ListDateItem[]
  onValueChange: (value: string[]) => void
  defaultValue?: string[]
  placeholder?: string
  className?: string
}

const TreeSelect = React.forwardRef<HTMLButtonElement, Props & Pick<TreeProps, 'expandAll' | 'multiple' | 'dirCheck'>>(
  (
    {
      data,
      defaultValue = [],
      onValueChange,
      placeholder = 'Select options',
      multiple = false,
      dirCheck = false,
      className,
      expandAll,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const dataMap: Record<string, ListDateItem> = data.reduce((temp, d) => ({ ...temp, [d.id]: d }), {})

    function onSelectChange(itemIds: string[]) {
      setSelectedValues(itemIds)
      onValueChange(itemIds)
      if (!multiple) {
        setIsPopoverOpen(false)
      }
    }

    return (
      <div className="group relative">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              className={cn(
                'flex h-9 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit',
                className
              )}
              {...props}
            >
              {selectedValues.length > 0 ? (
                <div className="flex w-full items-center justify-between ">
                  <div className="flex flex-wrap items-center gap-2 pl-2">
                    <div className="text-foreground ">{dataMap[selectedValues[0]]?.name || ''}</div>
                  </div>
                </div>
              ) : (
                <div className="mx-auto flex w-full items-center justify-between">
                  <span className="mx-3 text-sm text-muted-foreground">{placeholder}</span>
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                </div>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-pop p-0" align="start" onEscapeKeyDown={() => setIsPopoverOpen(false)}>
            <ScrollArea className="">
              <Tree
                data={data}
                multiple={multiple}
                dirCheck={dirCheck}
                initialSlelectedItemIds={selectedValues}
                onSelectChange={onSelectChange}
                expandAll={expandAll}
              />
            </ScrollArea>
          </PopoverContent>
        </Popover>
        {!multiple && (
          <div
            className="absolute right-4 top-2.5 h-4 w-4 cursor-pointer"
            onClick={() => {
              onSelectChange([])
            }}
          >
            <XIcon
              className={cn('absolute  h-full w-full opacity-0', selectedValues.length && 'group-hover:opacity-50')}
            />
          </div>
        )}
      </div>
    )
  }
)

export { TreeSelect }
