// Present the canonical Markdown as readable text without interpreting HTML.
const file = new URLSearchParams(location.search).get('file') ?? ''
const status = document.querySelector('#document-status')
const content = document.querySelector('#document-body')
async function loadDocument() {
  try {
    if (!/^(?:DESIGN\.md|docs\/[a-zA-Z0-9_./-]+\.md)$/.test(file) || file.includes('..')) {
      throw new Error('Invalid guidance path')
    }
    const response = await fetch(new URL(`../${file}`, location.href))
    if (!response.ok) throw new Error('Guidance unavailable')
    const markdown = await response.text()
    const title = markdown.match(/^# (.+)$/m)?.[1] ?? 'Implementation guidance'
    document.querySelector('#document-title').textContent = title
    document.title = `${title} · ASIG`
    content.textContent = markdown
    content.hidden = false
    status.textContent = 'Canonical guidance, shown as Markdown text.'
  } catch {
    status.textContent = 'Unable to load this guidance. Return to the catalogue and try the link again.'
  }
}
loadDocument()
