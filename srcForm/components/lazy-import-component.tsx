import React from 'react'

export default function LazyImportComponent(props: { lazyChildren: React.ComponentType }) {
  return (
    <React.Suspense fallback={<div>页面正在加载......</div>}>
      <props.lazyChildren />
    </React.Suspense>
  )
}
