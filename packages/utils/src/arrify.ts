function isIterator(val: any): val is { [Symbol.iterator]() } {
  return typeof val[Symbol.iterator] === 'function';
}

/**
 * 将传入的内容转化为数组
 * @param {any} value
 * @returns {array<any>}
 */
export function arrify<T = any>(value: T | T[]): T[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return [value];
  }

  if (isIterator(value)) {
    return [...value];
  }

  return [value];
}
