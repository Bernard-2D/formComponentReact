import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/css'
import { CheckIcon, ChevronDown, WandSparkles, XIcon } from 'lucide-react'
import * as React from 'react'

type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: Option[]
  onValueChange: (value: string[]) => void
  defaultValue?: string[]
  placeholder?: string
  animation?: number
  maxCount?: number
  asChild?: boolean
  className?: string
  showSearch?: boolean
  showFooter?: boolean
  itemType?: 'checkbox' | 'default'
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      defaultValue = [],
      placeholder = 'Select options',
      animation = 0,
      maxCount = 3,
      showSearch = false,
      showFooter = false,
      itemType = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [isAnimating, setIsAnimating] = React.useState(false)

    React.useEffect(() => {
      if (JSON.stringify(selectedValues) !== JSON.stringify(defaultValue)) {
        setSelectedValues(defaultValue)
      }
    }, [])

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true)
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues]
        newSelectedValues.pop()
        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      }
    }

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const handleClear = () => {
      setSelectedValues([])
      onValueChange([])
    }

    const handleTogglePopover = () => {
      setIsPopoverOpen(prev => !prev)
    }

    const itemRender = (option: Option, isSelected: boolean) => {
      if (itemType === 'checkbox') {
        return (
          <CommandItem
            key={option.value}
            onSelect={() => toggleOption(option.value)}
            style={{ pointerEvents: 'auto', opacity: 1 }}
            className="cursor-pointer"
          >
            <div
              className={cn(
                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
              )}
            >
              <CheckIcon className="h-4 w-4" />
            </div>
            {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
            <span>{option.label}</span>
          </CommandItem>
        )
      } else {
        return (
          <CommandItem
            key={option.value}
            onSelect={() => toggleOption(option.value)}
            style={{ pointerEvents: 'auto', opacity: 1 }}
            className={cn('cursor-pointer ', isSelected ? 'text-primary' : 'aria-selected:text-inherit')}
          >
            {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
            <span className="flex-1 truncate">{option.label}</span>
            <span className="flex h-3.5 w-3.5 items-center justify-center">
              {isSelected && <CheckIcon className="h-4 w-4" />}
            </span>
          </CommandItem>
        )
      }
    }

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex h-9 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit',
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex w-full items-center justify-between ">
                <div className="flex flex-wrap items-center gap-2 pl-2">
                  {selectedValues.slice(0, maxCount).map(value => {
                    const option = options.find(o => o.value === value)
                    const IconComponent = option?.icon
                    return (
                      <div
                        key={value}
                        className="flex items-center rounded-sm bg-minor-7 py-1 pl-3 text-xs text-foreground "
                      >
                        {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                        {option?.label}
                        <XIcon
                          className="mx-1.5 h-3.5 w-3.5 cursor-pointer"
                          onClick={event => {
                            event.stopPropagation()
                            toggleOption(value)
                          }}
                        />
                      </div>
                    )
                  })}
                  {selectedValues.length > maxCount && (
                    <div className="flex  items-center  rounded-sm bg-minor-7 px-3 py-1 text-xs text-foreground ">
                      {`+ ${selectedValues.length - maxCount} `}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="mx-2 h-4 cursor-pointer text-muted-foreground"
                    onClick={event => {
                      event.stopPropagation()
                      handleClear()
                    }}
                  />
                  <Separator orientation="vertical" className="flex h-full min-h-6" />
                  <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
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
          <Command>
            {showSearch && <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />}
            <CommandList>
              <CommandEmpty>没有选项</CommandEmpty>
              <CommandGroup>
                {options.map(option => {
                  const isSelected = selectedValues.includes(option.value)
                  return itemRender(option, isSelected)
                })}
              </CommandGroup>
              {showFooter && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <div className="flex items-center justify-between">
                      {selectedValues.length > 0 && (
                        <>
                          <CommandItem
                            onSelect={handleClear}
                            style={{ pointerEvents: 'auto', opacity: 1 }}
                            className="flex-1 cursor-pointer justify-center"
                          >
                            清除
                          </CommandItem>
                          <Separator orientation="vertical" className="flex h-full min-h-6" />
                        </>
                      )}
                      <CommandSeparator />
                      <CommandItem
                        onSelect={() => setIsPopoverOpen(false)}
                        style={{ pointerEvents: 'auto', opacity: 1 }}
                        className="flex-1 cursor-pointer justify-center"
                      >
                        关闭
                      </CommandItem>
                    </div>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              'my-2 h-3 w-3 cursor-pointer bg-background text-foreground',
              isAnimating ? '' : 'text-muted-foreground'
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    )
  }
)

export { MultiSelect }
