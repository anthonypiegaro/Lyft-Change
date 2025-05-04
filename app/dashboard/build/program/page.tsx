export default async function ProgramPage() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return (
    <div>Program Page</div>
  )
}