import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CloudUploadIcon, FileTextIcon, XIcon } from 'lucide-react'
import { UploadUIProps, Uploader, UploaderProps } from './uploader'

interface FileCardProps {
  file: File
  onRemove: () => void
  progress?: number
}

function FileCard({ file, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-1">
        <FileTextIcon />
        <div className="flex w-full flex-col gap-1">
          <div className="space-y-px">
            <p className="text-foreground/80 line-clamp-1 text-sm font-medium">{file.name}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" className="size-7" onClick={onRemove}>
          <XIcon className="size-4 " aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  )
}

function FileUploader(props: UploaderProps) {
  const areaRender: UploadUIProps['areaRender'] = ({ accept }) => {
    return (
      <div className="flex items-center ">
        <div className="p-3">
          <CloudUploadIcon className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="flex h-full flex-col justify-evenly">
          <p className="text-sm font-medium">点击上传或拖拽文件到这里</p>
          <p className="text-xs text-muted-foreground">支持扩展名：{Object.values(accept!).flat().join(' ')}</p>
        </div>
      </div>
    )
  }

  const fileRender: UploadUIProps['fileRender'] = ({ onRemove, files }) => {
    return files?.length ? (
      <ScrollArea className="h-fit w-full">
        <div className="max-h-48 items-center space-y-4">
          {files?.map((file, index) => <FileCard key={index} file={file} onRemove={() => onRemove(index)} />)}
        </div>
      </ScrollArea>
    ) : null
  }

  return <Uploader {...props} areaRender={areaRender} fileRender={fileRender} />
}

export { FileUploader }
