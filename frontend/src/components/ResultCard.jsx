export default function ResultCard({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-md">
      <h2 className="mb-3 text-lg font-semibold text-cyan-300">{title}</h2>
      {children}
    </section>
  )
}
