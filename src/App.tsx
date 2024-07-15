// import { useState } from 'react'
import { useSimpleForm } from '@simpleForm/form'
import { schemaTemplate } from './simpleForm/schema'
import FormRender from './simpleForm/myFormRender'
// import { Button } from 'antd'
import './App.css'

function App() {
  const simpleForm = useSimpleForm()
  // const [formRes, setFormRes] = useState<any>({})

  // const onSubmit = async (e: any) => {
  //   e?.preventDefault?.()
  //   const result = await simpleForm.validate()
  //   console.log('表单结果', result)
  //   setFormRes(result)
  // }

  return (
    <>
      <FormRender form={simpleForm} schema={schemaTemplate} />
      {/* <Button onClick={onSubmit} type="primary">
        提交表单
      </Button> */}
    </>
  )
}

export default App
