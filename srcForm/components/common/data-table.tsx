import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'

const HEAD_STYLE = 'text-sm text-light-500 font-normal mx-auto whitespace-nowrap'

export interface Column<T> {
  key: keyof T // T 的属性名
  name: string // 表头显示名称
  render?: (value: T[keyof T], item: T) => React.ReactNode
}
type WithId = {
  id: string | number
}

export default function DataTable<T extends WithId>({
  columns,
  table: { isLoading, data, selects, setSelects }
}: {
  columns: Column<T>[]
  table: {
    isLoading: boolean
    data: T[]
    selects: T[]
    setSelects: React.Dispatch<React.SetStateAction<T[]>>
  }
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(!isLoading)
  }, [isLoading])

  const isSelectAll = () => selects.length > 0 && selects.length === data.length
  const isSomeSelect = () => selects.length > 0 && selects.length < data.length
  const IsSelected = (item: T) => selects.some(it => it.id === item.id)

  function selectAll(isChecked: boolean | string) {
    if (isSomeSelect()) return setSelects([])
    setSelects(isChecked ? data : [])
  }
  function selectOne(isChecked: boolean | string, item: T) {
    setSelects(prevSelects => {
      if (isChecked) {
        return [...prevSelects, item] // 添加到数组
      } else {
        return prevSelects.filter(it => it.id !== item.id) // 从数组中移除
      }
    })
  }

  return (
    <>
      <Table isEmpty={data.length === 0 && loaded}>
        <TableHeader>
          <TableRow>
            <TableHead className={HEAD_STYLE}>
              <Checkbox
                disabled={data.length === 0}
                className=" border-[#CED4DA]"
                onCheckedChange={selectAll}
                checked={isSelectAll() || (isSomeSelect() && 'indeterminate')}
              />
            </TableHead>
            {columns.map(({ name }) => (
              <TableHead className={HEAD_STYLE} key={name}>
                {name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox
                  className={`box-content  border-[#CED4DA]`}
                  onCheckedChange={isChecked => selectOne(isChecked, item)}
                  checked={IsSelected(item)}
                />
              </TableCell>
              {columns.map(({ key, name, render }) => (
                <TableCell key={name} className={HEAD_STYLE}>
                  {((render ? render(item[key], item) : item[key]) as React.ReactNode) || '--'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Spinner className="mt-4" show={!loaded} />
    </>
  )
}
