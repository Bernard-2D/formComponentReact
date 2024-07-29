import { formatBytes } from '@/utils/byte'
import { cn } from '@/utils/css'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import * as React from 'react'
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone'
import { toast } from 'sonner'

export interface UploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[]

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept']

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize']

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps['maxFiles']

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean
}

export interface UploadUIProps {
  allowHide?: boolean
  direction?: 'row' | 'column'
  areaRender: (props: UploaderProps) => React.ReactNode
  fileRender: (props: { files?: File[]; onRemove: (index: number) => void }) => React.ReactNode
}

function Uploader(props: UploaderProps & UploadUIProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    // progresses,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    direction = 'column',
    allowHide = false,
    className,
    areaRender,
    fileRender,
    ...dropzoneProps
  } = props

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  })

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('不能同时上传两个文件')
        return
      }

      const newFiles = acceptedFiles

      const updatedFiles = (files ? [...newFiles, ...files] : newFiles).slice(0, maxFiles)

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`文件 ${file.name} 超过了${formatBytes(maxSize)}`)
        })
      }

      if (onUpload && updatedFiles.length > 0 && updatedFiles.length <= maxFiles) {
        const target = updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([])
            return `${target} uploaded`
          },
          error: `Failed to upload ${target}`
        })
      }
    },

    [files, maxFiles, multiple, maxSize, onUpload, setFiles]
  )

  function onRemove(index: number) {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onValueChange?.(newFiles)
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDisabled = disabled

  return (
    <div className={cn('relative flex gap-3 overflow-hidden', direction === 'column' && ' flex-col')}>
      {allowHide && (files?.length || 0 > maxFiles) ? null : (
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={maxFiles > 1 || multiple}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'border-muted-foreground/25 hover:bg-muted/25 group relative grid w-full shrink-0 cursor-pointer  rounded-lg border-2 border-dashed px-4 py-3.5 transition',
                'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isDragActive && 'border-primary',
                isDisabled && 'pointer-events-none opacity-60',
                className
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              {areaRender({ accept, maxSize, maxFiles })}
            </div>
          )}
        </Dropzone>
      )}
      {fileRender({ files, onRemove })}
    </div>
  )
}

export { Uploader }
