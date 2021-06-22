export default function fibonacci(n: number) {
  const DPTable: { [key: number]: number } = { 1: 1, 2: 1 }

  for (let i = 3; i <= n; i++) {
    DPTable[i] = DPTable[i - 1] + DPTable[i - 2]
  }

  return DPTable[n]
}
