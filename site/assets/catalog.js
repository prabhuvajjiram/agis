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

const selection = document.querySelector('.as-selection')
const selectionTrigger = document.querySelector('#catalog-lookup')
const selectionValue = document.querySelector('#catalog-lookup-value')
const selectionPopover = document.querySelector('#catalog-vendor-popover')
const selectionSearch = document.querySelector('#catalog-vendor-search')
const selectionOptions = [...document.querySelectorAll('#catalog-vendor-options [role="option"]')]
const selectionEmpty = document.querySelector('#catalog-vendor-empty')
const selectionStatus = document.querySelector('#catalog-vendor-results')

const visibleSelectionOptions = () => selectionOptions.filter((option) => !option.hidden)

const updateSelectionResults = () => {
  const query = selectionSearch.value.trim().toLocaleLowerCase()
  for (const option of selectionOptions) {
    option.hidden = !option.dataset.search.toLocaleLowerCase().includes(query)
  }

  const resultCount = visibleSelectionOptions().length
  selectionEmpty.hidden = resultCount !== 0
  selectionStatus.textContent = resultCount === 0
    ? 'No suppliers available.'
    : `${resultCount} ${resultCount === 1 ? 'supplier' : 'suppliers'} available.`
}

const openSelection = (focusTarget = 'search') => {
  selectionPopover.hidden = false
  selectionTrigger.setAttribute('aria-expanded', 'true')
  requestAnimationFrame(() => {
    if (focusTarget === 'search') {
      selectionSearch.focus()
      return
    }
    const options = visibleSelectionOptions()
    options[focusTarget === 'last' ? options.length - 1 : 0]?.focus()
  })
}

const closeSelection = ({ restoreFocus = false } = {}) => {
  selectionPopover.hidden = true
  selectionTrigger.setAttribute('aria-expanded', 'false')
  selectionSearch.value = ''
  updateSelectionResults()
  if (restoreFocus) requestAnimationFrame(() => selectionTrigger.focus())
}

const selectOption = (option) => {
  for (const candidate of selectionOptions) {
    candidate.setAttribute('aria-selected', String(candidate === option))
  }
  selectionValue.textContent = option.dataset.value
  closeSelection({ restoreFocus: true })
}

selectionTrigger?.addEventListener('click', () => {
  if (selectionPopover.hidden) openSelection()
  else closeSelection()
})

selectionTrigger?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !selectionPopover.hidden) {
    event.preventDefault()
    closeSelection({ restoreFocus: true })
    return
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  openSelection(event.key === 'ArrowUp' ? 'last' : 'first')
})

selectionSearch?.addEventListener('input', updateSelectionResults)
selectionSearch?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeSelection({ restoreFocus: true })
    return
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const options = visibleSelectionOptions()
  if (options.length === 0) return
  event.preventDefault()
  options[event.key === 'ArrowUp' ? options.length - 1 : 0].focus()
})

for (const option of selectionOptions) {
  option.addEventListener('click', () => selectOption(option))
  option.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeSelection({ restoreFocus: true })
      return
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    const options = visibleSelectionOptions()
    const currentIndex = options.indexOf(option)
    let nextIndex = currentIndex
    if (event.key === 'ArrowDown') nextIndex = Math.min(currentIndex + 1, options.length - 1)
    if (event.key === 'ArrowUp') nextIndex = Math.max(currentIndex - 1, 0)
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = options.length - 1
    event.preventDefault()
    options[nextIndex]?.focus()
  })
}

document.addEventListener('pointerdown', (event) => {
  if (!selectionPopover.hidden && !selection.contains(event.target)) closeSelection()
})

document.addEventListener('focusin', (event) => {
  if (!selectionPopover.hidden && !selection.contains(event.target)) closeSelection()
})

const sortableTable = document.querySelector('.as-table')
const tableSortStatus = document.querySelector('#catalog-table-sort-status')
const tableSortButtons = [...sortableTable?.querySelectorAll('.as-table__sort') ?? []]
const tableCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

for (const [columnIndex, button] of tableSortButtons.entries()) {
  button.addEventListener('click', () => {
    const activeHeader = button.closest('th')
    const direction = activeHeader.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending'
    const rows = [...sortableTable.tBodies[0].rows]
    const type = button.dataset.sortType

    rows.sort((leftRow, rightRow) => {
      const leftCell = leftRow.cells[columnIndex]
      const rightCell = rightRow.cells[columnIndex]
      const leftValue = leftCell.dataset.sortValue ?? leftCell.textContent.trim()
      const rightValue = rightCell.dataset.sortValue ?? rightCell.textContent.trim()
      const leftMissing = leftValue === '' || (type === 'number' && !Number.isFinite(Number(leftValue)))
      const rightMissing = rightValue === '' || (type === 'number' && !Number.isFinite(Number(rightValue)))
      if (leftMissing && rightMissing) return 0
      if (leftMissing) return 1
      if (rightMissing) return -1
      const comparison = type === 'number'
        ? Number(leftValue) - Number(rightValue)
        : tableCollator.compare(leftValue, rightValue)
      return direction === 'ascending' ? comparison : comparison * -1
    })

    for (const header of sortableTable.tHead.rows[0].cells) {
      header.setAttribute('aria-sort', header === activeHeader ? direction : 'none')
      const indicator = header.querySelector('.as-table__sort [aria-hidden="true"]')
      if (indicator) indicator.textContent = header === activeHeader
        ? direction === 'ascending' ? '↑' : '↓'
        : '↕'
    }
    for (const row of rows) sortableTable.tBodies[0].append(row)

    const columnName = button.textContent.trim().replace(/[↑↓]$/, '').trim()
    tableSortStatus.textContent = `Vendor quotes sorted by ${columnName}, ${direction}.`
  })
}

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

const sidebarMenu = document.querySelector('#catalog-sidebar-menu')
const sidebarIndicator = sidebarMenu?.querySelector('.as-sidebar__indicator')
const sidebarLinks = [...sidebarMenu?.querySelectorAll('.as-sidebar__link') ?? []]
const sidebarSearch = document.querySelector('#catalog-sidebar-search')
const sidebarStatus = document.querySelector('#catalog-sidebar-status')

const positionSidebarIndicator = (link, { animate = true } = {}) => {
  if (!sidebarMenu || !sidebarIndicator || !link || link.closest('li')?.hidden) {
    if (sidebarIndicator) sidebarIndicator.hidden = true
    return
  }

  sidebarIndicator.hidden = false
  if (!animate) sidebarIndicator.style.transition = 'none'
  sidebarMenu.style.setProperty('--as-sidebar-active-offset', `${link.offsetTop}px`)
  sidebarMenu.style.setProperty('--as-sidebar-active-height', `${link.offsetHeight}px`)
  if (!animate) requestAnimationFrame(() => sidebarIndicator.style.removeProperty('transition'))
}

const selectSidebarDestination = (link) => {
  for (const candidate of sidebarLinks) candidate.removeAttribute('aria-current')
  link.setAttribute('aria-current', 'page')
  positionSidebarIndicator(link)
  sidebarStatus.textContent = `${link.dataset.sidebarLabel} is the current destination.`
}

if (sidebarMenu) {
  const currentLink = sidebarLinks.find((link) => link.getAttribute('aria-current') === 'page')
  positionSidebarIndicator(currentLink, { animate: false })
  sidebarMenu.dataset.animatedIndicator = 'true'
}

for (const link of sidebarLinks) {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    selectSidebarDestination(link)
  })
}

sidebarSearch?.addEventListener('input', () => {
  const query = sidebarSearch.value.trim().toLocaleLowerCase()
  let visibleCount = 0
  for (const link of sidebarLinks) {
    const visible = link.dataset.sidebarLabel.toLocaleLowerCase().includes(query)
    link.closest('li').hidden = !visible
    if (visible) visibleCount += 1
  }

  const currentLink = sidebarLinks.find((link) => link.getAttribute('aria-current') === 'page')
  positionSidebarIndicator(currentLink, { animate: false })
  sidebarStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'destination' : 'destinations'} available.`
})

window.addEventListener('resize', () => {
  const currentLink = sidebarLinks.find((link) => link.getAttribute('aria-current') === 'page')
  positionSidebarIndicator(currentLink, { animate: false })
})

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
