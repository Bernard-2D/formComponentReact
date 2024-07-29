import { UserData } from '@/api/user'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useGetUserDetail } from '@/hooks/api/user'
import { Fragment } from 'react/jsx-runtime'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => unknown
  data: UserData
}

const rows: [keyof UserData, string][] = [
  ['loginName', '登录账号'],
  ['username', '用户姓名'],
  ['departmentName', '归属部门'],
  ['phone', '手机号码'],
  ['email', '邮箱'],
  ['userRoleNames', '角色'],
  ['userStatus', '用户状态'],
  ['remark', '备注'],
  ['createTime', '创建时间'],
  ['lastLoginTime', '最后登录']
]

export default function Detail({ open, onOpenChange, data }: Props) {
  const { data: detailData } = useGetUserDetail({} as UserData, data.id)

  return detailData ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-106">
        <DialogHeader>
          <DialogTitle>用户详情</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {rows.map(([key, name]) => (
            <Fragment key={key}>
              <div className=" text-minor-1">{name}</div>
              <div className="col-span-3">
                {key === 'userStatus' ? (
                  <div className="flex items-center">
                    <span
                      className={
                        ' rounded-sm  p-1 text-xs ' +
                        {
                          0: 'bg-success-1 text-success',
                          1: 'bg-error-1 text-error'
                        }[detailData[key]]
                      }
                    >
                      {{ 0: '正常', 1: '停用' }[detailData[key]]}
                    </span>
                  </div>
                ) : (
                  detailData[key]
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  ) : null
}
