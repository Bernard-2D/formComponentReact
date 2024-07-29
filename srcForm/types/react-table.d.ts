export interface ActionInstance {
  onActionClick: (type: string, data: unknown) => unknown
}

declare module '@tanstack/react-table' {
  // or whatever framework adapter you are using

  //merge our new feature's instance APIs with the existing table instance APIs
  interface Table extends ActionInstance {}
}
