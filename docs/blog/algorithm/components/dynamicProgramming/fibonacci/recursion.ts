export default function fibonacci(n: number): number {
  return n < 3 ? 1 : fibonacci(n - 1) + fibonacci(n - 2)
}
