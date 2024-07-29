import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/utils/css'
import { ChevronDown, XIcon, icons } from 'lucide-react'
import * as React from 'react'
import Icon from '../icon'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onValueChange: (value?: string) => void
  defaultValue?: string
  placeholder?: string
  className?: string
}

const effectIcons = Object.keys(icons).filter(
  d => !/(arrow)|(chevron)|(align)|(small)|(zoom)|(corner)|(dice)|(move)|(heading)/.test(d.toLowerCase())
)

const IconSelect = React.forwardRef<HTMLButtonElement, Props>(
  ({ defaultValue = '', onValueChange, placeholder = 'Select options', className, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

    function onSelectChange(event: React.MouseEvent<HTMLDivElement>) {
      const icon = (event.target as HTMLElement).closest('div')?.dataset.icon
      if (icon) {
        setSelectedValue(icon)
        onValueChange(icon)
        setIsPopoverOpen(false)
      }
    }

    return (
      <div className="group relative">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              onClick={() => setIsPopoverOpen(prev => !prev)}
              className={cn(
                'flex h-9 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit',
                className
              )}
              {...props}
            >
              {selectedValue ? (
                <div className="flex w-full items-center justify-between ">
                  <div className="flex flex-wrap items-center gap-2 pl-2">
                    <div className="text-foreground ">{selectedValue}</div>
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
            <ScrollArea className="h-52">
              <div className="grid grid-cols-[repeat(auto-fill,40px)]" onClick={onSelectChange}>
                {effectIcons.map(d => (
                  <div
                    key={d}
                    className={cn('cursor-pointer border p-1', selectedValue === d && 'text-primary')}
                    data-icon={d}
                  >
                    <Icon name={d} className="h-full w-full" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <div
          className="absolute right-4 top-2.5 h-4 w-4 cursor-pointer"
          onClick={() => {
            setSelectedValue(undefined)
            onValueChange()
          }}
        >
          <XIcon className={cn('absolute  h-full w-full opacity-0', selectedValue && 'group-hover:opacity-50')} />
        </div>
      </div>
    )
  }
)

export { IconSelect }
