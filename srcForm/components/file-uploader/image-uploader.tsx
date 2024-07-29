import { ImageData } from '@/api/sys'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUploadImage } from '@/hooks/api/sys'
import { cn } from '@/utils/css'
import { CloudUploadIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Spinner } from '../ui/spinner'
import { UploadUIProps, Uploader, UploaderProps } from './uploader'

function getFileKey(file: File) {
  return file.name + '_' + file.lastModified
}

type Prop = {
  defaultValue?: string[]
  onValueChange?: (images: ImageData[]) => unknown
}

function ImageUploader(props: Omit<UploaderProps, 'value' | 'onValueChange'> & Prop) {
  const [files, setFiles] = useState<File[]>([])
  const [fileMap, setFileMap] = useState<Record<string, ImageData>>({})
  const { defaultValue, onValueChange, ...rest } = props

  const uploadApi = useUploadImage()

  useEffect(() => {
    if (defaultValue && defaultValue[0]) {
      setFileMap({
        ...fileMap,
        ...defaultValue.reduce((tmp, d) => ({ ...tmp, [d + '_0']: { imageUrl: d, showUrl: d } }), {})
      })
      setFiles(defaultValue.map(d => new File([], d, { lastModified: 0 })))
    }
  }, [])

  useEffect(() => {
    if (onValueChange) {
      if (files) {
        if (files.find(d => !fileMap[getFileKey(d)])) {
          return
        }

        const datas = files.map(d => fileMap[getFileKey(d)])

        onValueChange(datas)
      } else {
        onValueChange([])
      }
    }
  }, [files, fileMap])

  const areaRender: UploadUIProps['areaRender'] = () => {
    return (
      <div className={cn('flex flex-col  items-center justify-center')}>
        <div className="pb-1.5">
          <CloudUploadIcon className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="text-xs font-medium">上传图片</div>
      </div>
    )
  }

  const fileRender: UploadUIProps['fileRender'] = ({ onRemove, files }) => {
    return files?.length ? (
      <ScrollArea className="h-fit w-full">
        <div className="max-h-48 items-center space-y-4">
          {files?.map((file, index) => (
            <div key={index} className={cn('relative', props.className)}>
              {fileMap[getFileKey(file)] ? (
                <img className="h-full w-full rounded-lg" src={fileMap[getFileKey(file)].showUrl} />
              ) : (
                <Spinner />
              )}

              <div className="absolute inset-0 flex items-center  justify-center gap-2 rounded-lg bg-black/40 opacity-0 hover:opacity-100">
                <Button type="button" variant="ghost" size="icon" className="size-7" onClick={() => onRemove(index)}>
                  <Trash2Icon className="size-4 " aria-hidden="true" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    ) : null
  }

  useEffect(() => {
    if (files) {
      files.forEach(file => {
        const key = getFileKey(file)
        if (!fileMap[key]) {
          uploadApi.mutateAsync(file).then(d => {
            setFileMap({
              ...fileMap,
              [key]: d.data
            })
          })
        }
      })
    }
  }, [files])

  return (
    <Uploader
      value={files}
      allowHide
      direction="row"
      accept={{ 'image/*': ['.svg', '.jpg', '.png'] }}
      areaRender={areaRender}
      fileRender={fileRender}
      onValueChange={setFiles}
      {...rest}
    />
  )
}

export { ImageUploader }
