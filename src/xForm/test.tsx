import FormRender, { useForm } from './index'
import { schemaTemplate } from '../simpleForm/schema';

function TestXForm () {
    const form = useForm();
    return (
        <div>
          <FormRender form={form} schema={schemaTemplate} />
        </div>
      );
}

export default TestXForm