import { useState } from 'react'
import ResultCard from './components/ResultCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const EXAMPLES = [
  { name: 'Aspirin', value: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { name: 'Caffeine', value: 'CN1C=NC2=C1N=CN2C' },
  { name: 'Ibuprofen', value: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O' },
]

export default function App() {
  const [smiles, setSmiles] = useState(EXAMPLES[0].value)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch(`${API_URL}/analyze/full`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smiles: smiles.trim() }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail?.error || 'Failed to analyze molecule')
      }
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onFileUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const firstNonEmptyLine = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean)
    if (firstNonEmptyLine) {
      setSmiles(firstNonEmptyLine)
      setError('')
    } else {
      setError('Uploaded file did not contain a valid SMILES line.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h1 className="text-3xl font-bold text-cyan-300">Dockara AI Pro Dashboard</h1>
          <p className="mt-2 text-slate-300">Structured upload + analysis workflow for chemistry, toxicity, and docking.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-1">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <h2 className="text-lg font-semibold text-cyan-200">Upload Section</h2>
              <p className="mt-1 text-xs text-slate-400">Upload a .txt/.smi file (first non-empty line is used).</p>
              <input
                type="file"
                accept=".txt,.smi,.csv"
                onChange={onFileUpload}
                className="mt-3 block w-full cursor-pointer rounded-md border border-slate-600 bg-slate-800 p-2 text-sm"
              />
            </div>

            <form onSubmit={onSubmit} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <h2 className="text-lg font-semibold text-cyan-200">SMILES Input</h2>
              <textarea
                className="mt-3 h-28 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                value={smiles}
                onChange={(e) => setSmiles(e.target.value)}
                placeholder="Enter or upload SMILES"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {EXAMPLES.map((example) => (
                  <button
                    key={example.name}
                    type="button"
                    onClick={() => setSmiles(example.value)}
                    className="rounded-md border border-slate-600 px-2 py-1 text-xs hover:border-cyan-400"
                  >
                    {example.name}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Run Full Analysis'}
              </button>
            </form>
          </section>

          <section className="lg:col-span-2">
            {error && <p className="mb-4 rounded-md bg-red-950 p-3 text-red-300">{error}</p>}

            {!result && !loading && (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
                Upload or paste a molecule, then run analysis to view dashboard cards.
              </div>
            )}

            {result && (
              <div className="grid gap-4 md:grid-cols-3">
                <ResultCard title="Descriptors">
                  <ul className="space-y-1 text-sm">
                    {Object.entries(result.chemistry).map(([key, value]) => (
                      <li key={key}>
                        <span className="text-slate-400">{key}:</span> {String(value)}
                      </li>
                    ))}
                  </ul>
                </ResultCard>

                <ResultCard title="Toxicity">
                  <p className="text-sm"><span className="text-slate-400">Prediction:</span> {result.toxicity.prediction}</p>
                  <p className="text-sm"><span className="text-slate-400">Probability:</span> {result.toxicity.probability}</p>
                </ResultCard>

                <ResultCard title="Docking">
                  <p className="text-sm"><span className="text-slate-400">Status:</span> {result.docking.status}</p>
                  <p className="text-sm"><span className="text-slate-400">Binding affinity:</span> {result.docking.binding_affinity}</p>
                  <p className="mt-2 text-xs text-slate-400">Mode: {result.docking.details?.mode}</p>
                </ResultCard>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
