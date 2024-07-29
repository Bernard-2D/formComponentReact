import { EditSys, ImageData, SysData } from '@/api/sys'
import { ImageUploader } from '@/components/file-uploader/image-uploader'
import { Tree } from '@/components/tree'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useAddSys, useEditSys, useGetDetail } from '@/hooks/api/sys'
import { cn } from '@/utils/css'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Preview, { SysInfo } from './preview'
interface Props {
  onSaveClose: () => unknown
  onClose: () => unknown
  data?: SysData
}

const imageKeys = ['webLogo', 'systemLogo', 'backgroundImageUrl'] as const

const formSchema = z.object({
  systemName: z
    .string({
      required_error: '用户名称不能为空'
    })
    .min(2, '系统名称不得少于2个字符')
    .max(26, '系统名称不得少于超过26个字符'),
  systemTitle: z
    .string({
      required_error: '系统标语不能为空'
    })
    .max(50, {
      message: '系统标语不得少于超过50个字符'
    }),
  webLogo: z.string({ required_error: '图片不能为空' }),
  systemLogo: z.string({ required_error: '图片不能为空' }),
  backgroundImageUrl: z.string({ required_error: '图片不能为空' })
})

function EditForm(props: Omit<Props, 'data'> & { initData: EditSys }) {
  const { initData, onClose, onSaveClose } = props
  const [expandAll, setExpandAll] = useState(false)
  const [open, setOpen] = useState(false)
  const [previewSys, setPreviewSys] = useState<SysInfo>()
  const addSystem = useAddSys()
  const editSystem = useEditSys()

  const formExtraRef = useRef<{
    permissionIds: number[]
    webLogo?: ImageData
    systemLogo?: ImageData
    backgroundImageUrl?: ImageData
  }>({
    permissionIds: initData.permissions!.filter(d => d.hasPermission).map(d => d.permissionId)
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initData
  })

  function onImageChange(key: 'webLogo' | 'backgroundImageUrl' | 'systemLogo', images: ImageData[]) {
    if (images.length) {
      formExtraRef.current[key] = images[0]
    } else {
      formExtraRef.current[key] = undefined
    }
  }

  function onPreview() {
    form.trigger(['systemName', 'systemTitle', ...imageKeys]).then(() => {
      if (form.formState.isValid) {
        setPreviewSys(form.getValues() as SysInfo)
        setOpen(true)
      }
    })
  }

  async function save(values: Partial<z.infer<typeof formSchema>>) {
    const data: EditSys = { ...values }

    const { permissionIds, webLogo, systemLogo, backgroundImageUrl } = formExtraRef.current

    data.systemType = 2

    // 图片逻辑
    if (webLogo) {
      data.webLogo = webLogo.imageUrl
    }
    if (systemLogo) {
      data.systemLogo = systemLogo.imageUrl
    }
    if (backgroundImageUrl) {
      data.backgroundImageUrl = backgroundImageUrl.imageUrl
    }

    //菜单逻辑
    if (permissionIds) {
      data.permissionList = permissionIds
    }

    if (initData.id) {
      imageKeys.forEach(key => {
        if (data[key] === initData[key]) {
          delete data[key]
        }
      })
      await editSystem.mutateAsync({ ...data, id: initData.id })
    } else {
      await addSystem.mutateAsync(data)
    }

    onSaveClose()
  }

  return (
    <>
      <Form {...form}>
        <form
          className={cn('grid  grid-cols-2 gap-x-10 gap-y-5 overflow-auto pt-4')}
          onSubmit={form.handleSubmit(save)}
        >
          <FormField
            control={form.control}
            name="systemName"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  系统名称
                </FormLabel>
                <FormDescription>2-26字符，将显示在登录/注册/忘记密码页面的系统左上角、监控大屏等位置</FormDescription>
                <FormControl>
                  <Input className="h-9 text-sm" placeholder="请输入系统名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="systemTitle"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  系统标语
                </FormLabel>
                <FormDescription>0-50字符，将显示在登录页面</FormDescription>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="请输入系统标语"
                    value={field.value}
                    onChange={e => field.onChange(e.target.value || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="systemLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  系统LOGO
                </FormLabel>
                <FormDescription>支持32×32px的.svg.jpg.png等图片格式</FormDescription>
                <FormControl>
                  <ImageUploader
                    className="h-25 w-25"
                    defaultValue={[initData.systemLogo || '']}
                    onValueChange={d => {
                      onImageChange('systemLogo', d)
                      field.onChange(d[0]?.showUrl)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="webLogo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  系统主图
                </FormLabel>
                <FormDescription>支持550×550px的.svg.jpg.png等图片格式</FormDescription>
                <FormControl>
                  <ImageUploader
                    className="h-25 w-25"
                    defaultValue={[initData.webLogo || '']}
                    onValueChange={d => {
                      onImageChange('webLogo', d)
                      field.onChange(d[0]?.showUrl)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
                  登录页背景图
                </FormLabel>
                <FormDescription>支持1920×1080px的.svg.jpg.png等图片格式</FormDescription>
                <FormControl>
                  <ImageUploader
                    className="h-25"
                    defaultValue={[initData.backgroundImageUrl || '']}
                    onValueChange={d => {
                      onImageChange('backgroundImageUrl', d)
                      field.onChange(d[0]?.showUrl)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="permissionList"
            render={() => (
              <FormItem className="col-span-2">
                <FormLabel className="text-current">
                  配置菜单
                  <Button type="button" variant="link" onClick={() => setExpandAll(!expandAll)}>
                    展开/折叠
                  </Button>
                </FormLabel>
                <FormControl>
                  <Tree
                    initialSlelectedItemIds={initData
                      .permissions!.filter(d => d.hasPermission)
                      .map(d => d.permissionId + '')}
                    onSelectChange={d => (formExtraRef.current.permissionIds = d.map(dd => +dd))}
                    multiple
                    data={
                      initData.permissions?.map(d => ({
                        ...d,
                        id: d.permissionId + '',
                        parentId: d.parentId + '',
                        name: d.permissionName
                      })) || []
                    }
                    expandAll={expandAll}
                    className="h-80 overflow-auto rounded-md border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-x-2.5">
            <Button type="button" variant="outline" className="h-9 text-sm" onClick={() => onClose()}>
              取消
            </Button>
            <Button type="button" className="h-9 text-sm" onClick={onPreview}>
              预览
            </Button>
            <Button type="submit" className="h-9 text-sm">
              提交
            </Button>
          </div>
        </form>
      </Form>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogContent className="p-0 sm:max-w-[1225px]" hideClose>
          {previewSys && <Preview sysData={previewSys} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function Edit(props: Props) {
  const { data, ...rest } = props

  const { data: initData } = useGetDetail(data?.id)

  return initData ? <EditForm initData={initData} {...rest} /> : <Spinner />
}
