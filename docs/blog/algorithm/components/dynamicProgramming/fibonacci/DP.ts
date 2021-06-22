export default function fibonacci(n: number) {
  let prev = 1
  let curr = 1
  let next
  while (n-- > 2) {
    next = prev + curr
    prev = curr
    curr = next
  }

  return curr
}
