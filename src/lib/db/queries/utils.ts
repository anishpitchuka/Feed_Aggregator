//This ensures that instead of always returning an array, it just returns a single row (the first one) or undefined if no rows matched.
export function firstOrUndefined<T>(items: T[]) {
  if (items.length === 0) {
    return;
  }
  return items[0];
}
