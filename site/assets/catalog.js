const themeSelect = document.querySelector('#theme-select')
themeSelect?.addEventListener('change', () => {
  document.body.dataset.asTheme = themeSelect.value
})

const switchControl = document.querySelector('#catalog-switch')
const switchStatus = document.querySelector('#switch-status')
switchControl?.addEventListener('click', () => {
  const checked = switchControl.getAttribute('aria-checked') !== 'true'
  switchControl.setAttribute('aria-checked', String(checked))
  switchStatus.textContent = `Grid snapping is ${checked ? 'on' : 'off'}.`
})

const tabs = [...document.querySelectorAll('[role="tab"]')]
const activateTab = (tab) => {
  for (const candidate of tabs) {
    const selected = candidate === tab
    candidate.setAttribute('aria-selected', String(selected))
    candidate.tabIndex = selected ? 0 : -1
    const panel = document.querySelector(`#${candidate.getAttribute('aria-controls')}`)
    if (panel) panel.hidden = !selected
  }
}

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => activateTab(tab))
  tab.addEventListener('keydown', (event) => {
    let nextIndex
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    activateTab(tabs[nextIndex])
    tabs[nextIndex].focus()
  })
}

const menuTrigger = document.querySelector('#menu-trigger')
const menu = document.querySelector('#catalog-menu')
menuTrigger?.addEventListener('click', () => {
  const opening = menu.hidden
  menu.hidden = !opening
  menuTrigger.setAttribute('aria-expanded', String(opening))
  if (opening) menu.querySelector('[role="menuitem"]')?.focus()
})

menu?.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  menu.hidden = true
  menuTrigger.setAttribute('aria-expanded', 'false')
  menuTrigger.focus()
})

const dialog = document.querySelector('#catalog-dialog')
document.querySelector('#dialog-open')?.addEventListener('click', () => dialog.showModal())
document.querySelector('#dialog-cancel')?.addEventListener('click', () => dialog.close())
document.querySelector('#dialog-confirm')?.addEventListener('click', () => dialog.close('confirm'))
