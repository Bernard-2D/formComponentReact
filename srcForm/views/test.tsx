import { TreeSelect } from '@/components/tree/tree-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const treeData = [
  { id: '1', parentId: '0', name: '一级1' },
  { id: '2', parentId: '0', name: '一级2' },
  { id: '3', parentId: '0', name: '一级3' },
  { id: '4', parentId: '1', name: '二级1-1' },
  { id: '5', parentId: '1', name: '二级1-2' },
  { id: '6', parentId: '2', name: '二级2-1' },
  { id: '7', parentId: '3', name: '二级3-1' },
  { id: '8', parentId: '3', name: '二级3-2' },
  { id: '9', parentId: '4', name: '二级3-3' }
]

export default function Test() {
  return (
    <>
      <div className="p-10">
        <TreeSelect data={treeData} defaultValue={[]} onValueChange={console.log} placeholder="请选择" />
      </div>
      <div className="p-10">
        <Select key={+new Date()} onValueChange={console.log}>
          <SelectTrigger className="h-9 w-60 text-sm">
            <SelectValue placeholder="用户状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">正常</SelectItem>
            <SelectItem value="1">停用</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
