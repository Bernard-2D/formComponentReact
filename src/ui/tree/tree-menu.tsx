import { MenuData } from '@/api/menu'
import { cn } from '@/utils/css'
import { arrayToTree, treeToMap } from '@/utils/tree'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import Icon from '../icon'

interface TreeDataItem extends MenuData {
  children?: TreeDataItem[]
}

type TreeMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  data: MenuData[]
  currentUrl: string
  defaultUrl: string
  onMenuClick: (menu: MenuData) => void
}

type TreeContextValue = {
  dirState: Record<string, string[]>
  setDirState: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
} & Pick<TreeMenuProps, 'currentUrl' | 'onMenuClick'>

const TreeContext = React.createContext<TreeContextValue>({} as TreeContextValue)

const TreeMenu = React.forwardRef<HTMLDivElement, TreeMenuProps>(
  ({ data, className, currentUrl, onMenuClick, defaultUrl, ...props }, ref) => {
    const [dirState, setDirState] = React.useState<Record<string, string[]>>({})
    const treeData = arrayToTree<TreeDataItem>(data)

    useEffect(() => {
      if (defaultUrl) {
        const dirStates: Record<string, string[]> = {}
        const treeMap = treeToMap(treeData)

        const treeItem = data.find(d => d.routeUrl === defaultUrl)
        let parent = treeItem
        while (parent) {
          dirStates[parent.id] = [parent.id + '']
          parent = treeMap[parent.parentId]
        }

        setDirState(dirStates)
      }
    }, [])

    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          <TreeContext.Provider value={{ dirState, setDirState, currentUrl, onMenuClick }}>
            <TreeItem data={treeData} />
          </TreeContext.Provider>
        </ul>
      </div>
    )
  }
)

type TreeItemProps = {
  data: TreeDataItem | TreeDataItem[]
  indentLevel?: number
}

const TreeItem = ({ data, indentLevel = 0 }: TreeItemProps) => {
  const { dirState, setDirState, currentUrl, onMenuClick } = useContext(TreeContext)

  function renderDir(item: TreeDataItem) {
    return (
      <ItemContainer indentLevel={indentLevel}>
        <AccordionPrimitive.Trigger
          className={cn(
            'flex flex-1 items-center justify-between py-1.5 text-black transition-all last:[&[data-state=open]>svg]:rotate-180'
          )}
          asChild
        >
          <div>
            <Item item={item} />
            <ChevronDownIcon
              className={cn(
                'text-accent-foreground/50	 size-3.5 shrink-0  scale-y-75 transition-transform duration-200',
                'mr-1'
              )}
            />
          </div>
        </AccordionPrimitive.Trigger>
      </ItemContainer>
    )
  }

  function renderLeaf(item: TreeDataItem) {
    return (
      <ItemContainer
        indentLevel={indentLevel}
        onClick={() => onMenuClick(item)}
        isSelected={currentUrl === item.routeUrl}
      >
        <Item item={item} isLeaf className="flex-1" />
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
              <AccordionPrimitive.Item value={item.id + ''}>
                <AccordionPrimitive.Header asChild>{renderDir(item)}</AccordionPrimitive.Header>
                <AccordionContent>
                  <TreeItem data={item.children ? item.children : item} indentLevel={indentLevel + 1} />
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
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  item: TreeDataItem
  isLeaf?: boolean
}) => {
  return (
    <div className={cn('flex items-center  justify-between overflow-hidden pl-1', className)} {...props}>
      {item.icon ? <Icon name={item.icon} size={18} className="mr-1" /> : ''}
      <span className="flex-grow truncate ">{item.permissionName}</span>
    </div>
  )
}

const ItemContainer = ({
  indentLevel,
  children,
  className,
  isSelected = false,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement> & { indentLevel: number; isSelected?: boolean }>) => {
  return (
    <li
      className={cn(
        ' flex h-11 w-full cursor-pointer items-center rounded-lg  ',
        isSelected ? 'bg-main-1 text-primary' : 'hover:bg-minor-6  ',
        className
      )}
      style={{ paddingLeft: `${16 * (indentLevel + 1)}px` }}
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

export { TreeMenu, type TreeMenuProps }
