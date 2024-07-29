export const setSession = (key: string, data: unknown) => {
  sessionStorage.setItem(key, JSON.stringify(data))
}

export const getSession = (key: string) => {
  const data = sessionStorage.getItem(key)
  return data && JSON.parse(data)
}

export const removeSession = (key: string) => {
  return sessionStorage.removeItem(key)
}

export const setLocal = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getLocal = (key: string) => {
  const data = localStorage.getItem(key)
  return data && JSON.parse(data)
}

export const removeLocal = (key: string) => {
  return localStorage.removeItem(key)
}
