import { useState } from 'react'
import ResultCard from './components/ResultCard'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [smiles, setSmiles] = useState('CC(=O)OC1=CC=CC=C1C(=O)O')
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
        body: JSON.stringify({ smiles }),
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-cyan-300">Dockara AI Pro</h1>
        <p className="mt-2 text-slate-300">AI-driven chemistry, toxicity prediction, and docking analysis.</p>

        <form onSubmit={onSubmit} className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4">
          <label className="mb-2 block text-sm font-medium">SMILES Input</label>
          <input
            className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400"
            value={smiles}
            onChange={(e) => setSmiles(e.target.value)}
            placeholder="Enter SMILES"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Submit'}
          </button>
        </form>

        {error && <p className="mt-4 rounded-md bg-red-950 p-3 text-red-300">{error}</p>}

        {result && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
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
              <p className="text-sm">
                <span className="text-slate-400">Prediction:</span> {result.toxicity.prediction}
              </p>
              <p className="text-sm">
                <span className="text-slate-400">Probability:</span> {result.toxicity.probability}
              </p>
            </ResultCard>

            <ResultCard title="Docking">
              <p className="text-sm">
                <span className="text-slate-400">Status:</span> {result.docking.status}
              </p>
              <p className="text-sm">
                <span className="text-slate-400">Binding affinity:</span> {result.docking.binding_affinity}
              </p>
              <p className="mt-2 text-xs text-slate-400">Mode: {result.docking.details?.mode}</p>
            </ResultCard>
          </div>
        )}
      </div>
    </main>
  )
}
