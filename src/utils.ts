export function toCameCase(str: string): string {
  return str.replace(/-(\w)/g, (match: string, part: string) => part.toLocaleUpperCase())
}

export function getBindProp(el: any, prop: string | symbol) {
  const value = prop in el ? (el as any)[prop] : undefined
  if (value instanceof Function) {
    return value.bind(el)
  }
  return value
}
