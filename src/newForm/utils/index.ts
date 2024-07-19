export const isFunction = (data: any) => typeof data === "function";

const executeCallBack = (
  watchItem: any,
  value: any,
  path: string,
  index?: any
) => {
  if (isFunction(watchItem)) {
    try {
      watchItem(value, index);
    } catch (error) {
      console.log(`${path}对应的watch函数执行报错：`, error);
    }
  }

  if (isFunction(watchItem?.handler)) {
    try {
      watchItem.handler(value, index);
    } catch (error) {
      console.log(`${path}对应的watch函数执行报错：`, error);
    }
  }
};

export const valuesWatch = (changedValues: any, allValues: any, watch: any) => {
  if (Object.keys(watch || {})?.length === 0) {
    return;
  }

  // const flatValues = {
  //   '#': { value: allValues, index: changedValues }
  // };

  // traverseValues({ changedValues, allValues, flatValues });

  Object.keys(watch).forEach((path) => {
    console.log("watch中的path", path);

    // if (!_has(flatValues, path)) {
    //   return;
    // }
    // const { value, index } = _get(flatValues, path);
    // const item = watch[path];
    // executeCallBack(item, value, path, index)
  });
};
