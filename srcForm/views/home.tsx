import useSystemStore from '@/store/system'

export default function Home() {
  const { systemInfo } = useSystemStore()

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <header className="text-7 font-bold">{systemInfo.systemName}</header>
      <div
        className="h-[550px] w-[550px] bg-cover p-2.5 text-center text-lg text-minor-1"
        style={{ backgroundImage: systemInfo.webLogo }}
      >
        {systemInfo.systemTitle}
      </div>
    </div>
  )
}
