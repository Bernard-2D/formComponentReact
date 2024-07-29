import { FileUploader } from '@/components/file-uploader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DockIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Prop {
  title?: string
  template: string
  onOk: (file: File, close: () => void) => void
  onTemplate: () => void
}

function ImportDialog(props: React.PropsWithChildren<Prop>) {
  const { title = '导入', onOk, template, onTemplate, children } = props
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  function onImport() {
    if (files.length === 0) {
      toast.warning('请选择需要导入的文件！')
    } else {
      onOk(files[0], () => setOpen(false))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="gap-5 sm:max-w-106">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <FileUploader
              accept={{ 'application/vnd.ms-excel': ['.xls', '.xlsx'] }}
              maxFiles={1}
              maxSize={4 * 1024 * 1024}
              onValueChange={setFiles}
            />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <DockIcon className="color-020817" size={18} />
          <span className="ml-2 text-black">{template} </span>
          <Button variant="ghost" className="ml-auto flex h-8 min-w-8 p-0 text-primary" onClick={onTemplate}>
            下载模板
          </Button>
        </div>
        <DialogFooter className="space-x-4 sm:space-x-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button type="submit" onClick={onImport}>
            导入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ImportDialog }
