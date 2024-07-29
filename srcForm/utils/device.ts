export const checkDeviceType = () => {
  const agent = navigator.userAgent.toLowerCase()
  if (/windows/.test(agent)) {
    return 'windows pc'
  } else if (/iphone|ipod/.test(agent) && /mobile/.test(agent)) {
    return 'iPhone'
  } else if (/ipad/.test(agent) && /mobile/.test(agent)) {
    return 'iPad'
  } else if (/android/.test(agent) && /mobile/.test(agent)) {
    return 'Android'
  } else if (/linux/.test(agent)) {
    return 'linux pc'
  } else if (/mac/.test(agent)) {
    return 'mac'
  } else {
    return 'unknown'
  }
}
