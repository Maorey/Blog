let DPTable: { [key: number]: number }

function solve(n: number): number {
  return (
    DPTable[n] ||
    (DPTable[n] = n < 3 ? 1 : solve(n - 1) + solve(n - 2))
  )
}

export default function fibonacci(n: number): number {
  DPTable = {}
  const result = solve(n)
  DPTable = null! // 睁一只眼闭一只眼

  return result
}
