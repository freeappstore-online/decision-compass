import { useEffect, useState } from "react"

type Option = {
  id: string
  name: string
  pros: string
  cons: string
  risks: string
  confidence: number
}

type Decision = {
  id: string
  title: string
  category: string
  why: string
  options: Option[]
  bestOutcome: string
  worstOutcome: string
  risks: string
  confidence: number
  reviewDate: string
  finalDecision: string
  reasoning: string
  createdAt: string
  reflection?: string
}

const STORAGE_KEY = "decision-compass-decisions"

const emptyOption = (): Option => ({
  id: crypto.randomUUID(),
  name: "",
  pros: "",
  cons: "",
  risks: "",
  confidence: 50,
})

const emptyDecision = (): Decision => ({
  id: crypto.randomUUID(),
  title: "",
  category: "Career",
  why: "",
  options: [emptyOption(), emptyOption()],
  bestOutcome: "",
  worstOutcome: "",
  risks: "",
  confidence: 50,
  reviewDate: "",
  finalDecision: "",
  reasoning: "",
  createdAt: new Date().toISOString(),
})

export default function App() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [screen, setScreen] = useState<"home" | "create" | "detail">("home")
  const [step, setStep] = useState(1)
  const [current, setCurrent] = useState<Decision | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      setDecisions(JSON.parse(saved))
    }
  }, [])

  const saveAll = (items: Decision[]) => {
    setDecisions(items)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }

  const startNew = () => {
    setCurrent(emptyDecision())
    setStep(1)
    setScreen("create")
  }

  const openDecision = (decision: Decision) => {
    setCurrent({ ...decision })
    setSelectedId(decision.id)
    setScreen("detail")
  }

  const saveDecision = () => {
    if (!current) return

    const exists = decisions.some((d) => d.id === current.id)

    const updated = exists
      ? decisions.map((d) => (d.id === current.id ? current : d))
      : [current, ...decisions]

    saveAll(updated)
    setSelectedId(current.id)
    setScreen("detail")
  }

  const deleteDecision = () => {
    if (!current) return

    const confirmed = window.confirm(
      "Delete this decision? This cannot be undone."
    )

    if (!confirmed) return

    saveAll(decisions.filter((d) => d.id !== current.id))
    setCurrent(null)
    setScreen("home")
  }

  const updateCurrent = (updates: Partial<Decision>) => {
    if (!current) return
    setCurrent({ ...current, ...updates })
  }

  const updateOption = (id: string, updates: Partial<Option>) => {
    if (!current) return

    setCurrent({
      ...current,
      options: current.options.map((option) =>
        option.id === id ? { ...option, ...updates } : option
      ),
    })
  }

  const addOption = () => {
    if (!current) return

    setCurrent({
      ...current,
      options: [...current.options, emptyOption()],
    })
  }

  const removeOption = (id: string) => {
    if (!current || current.options.length <= 2) return

    setCurrent({
      ...current,
      options: current.options.filter((option) => option.id !== id),
    })
  }

  const next = () => {
    if (step < 9) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }

  const back = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  if (screen === "home") {
    return (
      <>
        <style>{styles}</style>

        <div className="app">
          <header className="header">
            <div className="brand">
              <div className="brand-mark">✦</div>
              <div>
                <div className="brand-name">Decision Compass</div>
                <div className="brand-subtitle">Think clearly. Decide thoughtfully.</div>
              </div>
            </div>

            <div className="privacy">
              <span>●</span> Stored locally
            </div>
          </header>

          <main className="container">
            <section className="hero">
              <div>
                <p className="eyebrow">YOUR DECISION SPACE</p>
                <h1>Make decisions<br />with more clarity.</h1>
                <p className="hero-text">
                  A private space to think through important choices,
                  understand your options, and remember why you decided.
                </p>

                <button className="primary-button" onClick={startNew}>
                  + New Decision
                </button>
              </div>

              <div className="compass-card">
                <div className="compass">✦</div>
                <div className="compass-ring ring-one" />
                <div className="compass-ring ring-two" />
                <span className="direction north">N</span>
                <span className="direction east">E</span>
                <span className="direction south">S</span>
                <span className="direction west">W</span>
              </div>
            </section>

            <section className="section">
              <div className="section-header">
                <div>
                  <p className="eyebrow">YOUR JOURNAL</p>
                  <h2>Previous decisions</h2>
                </div>

                <span className="count">{decisions.length}</span>
              </div>

              {decisions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">◇</div>
                  <h3>No decisions yet</h3>
                  <p>
                    Your decisions will appear here after you create your first one.
                  </p>
                </div>
              ) : (
                <div className="decision-grid">
                  {decisions.map((decision) => (
                    <button
                      className="decision-card"
                      key={decision.id}
                      onClick={() => openDecision(decision)}
                    >
                      <div className="card-top">
                        <span className="category">{decision.category}</span>
                        <span>→</span>
                      </div>

                      <h3>{decision.title || "Untitled decision"}</h3>

                      <p>
                        {decision.why
                          ? decision.why.slice(0, 110) +
                            (decision.why.length > 110 ? "…" : "")
                          : "No description yet."}
                      </p>

                      <div className="card-footer">
                        <span>{decision.options.length} options</span>
                        <span>
                          {new Date(decision.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </>
    )
  }

  if (screen === "detail" && current) {
    return (
      <>
        <style>{styles}</style>

        <div className="app">
          <header className="header">
            <button className="back-link" onClick={() => setScreen("home")}>
              ← Back
            </button>

            <div className="brand">
              <div className="brand-mark">✦</div>
              <div className="brand-name">Decision Compass</div>
            </div>

            <button className="danger-button" onClick={deleteDecision}>
              Delete
            </button>
          </header>

          <main className="detail-container">
            <div className="detail-category">{current.category}</div>
            <h1>{current.title || "Untitled decision"}</h1>

            <p className="detail-why">{current.why}</p>

            <div className="detail-section">
              <h2>Options</h2>

              <div className="option-detail-grid">
                {current.options.map((option) => (
                  <div className="option-detail" key={option.id}>
                    <h3>{option.name || "Unnamed option"}</h3>

                    <div className="mini-block">
                      <strong>Pros</strong>
                      <p>{option.pros || "—"}</p>
                    </div>

                    <div className="mini-block">
                      <strong>Cons</strong>
                      <p>{option.cons || "—"}</p>
                    </div>

                    <div className="mini-block">
                      <strong>Risks</strong>
                      <p>{option.risks || "—"}</p>
                    </div>

                    <div className="confidence-small">
                      Confidence: <strong>{option.confidence}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h2>Final decision</h2>

              <div className="final-box">
                <div className="final-label">YOU CHOSE</div>
                <h3>{current.finalDecision || "Not decided yet"}</h3>
                <p>{current.reasoning || "No reasoning recorded."}</p>
              </div>
            </div>

            <div className="detail-section">
              <h2>Reflection</h2>

              <textarea
                className="input textarea"
                placeholder="When you review this decision later, what would you like to remember?"
                value={current.reflection || ""}
                onChange={(e) =>
                  updateCurrent({ reflection: e.target.value })
                }
              />

              <button className="primary-button" onClick={saveDecision}>
                Save Reflection
              </button>
            </div>

            {current.reviewDate && (
              <div className="reminder">
                <span>◷</span>
                Review planned for{" "}
                <strong>
                  {new Date(current.reviewDate).toLocaleDateString()}
                </strong>
              </div>
            )}
          </main>
        </div>
      </>
    )
  }

  if (!current) return null

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        <header className="header">
          <button className="back-link" onClick={() => setScreen("home")}>
            ← Cancel
          </button>

          <div className="brand">
            <div className="brand-mark">✦</div>
            <div className="brand-name">Decision Compass</div>
          </div>

          <div className="step-label">Step {step} of 9</div>
        </header>

        <main className="wizard-container">
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${(step / 9) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <WizardStep
              number="01"
              title="What decision are you making?"
              description="Give your decision a clear name. You can always change it later."
            >
              <input
                autoFocus
                className="input large-input"
                placeholder="e.g. Should I accept the new job?"
                value={current.title}
                onChange={(e) => updateCurrent({ title: e.target.value })}
              />
            </WizardStep>
          )}

          {step === 2 && (
            <WizardStep
              number="02"
              title="What kind of decision is this?"
              description="Choose the category that best describes your decision."
            >
              <div className="category-grid">
                {["Career", "Relationships", "Finance", "Lifestyle", "Projects", "Other"].map(
                  (category) => (
                    <button
                      key={category}
                      className={
                        current.category === category
                          ? "category-button selected"
                          : "category-button"
                      }
                      onClick={() => updateCurrent({ category })}
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </WizardStep>
          )}

          {step === 3 && (
            <WizardStep
              number="03"
              title="Why does this decision matter?"
              description="Understanding why this matters can make the choice clearer."
            >
              <textarea
                autoFocus
                className="input textarea big-textarea"
                placeholder="What is happening? Why do you need to decide?"
                value={current.why}
                onChange={(e) => updateCurrent({ why: e.target.value })}
              />
            </WizardStep>
          )}

          {step === 4 && (
            <WizardStep
              number="04"
              title="What are your options?"
              description="Add the realistic options you're considering."
            >
              <div className="options-list">
                {current.options.map((option, index) => (
                  <div className="option-editor" key={option.id}>
                    <div className="option-number">0{index + 1}</div>

                    <input
                      className="input"
                      placeholder={`Option ${index + 1}`}
                      value={option.name}
                      onChange={(e) =>
                        updateOption(option.id, { name: e.target.value })
                      }
                    />

                    <div className="two-columns">
                      <textarea
                        className="input textarea"
                        placeholder="Pros"
                        value={option.pros}
                        onChange={(e) =>
                          updateOption(option.id, { pros: e.target.value })
                        }
                      />

                      <textarea
                        className="input textarea"
                        placeholder="Cons"
                        value={option.cons}
                        onChange={(e) =>
                          updateOption(option.id, { cons: e.target.value })
                        }
                      />
                    </div>

                    <textarea
                      className="input textarea"
                      placeholder="Risks or concerns"
                      value={option.risks}
                      onChange={(e) =>
                        updateOption(option.id, { risks: e.target.value })
                      }
                    />

                    {current.options.length > 2 && (
                      <button
                        className="remove-button"
                        onClick={() => removeOption(option.id)}
                      >
                        Remove option
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button className="secondary-button" onClick={addOption}>
                + Add another option
              </button>
            </WizardStep>
          )}

          {step === 5 && (
            <WizardStep
              number="05"
              title="What is the best possible outcome?"
              description="Imagine things go really well. What does success look like?"
            >
              <textarea
                autoFocus
                className="input textarea big-textarea"
                placeholder="Describe the best realistic outcome..."
                value={current.bestOutcome}
                onChange={(e) =>
                  updateCurrent({ bestOutcome: e.target.value })
                }
              />
            </WizardStep>
          )}

          {step === 6 && (
            <WizardStep
              number="06"
              title="What is the worst possible outcome?"
              description="Think through what could realistically go wrong."
            >
              <textarea
                autoFocus
                className="input textarea big-textarea"
                placeholder="Describe the worst realistic outcome..."
                value={current.worstOutcome}
                onChange={(e) =>
                  updateCurrent({ worstOutcome: e.target.value })
                }
              />
            </WizardStep>
          )}

          {step === 7 && (
            <WizardStep
              number="07"
              title="What risks should you consider?"
              description="Write down the uncertainties or risks that could affect your decision."
            >
              <textarea
                autoFocus
                className="input textarea big-textarea"
                placeholder="What worries you about this decision?"
                value={current.risks}
                onChange={(e) => updateCurrent({ risks: e.target.value })}
              />
            </WizardStep>
          )}

          {step === 8 && (
            <WizardStep
              number="08"
              title="How confident are you?"
              description="There is no right answer. This is simply a snapshot of how you feel today."
            >
              <div className="confidence-display">
                <span>{current.confidence}%</span>
                <small>confidence</small>
              </div>

              <input
                className="slider"
                type="range"
                min="0"
                max="100"
                value={current.confidence}
                onChange={(e) =>
                  updateCurrent({ confidence: Number(e.target.value) })
                }
              />

              <div className="slider-labels">
                <span>Not confident</span>
                <span>Very confident</span>
              </div>
            </WizardStep>
          )}

          {step === 9 && (
            <WizardStep
              number="09"
              title="When would you like to review this?"
              description="A future reflection can help you learn whether your reasoning held up."
            >
              <label className="field-label">
                Review date
              </label>

              <input
                className="input"
                type="date"
                value={current.reviewDate}
                onChange={(e) =>
                  updateCurrent({ reviewDate: e.target.value })
                }
              />

              <div className="summary">
                <p className="eyebrow">READY TO DECIDE?</p>

                <h3>{current.title || "Untitled decision"}</h3>

                <p>
                  You are considering{" "}
                  <strong>{current.options.length} options</strong> with a
                  confidence level of{" "}
                  <strong>{current.confidence}%</strong>.
                </p>

                <label className="field-label">Final decision</label>

                <select
                  className="input"
                  value={current.finalDecision}
                  onChange={(e) =>
                    updateCurrent({ finalDecision: e.target.value })
                  }
                >
                  <option value="">Choose an option...</option>
                  {current.options
                    .filter((option) => option.name.trim())
                    .map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                </select>

                <label className="field-label">Why did you choose it?</label>

                <textarea
                  className="input textarea"
                  placeholder="Record the reasoning behind your decision..."
                  value={current.reasoning}
                  onChange={(e) =>
                    updateCurrent({ reasoning: e.target.value })
                  }
                />
              </div>
            </WizardStep>
          )}

          <div className="wizard-footer">
            <button
              className="secondary-button"
              onClick={back}
              disabled={step === 1}
            >
              ← Back
            </button>

            {step < 9 ? (
              <button className="primary-button" onClick={next}>
                Continue →
              </button>
            ) : (
              <button className="primary-button" onClick={saveDecision}>
                Save Decision ✓
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

function WizardStep({
  number,
  title,
  description,
  children,
}: {
  number: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="wizard-step">
      <div className="step-number">{number}</div>
      <h1>{title}</h1>
      <p className="step-description">{description}</p>
      <div className="step-content">{children}</div>
    </section>
  )
}

const styles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #080909;
  color: #f5f1eb;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app {
  min-height: 100vh;
  background:
    radial-gradient(circle at 75% 10%, rgba(215, 145, 96, .08), transparent 28%),
    #080909;
}

.header {
  height: 78px;
  border-bottom: 1px solid #242524;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5vw;
  position: sticky;
  top: 0;
  background: rgba(8,9,9,.92);
  backdrop-filter: blur(12px);
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border: 1px solid #d79a70;
  color: #e8a77c;
  display: grid;
  place-items: center;
  border-radius: 50%;
}

.brand-name {
  font-family: Georgia, serif;
  font-size: 18px;
}

.brand-subtitle {
  color: #858783;
  font-size: 11px;
  margin-top: 2px;
}

.privacy {
  color: #969995;
  font-size: 12px;
}

.privacy span {
  color: #76b887;
}

.container {
  width: min(1120px, 90%);
  margin: auto;
}

.hero {
  min-height: 560px;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  align-items: center;
  gap: 70px;
}

.eyebrow {
  color: #d79a70;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 700;
}

.hero h1,
.wizard-step h1,
.detail-container h1 {
  font-family: Georgia, serif;
  font-weight: 400;
  line-height: 1.05;
}

.hero h1 {
  font-size: clamp(48px, 6vw, 78px);
  margin: 18px 0;
}

.hero-text {
  color: #a2a39e;
  max-width: 560px;
  font-size: 17px;
  line-height: 1.7;
}

.primary-button,
.secondary-button,
.danger-button {
  border: 0;
  border-radius: 7px;
  padding: 13px 20px;
  transition: .2s;
}

.primary-button {
  background: #e6a17a;
  color: #17110d;
  font-weight: 700;
}

.primary-button:hover {
  background: #f0b18d;
  transform: translateY(-1px);
}

.primary-button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.secondary-button {
  background: transparent;
  border: 1px solid #353735;
  color: #deded8;
}

.secondary-button:hover {
  border-color: #777a74;
}

.danger-button {
  background: transparent;
  color: #c98282;
}

.back-link {
  background: none;
  border: 0;
  color: #aaa;
}

.step-label {
  color: #858783;
  font-size: 13px;
}

.compass-card {
  height: 350px;
  width: 350px;
  justify-self: center;
  border: 1px solid #292b29;
  border-radius: 50%;
  position: relative;
  display: grid;
  place-items: center;
  background: radial-gradient(circle, #151716, #080909 70%);
}

.compass {
  font-size: 58px;
  color: #e6a17a;
  z-index: 2;
}

.compass-ring {
  position: absolute;
  border: 1px solid #333532;
  border-radius: 50%;
}

.ring-one {
  width: 230px;
  height: 230px;
}

.ring-two {
  width: 150px;
  height: 150px;
}

.direction {
  position: absolute;
  color: #696b67;
  font-size: 11px;
}

.north { top: 32px; }
.south { bottom: 32px; }
.east { right: 32px; }
.west { left: 32px; }

.section {
  padding: 50px 0 100px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #252625;
  padding-bottom: 18px;
}

.section-header h2 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 32px;
  margin: 5px 0 0;
}

.count {
  color: #777;
}

.empty-state {
  text-align: center;
  padding: 90px 20px;
  border-bottom: 1px solid #252625;
}

.empty-icon {
  color: #d79a70;
  font-size: 34px;
}

.empty-state h3 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 24px;
}

.empty-state p {
  color: #777;
}

.decision-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 25px;
}

.decision-card {
  text-align: left;
  background: #101211;
  border: 1px solid #292b29;
  color: #eee;
  padding: 24px;
  min-height: 210px;
  border-radius: 8px;
}

.decision-card:hover {
  border-color: #8c6047;
}

.card-top,
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category {
  color: #d79a70;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.decision-card h3 {
  font-family: Georgia, serif;
  font-size: 23px;
  font-weight: 400;
  margin: 25px 0 10px;
}

.decision-card p {
  color: #92948f;
  line-height: 1.5;
}

.card-footer {
  color: #666964;
  font-size: 11px;
  margin-top: 28px;
}

.wizard-container {
  width: min(760px, 90%);
  margin: 55px auto 100px;
}

.progress {
  height: 2px;
  background: #252625;
  margin-bottom: 70px;
}

.progress-bar {
  height: 100%;
  background: #e6a17a;
  transition: .3s;
}

.wizard-step {
  min-height: 500px;
}

.step-number {
  color: #d79a70;
  letter-spacing: 2px;
  font-size: 12px;
}

.wizard-step h1 {
  font-size: clamp(38px, 5vw, 56px);
  margin: 15px 0;
}

.step-description {
  color: #8e908b;
  font-size: 16px;
  line-height: 1.6;
  max-width: 600px;
}

.step-content {
  margin-top: 45px;
}

.input {
  width: 100%;
  background: #111312;
  border: 1px solid #30322f;
  border-radius: 6px;
  padding: 14px 15px;
  color: #eee;
  outline: none;
}

.input:focus {
  border-color: #b87956;
}

.large-input {
  font-family: Georgia, serif;
  font-size: 24px;
  padding: 20px;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.big-textarea {
  min-height: 240px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.category-button {
  background: #111312;
  border: 1px solid #30322f;
  color: #bbbdb8;
  padding: 20px;
  text-align: left;
  border-radius: 6px;
}

.category-button.selected {
  border-color: #d79a70;
  color: #e9aa83;
  background: #181310;
}

.options-list {
  display: grid;
  gap: 25px;
}

.option-editor {
  border: 1px solid #292b29;
  padding: 22px;
  border-radius: 7px;
  background: #0d0f0e;
}

.option-number {
  color: #777;
  font-size: 11px;
  margin-bottom: 10px;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 12px 0;
}

.remove-button {
  background: none;
  border: 0;
  color: #9b6767;
  font-size: 12px;
  margin-top: 12px;
}

.confidence-display {
  text-align: center;
  margin: 50px 0 30px;
}

.confidence-display span {
  font-family: Georgia, serif;
  font-size: 72px;
  display: block;
  color: #e6a17a;
}

.confidence-display small {
  color: #777;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.slider {
  width: 100%;
  accent-color: #e6a17a;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
  margin-top: 8px;
}

.field-label {
  display: block;
  color: #9c9e99;
  font-size: 12px;
  margin: 25px 0 8px;
}

.summary {
  border-top: 1px solid #292b29;
  margin-top: 45px;
  padding-top: 30px;
}

.summary h3 {
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.summary p {
  color: #858783;
  line-height: 1.6;
}

.wizard-footer {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #292b29;
  padding-top: 20px;
}

.detail-container {
  width: min(950px, 90%);
  margin: 70px auto;
}

.detail-category {
  color: #d79a70;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 11px;
}

.detail-container h1 {
  font-size: clamp(45px, 6vw, 72px);
  margin: 15px 0;
}

.detail-why {
  color: #969893;
  max-width: 650px;
  line-height: 1.7;
  font-size: 17px;
}

.detail-section {
  margin-top: 70px;
}

.detail-section h2 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 30px;
  border-bottom: 1px solid #292b29;
  padding-bottom: 15px;
}

.option-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.option-detail {
  background: #101211;
  border: 1px solid #292b29;
  padding: 25px;
  border-radius: 7px;
}

.option-detail h3 {
  font-family: Georgia, serif;
  font-size: 25px;
  font-weight: 400;
}

.mini-block {
  margin-top: 20px;
}

.mini-block strong {
  color: #d79a70;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mini-block p {
  color: #92948f;
  line-height: 1.5;
}

.confidence-small {
  border-top: 1px solid #292b29;
  margin-top: 20px;
  padding-top: 15px;
  color: #777;
  font-size: 12px;
}

.confidence-small strong {
  color: #e6a17a;
}

.final-box {
  background: #17130f;
  border: 1px solid #644936;
  padding: 30px;
  border-radius: 7px;
}

.final-label {
  color: #d79a70;
  font-size: 10px;
  letter-spacing: 2px;
}

.final-box h3 {
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 400;
}

.final-box p {
  color: #9c9d98;
  line-height: 1.6;
}

.reminder {
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #292b29;
  color: #92948f;
}

.reminder span {
  color: #d79a70;
  margin-right: 8px;
}

@media (max-width: 800px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 60px 0;
  }

  .compass-card {
    width: 260px;
    height: 260px;
  }

  .ring-one {
    width: 175px;
    height: 175px;
  }

  .ring-two {
    width: 115px;
    height: 115px;
  }

  .decision-grid,
  .option-detail-grid,
  .two-columns {
    grid-template-columns: 1fr;
  }

  .header {
    padding: 0 20px;
  }

  .brand-subtitle {
    display: none;
  }
}
`
