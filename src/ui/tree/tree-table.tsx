import { Button } from '@/components/ui/button'
import { cn } from '@/utils/css'
import { arrayToTree } from '@/utils/tree'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { TriangleIcon } from 'lucide-react'
import React, { useEffect } from 'react'

interface ListDateItem {
  id: string | number
  parentId: string | number
}

interface Action {
  name: string
  action: (row: ListDateItem) => void
}

interface Column {
  key: string
  title?: string
  size?: number
  cell?: (row: ListDateItem) => React.ReactNode
  actions?: Action[]
}

interface TreeDataItem extends ListDateItem {
  children?: TreeDataItem[]
}

type TreeTableProps = React.HTMLAttributes<HTMLDivElement> & {
  data: ListDateItem[]

  columns: Column[]

  expandAll?: boolean
}

const TreeTable = React.forwardRef<HTMLDivElement, TreeTableProps>(
  ({ data, expandAll, columns, className, ...props }, ref) => {
    const [dirState, setDirState] = React.useState<Record<string, string[]>>({})
    const treeData = arrayToTree<TreeDataItem>(data)
    // console.log('treeTable', data);
    // console.log('treeData', treeData);
    useEffect(() => {
      if (expandAll === false) {
        setDirState(data.reduce((tmp, d) => ({ ...tmp, [d.parentId]: [] }), {}))
      } else if (expandAll === true) {
        setDirState(data.reduce((tmp, d) => ({ ...tmp, [d.parentId]: [d.parentId + ''] }), {}))
      }
    }, [expandAll])

    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          <TreeItem data={treeData} dirState={dirState} setDirState={setDirState} columns={columns} />
        </ul>
      </div>
    )
  }
)

type TreeItemProps = Pick<TreeTableProps, 'columns'> & {
  data: TreeDataItem | TreeDataItem[]
  dirState: Record<string, string[]>
  setDirState: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  indentLevel?: number
}

const isRoot = (level: number) => level === 0

const TreeItem = ({ data, dirState, setDirState, columns, indentLevel = 0 }: TreeItemProps) => {
  const itemIsRoot = isRoot(indentLevel)

  function renderDir(item: TreeDataItem) {
    const [column, ...rest] = columns
    return (
      <ItemContainer indentLevel={indentLevel}>
        <AccordionPrimitive.Trigger
          className={cn(
            'flex flex-1 items-center px-1  py-1.5 text-black transition-all first:[&[data-state=open]>svg]:rotate-180'
          )}
          asChild
        >
          <div>
            <TriangleIcon
              fill="currentcolor"
              strokeWidth={0}
              className={cn(
                'text-accent-foreground/50	 size-2 shrink-0 rotate-90 scale-y-75 transition-transform duration-200',
                'mr-1'
              )}
            />
            <Column column={column} item={item} key={column.key} />
          </div>
        </AccordionPrimitive.Trigger>
        <Item item={item} columns={rest} />
      </ItemContainer>
    )
  }

  function renderLeaf(item: TreeDataItem) {
    return (
      <ItemContainer indentLevel={indentLevel} className={itemIsRoot ? 'mb-5 ' : ''}>
        <Item item={item} columns={columns} isLeaf className="flex-1 pl-6" />
      </ItemContainer>
    )
  }

  return data instanceof Array
    ? data.map(item => (
        <React.Fragment key={item.id}>
          {item.children && item.children.length ? (
            <AccordionPrimitive.Root
              type="multiple"
              value={dirState[item.id + '']}
              onValueChange={v => setDirState({ ...dirState, [item.id + '']: v })}
            >
              <AccordionPrimitive.Item value={item.id + ''} className={itemIsRoot ? 'mb-5' : ''}>
                <AccordionPrimitive.Header asChild>{renderDir(item)}</AccordionPrimitive.Header>
                <AccordionContent className={cn(itemIsRoot ? 'mt-2 rounded-lg border border-b-0 border-minor-5' : '')}>
                  <TreeItem
                    data={item.children ? item.children : item}
                    dirState={dirState}
                    setDirState={setDirState}
                    indentLevel={indentLevel + 1}
                    columns={columns}
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

const Column = ({ column, item, className }: { column: Column; item: TreeDataItem; className?: string }) => {
  const { actions, cell } = column

  if (actions) {
    return (
      <div className="flex  space-x-1.5" style={{ width: column.size || 'auto' }}>
        {actions.map(d => (
          <Button key={d.name} variant="ghost" className="flex h-8 w-8 p-0 text-primary" onClick={() => d.action(item)}>
            {d.name}
          </Button>
        ))}
      </div>
    )
  } else if (cell) {
    return cell(item)
  }

  return (
    <div className={cn('flex space-x-2', className)} style={{ width: column.size || 'auto' }}>
      <div>{column.title || ''}</div>
      <div className="text-black">{item[column.key as keyof TreeDataItem] as string}</div>
    </div>
  )
}

const Item = ({
  className,
  item,
  columns,
  isLeaf = false,
  ...props
}: Pick<TreeTableProps, 'columns'> &
  React.HTMLAttributes<HTMLElement> & {
    item: TreeDataItem
    isLeaf?: boolean
  }) => {
  return (
    <div className={cn('flex items-center  justify-between overflow-hidden pl-1', className)} {...props}>
      {/* <span className="flex-grow truncate ">{item.name}</span> */}
      {columns.map((column, index) => (
        <Column
          column={column}
          item={item}
          key={column.key}
          className={index === 0 && isLeaf ? 'flex-1 text-black' : ''}
        />
      ))}
    </div>
  )
}

const ItemContainer = ({
  indentLevel,
  children,
  className,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement> & { indentLevel: number }>) => {
  return (
    <li
      className={cn(
        ' flex h-16 cursor-pointer items-center  px-2  py-2 text-sm text-minor-2',
        isRoot(indentLevel) ? ' rounded-lg bg-minor-7' : ' border-b border-b-minor-5',
        className
      )}
      style={{ paddingLeft: `${20 * (indentLevel + 1)}px` }}
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

export { TreeTable, type Column, type TreeTableProps }
