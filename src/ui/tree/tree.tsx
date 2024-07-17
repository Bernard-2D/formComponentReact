import { cn } from '@/utils/css'
import { arrayToTree, treeToMap } from '@/utils/tree'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { CheckIcon, MinusIcon, TriangleIcon } from 'lucide-react'
import React, { useEffect } from 'react'

interface ListDateItem {
  id: string
  parentId: string
  name: string
}

const CheckboxState = {
  UNCHECKED: false,
  CHECKED: true,
  INDETERMINATE: 'indeterminate'
} as const

type CheckboxStateValue = (typeof CheckboxState)[keyof typeof CheckboxState]

interface TreeDataItem extends ListDateItem {
  children?: TreeDataItem[]
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: ListDateItem[]
  initialSlelectedItemIds?: string[]
  onSelectChange?: (itemIds: string[]) => void
  expandAll?: boolean
  /**
   * 是否支持多选
   */
  multiple?: boolean

  /**
   * 是否支持中间节点选择
   */
  dirCheck?: boolean
}

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSlelectedItemIds,
      onSelectChange,
      expandAll,
      className,
      multiple = false,
      dirCheck = false,
      ...props
    },
    ref
  ) => {
    const [selectedItemIds, setSelectedItemIds] = React.useState<Record<string, CheckboxStateValue>>(
      initialSlelectedItemIds
        ? initialSlelectedItemIds.reduce((tmp, d) => ({ ...tmp, [d]: CheckboxState.CHECKED }), {})
        : {}
    )

    const [dirState, setDirState] = React.useState<Record<string, string[]>>({})
    const treeData = arrayToTree<TreeDataItem>(data)
    const treeMap = treeToMap(treeData)

    const handleSelectChange = (item: TreeDataItem | undefined) => {
      const state = selectedItemIds[item!.id]
      if (multiple) {
        //多选下 要处理一下逻辑
        const newItemState: CheckboxStateValue =
          state === CheckboxState.CHECKED ? CheckboxState.UNCHECKED : CheckboxState.CHECKED
        const newState = {
          ...selectedItemIds,
          [item!.id]: newItemState
        }
        if (!dirCheck) {
          const treeItem = treeMap[item!.id]

          //改变子
          if (treeItem.children) {
            const queue = [...treeItem.children]
            while (queue.length) {
              const item = queue.shift()
              if (item) {
                const children = item.children
                if (children) {
                  queue.push(...children)
                }
                newState[item.id] = newItemState
              }
            }
          }
          //改变父
          if (treeItem.parentId) {
            let parent = treeMap[treeItem.parentId]
            let parentState: CheckboxStateValue = newItemState
            while (parent) {
              if (parentState !== CheckboxState.INDETERMINATE) {
                const children = parent.children || []
                const list = children.filter(d => CheckboxState.CHECKED === newState[d.id])
                if (list.length === 0) {
                  parentState = CheckboxState.UNCHECKED
                } else if (list.length === children.length) {
                  parentState = CheckboxState.CHECKED
                } else {
                  parentState = CheckboxState.INDETERMINATE
                }
              }
              newState[parent.id] = parentState
              parent = treeMap[parent.parentId]
            }
          }
        }
        setSelectedItemIds(newState)

        onSelectChange &&
          onSelectChange(
            Object.entries(newState)
              .filter(([, value]) => value !== CheckboxState.UNCHECKED)
              .map(([key]) => key)
          )
      } else {
        if (state !== CheckboxState.CHECKED) {
          setSelectedItemIds({ [item!.id]: CheckboxState.CHECKED })

          if (onSelectChange) {
            onSelectChange([item!.id])
          }
        }
      }
    }

    useEffect(() => {
      if (initialSlelectedItemIds) {
        const dirStates: Record<string, string[]> = {}
        initialSlelectedItemIds.forEach(id => {
          const treeItem = treeMap[id]
          let parent = treeItem
          while (parent) {
            dirStates[parent.id] = [parent.id]
            parent = treeMap[parent.parentId]
          }
        })
        setDirState(dirStates)
      }
    }, [])

    useEffect(() => {
      if (expandAll === false) {
        setDirState({})
      } else if (expandAll === true) {
        setDirState(data.reduce((tmp, d) => ({ ...tmp, [d.parentId]: [d.parentId] }), {}))
      }
    }, [expandAll])

    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          <TreeItem
            data={treeData}
            selectedItemIds={selectedItemIds}
            handleSelectChange={handleSelectChange}
            dirState={dirState}
            setDirState={setDirState}
            dirCheck={dirCheck}
            multiple={multiple}
          />
        </ul>
      </div>
    )
  }
)

type TreeItemProps = Required<Pick<TreeProps, 'dirCheck' | 'multiple'>> & {
  data: TreeDataItem | TreeDataItem[]
  selectedItemIds: Record<string, CheckboxStateValue>
  handleSelectChange: (item: TreeDataItem | undefined) => void
  dirState: Record<string, string[]>
  setDirState: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  indentLevel?: number
}

const TreeItem = ({
  data,
  selectedItemIds,
  handleSelectChange,
  dirState,
  setDirState,
  dirCheck,
  multiple,
  indentLevel = 0
}: TreeItemProps) => {
  function renderDir(item: TreeDataItem) {
    const isAllowClick = multiple || dirCheck

    const triggerClass = cn(
      ' px-1  transition-all first:[&[data-state=open]>svg]:rotate-180',
      isAllowClick ? ' py-1.5' : 'flex w-full items-center'
    )

    const iconPart = () => (
      <TriangleIcon
        fill="currentcolor"
        strokeWidth={0}
        className={cn(
          'text-accent-foreground/50	 size-2 shrink-0 rotate-90 scale-y-75 transition-transform duration-200',
          isAllowClick ? 'mr-1' : 'mr-2'
        )}
      />
    )

    const mainPart = () => (
      <Item
        item={item}
        multiple={multiple}
        checkState={selectedItemIds[item.id]}
        {...(isAllowClick ? { className: 'flex-1', onClick: () => handleSelectChange(item) } : {})}
      />
    )

    return (
      <ItemContainer indentLevel={indentLevel} checkState={selectedItemIds[item.id]}>
        <AccordionPrimitive.Trigger className={triggerClass} asChild={isAllowClick}>
          {isAllowClick ? (
            <div>{iconPart()}</div>
          ) : (
            <>
              {iconPart()}
              {mainPart()}
            </>
          )}
        </AccordionPrimitive.Trigger>
        {isAllowClick && mainPart()}
      </ItemContainer>
    )
  }

  function renderLeaf(item: TreeDataItem) {
    return (
      <ItemContainer
        indentLevel={indentLevel}
        checkState={selectedItemIds[item.id]}
        onClick={() => {
          handleSelectChange(item)
        }}
      >
        <Item item={item} multiple={multiple} checkState={selectedItemIds[item.id]} className="pl-6" />
      </ItemContainer>
    )
  }

  return data instanceof Array
    ? data.map(item => (
        <React.Fragment key={item.id}>
          {item.children && item.children.length ? (
            <AccordionPrimitive.Root
              type="multiple"
              value={dirState[item.id]}
              onValueChange={v => setDirState({ ...dirState, [item.id]: v })}
            >
              <AccordionPrimitive.Item value={item.id}>
                <AccordionPrimitive.Header asChild>{renderDir(item)}</AccordionPrimitive.Header>
                <AccordionContent>
                  <TreeItem
                    data={item.children ? item.children : item}
                    selectedItemIds={selectedItemIds}
                    handleSelectChange={handleSelectChange}
                    dirState={dirState}
                    setDirState={setDirState}
                    dirCheck={dirCheck}
                    indentLevel={indentLevel + 1}
                    multiple={multiple}
                  />
                </AccordionContent>
              </AccordionPrimitive.Item>
            </AccordionPrimitive.Root>
          ) : (
            renderLeaf(item)
          )}
        </React.Fragment>
      ))
    : renderLeaf(data)
}

const Item = ({
  className,
  item,
  checkState,
  multiple,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  item: TreeDataItem
  checkState: CheckboxStateValue
  multiple: boolean
}) => {
  return (
    <div className={cn('flex items-center gap-2 overflow-hidden pl-1', className)} {...props}>
      {multiple && <CheckboxIcon checked={checkState} />}
      <span className="flex-grow truncate ">{item.name}</span>
    </div>
  )
}

const CheckboxIcon = ({ checked }: { checked: CheckboxStateValue }) => {
  const dataState = checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'

  return (
    <div
      data-state={dataState}
      className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground"
    >
      <span data-state={dataState} className="flex items-center justify-center text-current">
        {checked === 'indeterminate' && <MinusIcon className="h-3.5 w-3" />}
        {checked === true && <CheckIcon className="h-4 w-4" />}
      </span>
    </div>
  )
}

const ItemContainer = ({
  indentLevel,
  children,
  className,
  checkState,
  ...props
}: React.PropsWithChildren<
  React.HTMLAttributes<HTMLElement> & { indentLevel: number; checkState: CheckboxStateValue }
>) => {
  return (
    <li
      className={cn(
        ' flex cursor-pointer items-center px-2  py-2  text-sm',
        ([CheckboxState.CHECKED, CheckboxState.INDETERMINATE] as CheckboxStateValue[]).includes(checkState)
          ? ' rounded-md bg-main-1 text-primary'
          : 'hover:bg-minor-6',
        className
      )}
      style={{ paddingLeft: `${20 * indentLevel}px` }}
      {...props}
    >
      {children}
    </li>
  )
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="pb-0 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Tree, type ListDateItem, type TreeProps }
