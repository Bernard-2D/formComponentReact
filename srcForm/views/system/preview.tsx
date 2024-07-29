import topImage from '@/assets/标题栏.png'
import { systemInfo } from '@/config'
import LoginPage from '../login/page'

export type SysInfo = typeof systemInfo

export default function Preview({ sysData }: { sysData: SysInfo }) {
  return (
    <div>
      <div className="relative h-[87px] text-xs" style={{ backgroundImage: `url(${topImage})` }}>
        <div className="absolute left-[46px] top-[7px] flex h-[26px] w-[220px] items-center bg-white leading-[26px]">
          <div
            style={{ backgroundImage: `url(${sysData.systemLogo})` }}
            className="mr-2.5 h-[16px] w-[16px] bg-contain"
          />
          {sysData.systemName}
        </div>
        <div className="absolute left-[158px]   top-[49px] h-[26px] w-[720px] bg-[#eceff7] leading-[26px]">
          {`${location.origin}/login?system=子系统标识`}
        </div>
      </div>
      <div className="h-[720px]">
        <LoginPage systemInfo={sysData} onLogin={() => {}} />
      </div>
    </div>
  )
}
