export const schemaTemplate = [
  {
    name: "Input_arDyQ1",
    type: "Input",
    props: {
      placeholder: "请输入",
      maxLength: 30,
      size: "middle",
    },
    layout: "horizontal",
    panel: {
      icon: "text-field",
      label: "输入框",
    },
    rules: [
      {
        required: true,
        message: "姓名不能为空",
      },
    ],

    label: "用户名称",
    chosen: false,
    footer: "在这里输入用户名",
    suffix: "",
  },
  {
    name: "Input_9AvMRX",
    type: "Input", // InputNumber
    props: {
      placeholder: "请输入",
      maxLength: 30,
      size: "middle",
    },
    layout: "horizontal",
    panel: {
      icon: "text-field",
      label: "输入框",
    },
    rules: [
      {
        required: true,
        message: "手机号不能为空",
      },
      // {
      //   pattern: new RegExp('^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[^\\da-zA-Z\\s]).{8,50}$', ''),
      //   message: '手机号格式不正确'
      // }
    ],
    label: "手机号",
    chosen: false,
    colon: false,
  },
  {
    name: "Input_CJXKps",
    type: "Input", // Input.Password
    props: {
      placeholder: "请输入",
      maxLength: 30,
      size: "middle",
    },
    layout: "horizontal",
    panel: {
      icon: "text-field",
      label: "输入框",
    },
    label: "密码",
    chosen: false,
  },
  {
    name: "RadioGroup_oBBybi",
    props: {
      optionType: "default",
      size: "middle",
      options: [
        {
          label: "选项1",
          value: "1",
        },
        {
          label: "选项2",
          value: "2",
        },
        {
          label: "选项3",
          value: "3",
        },
      ],
    },
    layout: "horizontal",
    panel: {
      icon: "radio-field",
      label: "单选框",
    },
    label: "单选框",
    type: "Radio", // Radio.Group
    chosen: false,
  },
  {
    name: "CheckboxGroup_MUtLpr",
    layout: "horizontal",
    panel: {
      icon: "checkbox-field",
      label: "多选框",
    },
    label: "多选框",
    type: "Checkbox", // Checkbox.Group
    valueSetter: "{{(value)=> (value instanceof Array ? value : [])}}",
    props: {
      options: [
        {
          label: "多选1",
          value: "1",
        },
        {
          label: "多选2",
          value: "2",
        },
        {
          label: "多选3",
          value: "3",
        },
      ],
    },
    chosen: false,
  },
  {
    name: "Select_sMPsfl",
    props: {
      placeholder: "请输入",
      maxTagCount: 10,
      size: "middle",
      style: {
        width: "100%",
      },
      options: [
        {
          label: "下拉1",
          value: "1",
        },
        {
          label: "下拉2",
          value: "2",
        },
      ],
    },
    layout: "horizontal",
    panel: {
      icon: "select-field",
      label: "下拉框",
    },
    label: "下拉框",
    type: "Select",
    chosen: false,
  },
  {
    name: "TimePicker_j5FhVI",
    props: {
      placeholder: "请输入",
      format: "HH:mm:ss",
      size: "middle",
      allowClear: true,
      style: {
        maxWidth: "300px",
        width: "100%",
      },
    },
    layout: "horizontal",
    panel: {
      icon: "time-field",
      label: "时间选择器",
    },
    label: "时间选择器",
    type: "TimePicker",
    valueSetter:
      "{{(value) => typeof value === 'string' ? dayjs(value, 'HH:mm:ss') : undefined}}",
    valueGetter:
      "{{(value) => dayjs.isDayjs(value) ? value.format(formvalues.props && formvalues.props.format || 'HH:mm:ss') : undefined}}",
  },
  {
    name: "TimePickerRangePicker_zhQfNz",
    props: {
      placeholder: "请输入",
      format: "HH:mm:ss",
      size: "middle",
      allowClear: true,
      style: {
        maxWidth: "300px",
        width: "100%",
      },
    },
    layout: "horizontal",
    panel: {
      icon: "time-field",
      label: "时间范围",
    },
    label: "时间范围",
    type: "TimePicker.RangePicker",
    valueSetter:
      "{{(value)=> value instanceof Array ? value.map((item) => typeof item === 'string' ? dayjs(item, 'HH:mm:ss') : undefined) : undefined}}",
    valueGetter:
      "{{(value) => value instanceof Array ? value.map((item) => dayjs.isDayjs(item) ? item.format(formvalues.props && formvalues.props.format || 'HH:mm:ss') : undefined) : undefined}}",
  },
  {
    name: "DatePickerRangePicker_IJC54Q",
    props: {
      placeholder: "请输入",
      picker: "date",
      format: "YYYY-MM-DD",
      size: "middle",
      style: {
        maxWidth: "300px",
        width: "100%",
      },
    },
    layout: "horizontal",
    panel: {
      icon: "date-field",
      label: "日期范围",
    },
    label: "日期范围",
    valueSetter:
      "{{(value)=> value instanceof Array ? value.map((item) => typeof item === 'string' ? dayjs(item) : undefined) : undefined}}",
    valueGetter:
      "{{(value) => value instanceof Array ? value.map((item) => dayjs.isDayjs(item) ? item.format(formvalues.props && formvalues.props.format || 'YYYY-MM-DD') : undefined) : undefined}}",
    type: "DatePicker.RangePicker",
  },
  {
    name: "DatePicker_p5Ddqf",
    props: {
      placeholder: "请输入",
      picker: "date",
      format: "YYYY-MM-DD",
      size: "middle",
      style: {
        maxWidth: "300px",
        width: "100%",
      },
    },
    layout: "horizontal",
    panel: {
      icon: "date-field",
      label: "日期选择器",
    },
    label: "日期选择器",
    valueSetter:
      "{{(value)=> (typeof value === 'string' ? dayjs(value) : undefined)}}",
    valueGetter:
      "{{(value) => (dayjs.isDayjs(value) ? value.format(formvalues.props && formvalues.props.format || 'YYYY-MM-DD') : undefined)}}",
    type: "DatePicker",
  },
  {
    name: "FileUpload_MuZRtF",
    props: {
      formdataKey: "file",
      maxCount: 5,
      maxSize: 5,
      uploadCallback: "{{(data) => ({ fileId: data.fileId })}}",
    },
    layout: "horizontal",
    panel: {
      icon: "file-upload-field",
      label: "文件上传",
    },
    label: "文件上传",
    type: "FileUpload",
    chosen: false,
  },
  {
    name: "Switch_IUbd4V",
    props: {
      size: "middle",
    },
    layout: "horizontal",
    panel: {
      icon: "switch-field",
      label: "开关",
    },
    label: "开关",
    type: "Switch",
    valueProp: "checked",
    chosen: false,
  },
  {
    name: "Input_SC1b_7",
    type: "Input.TextArea",
    props: {
      placeholder: "请输入",
      maxLength: 500,
      size: "large",
    },
    layout: "horizontal",
    panel: {
      icon: "text-field",
      label: "输入框",
    },
    label: "备注",
    chosen: false,
  },
];
