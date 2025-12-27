
const cache = new WeakMap<object, (string | symbol)[]>()

export function autoBind<T extends object>(inst: T): void {
  let proto = Reflect.getPrototypeOf(inst)
  while (proto !== Object.prototype && proto != null) {
    let keys = cache.get(proto)
    if (keys == null) {
      keys = []
      for (const k of Reflect.ownKeys(proto)) {
        if (k === 'constructor') { continue }
        const descriptor = Reflect.getOwnPropertyDescriptor(proto, k)
        if (descriptor == null) { continue }
        if (typeof descriptor.value !== 'function') { continue }
        keys.push(k)
      }
      cache.set(proto, keys)
    }
    for (const k of keys) {
      if (Object.hasOwn(inst, k)) { continue }
      inst[k as keyof T] = Reflect.get(proto, k).bind(inst)
    }
    proto = Reflect.getPrototypeOf(proto)
  }
}
