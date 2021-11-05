export const randomUUID = (seed = 99999) => {
  return (Date.now() + Math.random() * seed).toString(32)
}

export const last = <T>(arr: T[]): T => {
  const { length } = arr
  return arr[length - 1]
}
