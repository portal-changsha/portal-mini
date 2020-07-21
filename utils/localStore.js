// 本地存储

export function setItem (key, value) {
  try {
    uni.setStorageSync(key, value)
  } catch {
    window.localStorage.setItem(
      key,
      typeof value === 'object' ? JSON.stringify(value) : value
    )
  }
}

export function getItem (key) {
  try {
    return uni.getStorageSync(key)
  } catch {
    return window.localStorage.getItem(key)
  }
}

export function removeItem (key) {
  try {
    uni.removeStorageSync(key)
  } catch {
    window.localStorage.removeItem(key)
  }
}
export function clearItem () {
  try {
    uni.clearStorageSync()
  } catch {
    window.localStorage.clear()
  }
}
