import PagRight from '@/assets/pag_right.svg'
import { cn } from '@/utils/css'
import Pagination from 'rc-pagination'
import { useState } from 'react'

type PagingProps = {
  pagination: {
    pageSize?: number
    total: number
    onPageChange: (current: number) => void
  }
  className?: string
}

const Paging = ({ pagination: { total, pageSize = 10, onPageChange }, className = '' }: PagingProps) => {
  const [page, setPage] = useState(1)

  const PageLength = Math.ceil(total / pageSize)
  const itemRender = (
    current: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode
  ) => {
    if (type === 'page') {
      return (
        <div
          className={cn(
            'flex h-9 w-9 cursor-pointer items-center justify-center border-b-2 border-slate-300 text-base text-[#959AA6]',
            current === page && 'border-primary text-primary'
          )}
        >
          {current}
        </div>
      )
    }
    if (type === 'prev') {
      return (
        <img
          className={cn(current !== 1 && 'opacity-60', 'mr-4 w-2 rotate-180 cursor-pointer hover:opacity-60')}
          src={PagRight}
          alt=""
        />
      )
    }
    if (type === 'next') {
      return (
        <img
          className={cn(current === PageLength && 'opacity-60', 'ml-4 w-2 cursor-pointer hover:opacity-60')}
          src={PagRight}
          alt=""
        />
      )
    }
    if (type === 'jump-prev') {
      return <div className="h-9 cursor-pointer border-b-2 border-slate-300 pt-0.5 text-[#959AA6]">...</div>
    }
    if (type === 'jump-next') {
      return <div className="h-9 cursor-pointer border-b-2 border-slate-300 pt-0.5 text-[#959AA6]">...</div>
    }
    return element
  }

  function onPage(current: number) {
    setPage(current)
    onPageChange(current)
  }

  return (
    <Pagination
      className={cn(className, 'flex items-center justify-center')}
      total={total}
      current={page}
      pageSize={pageSize}
      onChange={onPage}
      itemRender={itemRender}
    />
  )
}

export default Paging
