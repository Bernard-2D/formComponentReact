import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

interface ConfirmState {
  open: boolean
  isOk: boolean
  title: string
  message: string
  onOk: () => void
  onClose: () => void
}

const useConfirmStore = create<ConfirmState>()(
  subscribeWithSelector(set => ({
    open: false,
    isOk: false,
    title: '操作确认',
    message: '',
    onClose: () => set({ open: false }),
    onOk: () => set({ isOk: true })
  }))
)

export function confirm(options: { message: string; title?: string; onOk: (close: ConfirmState['onClose']) => void }) {
  const { message, title = useConfirmStore.getInitialState().title, onOk } = options

  useConfirmStore.setState({
    isOk: false,
    open: true,
    message,
    title
  })

  const subscribe = useConfirmStore.subscribe(
    state => [state.isOk, state.open],
    ([isOk]) => {
      if (isOk) {
        onOk(useConfirmStore.getState().onClose)
      }
      subscribe()
    }
  )
}

export default useConfirmStore
