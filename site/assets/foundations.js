const theme = document.querySelector('#theme-select')
const search = document.querySelector('#token-search')

function updateColors() {
  document.body.dataset.asTheme = theme.value
  const query = search.value.trim().toLocaleLowerCase()
  let count = 0
  for (const panel of document.querySelectorAll('[data-token-theme]')) {
    panel.hidden = panel.dataset.tokenTheme !== theme.value
    for (const card of panel.querySelectorAll('[data-token-name]')) {
      card.hidden = !card.dataset.tokenName.toLocaleLowerCase().includes(query)
      if (!panel.hidden && !card.hidden) count += 1
    }
  }
  document.querySelector('#color-count').textContent = `${count} color tokens shown.`
  document.querySelector('#token-empty').hidden = count > 0
}

theme.addEventListener('change', updateColors)
search.addEventListener('input', updateColors)
updateColors()

document.addEventListener('click', async event => {
  const button = event.target.closest('[data-copy]')
  if (!button) return
  const status = document.querySelector('#copy-status')
  try {
    await navigator.clipboard.writeText(button.dataset.copy)
    status.textContent = `Copied: ${button.dataset.copy}`
  } catch {
    status.textContent = `Clipboard unavailable. Select and copy this text: ${button.dataset.copy}`
  }
})
