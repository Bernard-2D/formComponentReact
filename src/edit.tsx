/* eslint-disable no-constant-condition */
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { useForm } from 'react-hook-form'
import { cn } from './utils/css'
import { MenuType, Status } from './consts'
// import { TreeSelect } from './ui/tree/tree-select'

export default function Edit(){
  const form = useForm({
    defaultValues: undefined
  })
  function save() {
    console.log('保存');
    
  }
  return (
    <>
    <Form {...form}>
    <form className={cn('grid  grid-cols-2 gap-x-10 gap-y-5 pt-4')} onSubmit={form.handleSubmit(save)}>
      <FormField
        control={form.control}
        name="parentId"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel className="text-current">上级菜单</FormLabel>
            <FormControl>
              {/* <TreeSelect
                defaultValue={field.value ? [field.value] : []}
                data={menuDatas
                  .filter(d => d.permissionType != MenuType.button)
                  .map(d => ({
                    ...d,
                    id: d.id + '',
                    parentId: d.parentId + '',
                    name: d.permissionName
                  }))}
                onValueChange={v => field.onChange(v[0] || '')}
                placeholder="请选择上级菜单"
                className="h-9 text-sm"
                disabled={!!data?.id}
              /> */}
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="permissionName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
              菜单名称
            </FormLabel>
            <FormControl>
              <Input
                className="h-9 text-sm"
                placeholder="请输入菜单名称"
                value={field.value}
                onChange={e => field.onChange(e.target.value || undefined)}
              />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="permissionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-current">菜单类型</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex h-9 items-center space-x-2.5 text-sm"
              >
                {[
                  [MenuType.module, '目录'],
                  [MenuType.menu, '菜单'],
                  [MenuType.button, '按钮']
                ].map(([val, name]) => (
                  <FormItem key={val} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={val + ''} />
                    </FormControl>
                    <FormLabel className="font-normal">{name}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="routeUrl"
        render={({ field }) => (
          <FormItem className={true ? '' : 'hidden'}>
            <FormLabel className="text-current">请求地址</FormLabel>
            <FormControl>
              <Input
                className="h-9 text-sm"
                placeholder="请输入请求地址"
                value={field.value}
                onChange={e => field.onChange(e.target.value || undefined)}
              />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="interfaceIdentity"
        render={({ field }) => (
          <FormItem className={true ? '' : 'hidden'}>
            <FormLabel className="text-current">权限标识</FormLabel>
            <FormControl>
              <Input
                className="h-9 text-sm"
                placeholder="请输入权限标识"
                value={field.value}
                onChange={e => field.onChange(e.target.value || undefined)}
              />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sortNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-current	 after:ml-0.5 after:text-destructive after:content-['*']">
              显示排序
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                className="h-9 text-sm"
                placeholder="请输入显示排序"
                value={field.value}
                onChange={e => field.onChange(e.target.value || undefined)}
              />
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="icon"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-current">图标</FormLabel>
            <FormControl>
              {/* <IconSelect
                defaultValue={field.value}
                onValueChange={d => field.onChange(d)}
                placeholder="请选择图标"
              /> */}
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="showStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-current">菜单状态</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex h-9 items-center space-x-2.5 text-sm"
              >
                {[
                  [Status.enable, '显示'],
                  [Status.disable, '隐藏']
                ].map(([val, name]) => (
                  <FormItem key={val} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={val + ''} />
                    </FormControl>
                    <FormLabel className="font-normal">{name}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />

      <div className="col-start-1 space-x-2.5">
        {/* <Button type="button" variant="outline" className="h-9 text-sm" onClick={() => onClose()}>
          取消
        </Button> */}
        <Button type="submit" className="h-9 text-sm">
          提交
        </Button>
      </div>
    </form>
  </Form>
    </>
  )
}