import { UserData } from '@/api/user'
import { MultiSelect } from '@/components/multi-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAddUserRole, useGetRoleList, useGetUserDetail } from '@/hooks/api/user'
import { useEffect, useState } from 'react'

interface Props {
  onSaveClose: () => unknown
  onClose: () => unknown
  data: UserData
}

export function Role({ onClose, onSaveClose, data }: Props) {
  const [roleIds, setRoleIds] = useState<string[]>()
  const { data: roleList } = useGetRoleList()
  const { data: detailData } = useGetUserDetail({} as UserData, data.id)
  const addUserRole = useAddUserRole()

  useEffect(() => {
    if (!roleIds && detailData) {
      setRoleIds(detailData.userRoleIds?.map(d => d + ''))
    }
  }, [detailData])

  async function onSave() {
    await addUserRole.mutateAsync({
      userId: data.id,
      roles: roleIds?.map(d => +d) || []
    })
    onSaveClose()
  }

  return (
    <div className="grid  gap-y-5 pt-4">
      <div className="space-y-2">
        <Label>登陆账号</Label>
        <Input className="h-9 text-sm" disabled value={data.loginName!} />
      </div>
      <div className="space-y-2">
        <Label>分配角色</Label>
        {roleList && detailData && (
          <MultiSelect
            options={roleList.map(d => ({ label: d.roleName, value: d.id + '' }))}
            onValueChange={setRoleIds}
            defaultValue={detailData.userRoleIds?.map(d => d + '')}
            placeholder="请选择"
            maxCount={1}
          />
        )}
      </div>
      <div className="space-x-2.5">
        <Button type="button" variant="outline" className="h-9 text-sm" onClick={() => onClose()}>
          取消
        </Button>
        <Button type="button" className="h-9 text-sm" onClick={onSave}>
          提交
        </Button>
      </div>
    </div>
  )
}
