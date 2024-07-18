import FormRender, { useForm } from 'form-render'
import React from 'react';
import { Button } from 'antd';
// import { schemaTemplate } from "../simpleForm/schema";

const schema = {
  type: 'object',
  displayType: 'row',
  column: 3,
  properties: {
    input1: {
      title: '简单输入框',
      type: 'string',
      required: true,
    },
    input2: {
      title: 'Field B',
      type: 'string'
    },
    input3: {
      title: 'Field C',
      type: 'string'
    },
    input4: {
      title: 'Field D',
      type: 'string'
    },
    select1: {
      title: '单选',
      type: 'string',
      props: {
        options: [
          { label: '早', value: 'a' },
          { label: '中', value: 'b' },
          { label: '晚', value: 'c' }
        ]
      }
    }
  }
};

const XDemo = () => {
  const form = useForm();
  const handleSubmit = () => {
    console.log('form的值为', form.getValues());
  }
  const watch = {
    '#': (allValues:any, changedValues:any) => { // '#': () => {} 等同于 onValuesChange
      console.log('表单 allValues：', allValues);
      console.log('表单 changedValues：', changedValues);
    },
  }
  return (
    <div>
      <FormRender watch={watch} form={form} schema={schema} />
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default XDemo;