export function arrayToTree<T extends { id: string | number; parentId: string | number; children?: T[] }>(
  list: T[],
  root = 0
) {
  const result: T[] = []
  const map: Record<string | number, T> = {}

  list.forEach(item => (map[item.id] = { ...item }))

  list.forEach(item => {
    const { id, parentId } = item
    if (item.parentId == root) {
      result.push(map[id])
    } else {
      if (map[parentId]) {
        if (map[parentId].children) {
          map[parentId].children!.push(map[id])
        } else {
          map[parentId].children = [map[id]]
        }
      }
    }
  })

  return result
}

export function treeToArray<T extends { id: string | number; children?: T[] }>(tree: T[]) {
  const result: T[] = []
  const queue = [...tree]
  while (queue.length) {
    const item = queue.shift()
    if (item) {
      const children = item.children
      if (children) {
        queue.push(...children)
      }
      result.push(item)
    }
  }
  return result
}

export function treeToMap<T extends { id: string | number; children?: T[] }>(tree: T[]) {
  const result: Record<string | number, T> = {}
  const queue = [...tree]
  while (queue.length) {
    const item = queue.shift()
    if (item) {
      const children = item.children
      if (children) {
        queue.push(...children)
      }
      result[item.id] = item
    }
  }
  return result
}
