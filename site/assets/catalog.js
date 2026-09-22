const themeSelect = document.querySelector('#theme-select')
themeSelect?.addEventListener('change', () => {
  document.body.dataset.asTheme = themeSelect.value
})

const switchControl = document.querySelector('#catalog-switch')
const switchStatus = document.querySelector('#switch-status')
const switchState = document.querySelector('#catalog-switch-state')
switchControl?.addEventListener('click', () => {
  const checked = switchControl.getAttribute('aria-checked') !== 'true'
  switchControl.setAttribute('aria-checked', String(checked))
  switchState.textContent = checked ? 'On' : 'Off'
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
let activeSelectionOption = null

const visibleSelectionOptions = () => selectionOptions.filter((option) => !option.hidden)

const setActiveSelectionOption = (option) => {
  activeSelectionOption = option ?? null
  for (const candidate of selectionOptions) {
    if (candidate === activeSelectionOption) candidate.dataset.active = 'true'
    else delete candidate.dataset.active
  }

  if (activeSelectionOption) {
    selectionSearch.setAttribute('aria-activedescendant', activeSelectionOption.id)
    activeSelectionOption.scrollIntoView({ block: 'nearest' })
  } else {
    selectionSearch.removeAttribute('aria-activedescendant')
  }
}

const updateSelectionResults = () => {
  const query = selectionSearch.value.trim().toLocaleLowerCase()
  for (const option of selectionOptions) {
    option.hidden = !option.dataset.search.toLocaleLowerCase().includes(query)
  }

  const resultCount = visibleSelectionOptions().length
  if (activeSelectionOption?.hidden) setActiveSelectionOption(null)
  selectionEmpty.hidden = resultCount !== 0
  selectionStatus.textContent = resultCount === 0
    ? 'No suppliers available.'
    : `${resultCount} ${resultCount === 1 ? 'supplier' : 'suppliers'} available.`
}

const openSelection = (focusTarget = 'search') => {
  selectionPopover.hidden = false
  selectionTrigger.setAttribute('aria-expanded', 'true')
  requestAnimationFrame(() => {
    selectionSearch.focus()
    if (focusTarget !== 'search') {
      const options = visibleSelectionOptions()
      setActiveSelectionOption(options[focusTarget === 'last' ? options.length - 1 : 0])
    }
  })
}

const closeSelection = ({ restoreFocus = false } = {}) => {
  selectionPopover.hidden = true
  selectionTrigger.setAttribute('aria-expanded', 'false')
  selectionSearch.value = ''
  setActiveSelectionOption(null)
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
  if (event.key === 'Enter' && activeSelectionOption) {
    event.preventDefault()
    selectOption(activeSelectionOption)
    return
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
  const options = visibleSelectionOptions()
  if (options.length === 0) return
  event.preventDefault()
  const currentIndex = options.indexOf(activeSelectionOption)
  let nextIndex = currentIndex
  if (event.key === 'ArrowDown') nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, options.length - 1)
  if (event.key === 'ArrowUp') nextIndex = currentIndex < 0 ? options.length - 1 : Math.max(currentIndex - 1, 0)
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = options.length - 1
  setActiveSelectionOption(options[nextIndex])
})

for (const option of selectionOptions) {
  option.addEventListener('click', () => selectOption(option))
  option.addEventListener('pointermove', () => setActiveSelectionOption(option))
}

document.addEventListener('pointerdown', (event) => {
  if (selectionPopover && selection && !selectionPopover.hidden && !selection.contains(event.target)) closeSelection()
})

document.addEventListener('focusin', (event) => {
  if (selectionPopover && selection && !selectionPopover.hidden && !selection.contains(event.target)) closeSelection()
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
const tablist = document.querySelector('.as-tablist')
const tabIndicator = tablist?.querySelector('.as-tab__indicator')
const workbenchViews = [...document.querySelectorAll('.as-view-switcher__item')]
const workbenchViewStatus = document.querySelector('#catalog-view-status')
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

for (const view of workbenchViews) {
  view.addEventListener('click', () => {
    for (const candidate of workbenchViews) {
      candidate.setAttribute('aria-pressed', String(candidate === view))
    }
    workbenchViewStatus.textContent = `${view.dataset.viewName} is the current workbench view.`
    if (!reducedMotion()) {
      workbenchViewStatus.animate([
        { opacity: 0.65, transform: 'translateY(0.125rem)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
    }
  })
}

const positionTabIndicator = (tab, { animate = true } = {}) => {
  if (!tablist || !tabIndicator || !tab) return
  if (!animate) tabIndicator.style.transition = 'none'
  tablist.style.setProperty('--as-tab-active-offset', `${tab.offsetLeft - tabIndicator.offsetLeft}px`)
  tablist.style.setProperty('--as-tab-active-width', `${tab.offsetWidth}px`)
  if (!animate) requestAnimationFrame(() => tabIndicator.style.removeProperty('transition'))
}

const syncSelectedTabIndicator = () => {
  positionTabIndicator(
    tabs.find((tab) => tab.getAttribute('aria-selected') === 'true'),
    { animate: false },
  )
}

const activateTab = (tab, { animate = true } = {}) => {
  let activePanel
  for (const candidate of tabs) {
    const selected = candidate === tab
    candidate.setAttribute('aria-selected', String(selected))
    candidate.tabIndex = selected ? 0 : -1
    const panel = document.querySelector(`#${candidate.getAttribute('aria-controls')}`)
    if (panel) panel.hidden = !selected
    if (selected) activePanel = panel
  }
  positionTabIndicator(tab, { animate })
  if (animate && activePanel && !reducedMotion()) {
    activePanel.animate([
      { opacity: 0.65, transform: 'translateY(0.25rem)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 200, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
  }
}

if (tablist) {
  syncSelectedTabIndicator()
  tablist.dataset.animatedIndicator = 'true'

  if ('ResizeObserver' in window) {
    const tabLayoutObserver = new ResizeObserver(syncSelectedTabIndicator)
    tabLayoutObserver.observe(tablist)
    for (const tab of tabs) tabLayoutObserver.observe(tab)
  }

  document.fonts?.ready.then(syncSelectedTabIndicator)
  window.addEventListener('pageshow', syncSelectedTabIndicator)
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

const paginationSummary = document.querySelector('#catalog-pagination-summary')
const paginationStatus = document.querySelector('#catalog-pagination-status')
const paginationCurrent = document.querySelector('#catalog-pagination-current')
const paginationPrevious = document.querySelector('[data-pagination-action="previous"]')
const paginationNext = document.querySelector('[data-pagination-action="next"]')
const paginationTotalItems = 84
const paginationPageSize = 20
const paginationTotalPages = Math.ceil(paginationTotalItems / paginationPageSize)
let paginationPage = 1

const updatePagination = (nextPage, { animate = true } = {}) => {
  paginationPage = Math.max(1, Math.min(nextPage, paginationTotalPages))
  const firstItem = ((paginationPage - 1) * paginationPageSize) + 1
  const lastItem = Math.min(paginationPage * paginationPageSize, paginationTotalItems)
  paginationSummary.textContent = `Showing ${firstItem}–${lastItem} of ${paginationTotalItems}`
  paginationStatus.textContent = `Page ${paginationPage} of ${paginationTotalPages}.`
  paginationCurrent.textContent = String(paginationPage)
  paginationCurrent.setAttribute('aria-label', `Current page, ${paginationPage}`)
  paginationPrevious.disabled = paginationPage === 1
  paginationNext.disabled = paginationPage === paginationTotalPages
  if (animate && !reducedMotion()) {
    paginationCurrent.animate([
      { opacity: 0.55, transform: 'translateY(0.15rem)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 160, easing: 'ease-out' })
  }
}

paginationPrevious?.addEventListener('click', () => updatePagination(paginationPage - 1))
paginationNext?.addEventListener('click', () => updatePagination(paginationPage + 1))

const sidebarMenu = document.querySelector('#catalog-sidebar-menu')
const sidebarIndicator = sidebarMenu?.querySelector('.as-sidebar__indicator')
const sidebarLinks = [...sidebarMenu?.querySelectorAll('.as-sidebar__link') ?? []]
const sidebarRail = document.querySelector('#catalog-sidebar-rail')
const sidebarRailIndicator = sidebarRail?.querySelector('.as-sidebar__rail-indicator')
const sidebarRailLinks = [...sidebarRail?.querySelectorAll('.as-sidebar__rail-link') ?? []]
const sidebarPanel = document.querySelector('.as-sidebar__panel')
const sidebarTitle = document.querySelector('#catalog-sidebar-title')
const sidebarDestinations = document.querySelector('#catalog-sidebar-destinations')
const sidebarSearch = document.querySelector('#catalog-sidebar-search')
const sidebarStatus = document.querySelector('#catalog-sidebar-status')
const sidebarAreaDestinations = {
  home: [['Executive Dashboard', 'HomeIcon'], ['Workbench', 'ClipboardDocumentCheckIcon'], ['Analytics', 'ChartBarIcon']],
  sales: [['Sales Dashboard', 'PresentationChartLineIcon'], ['Sales Pipeline', 'PresentationChartLineIcon'], ['Team Quotes', 'ClipboardDocumentListIcon'], ['Order Desk', 'DocumentTextIcon'], ['Service Orders', 'WrenchScrewdriverIcon'], ['Customers and Partners', 'UsersIcon']],
  operations: [['Production Dashboard', 'ChartBarIcon'], ['Shop Floor', 'ClipboardDocumentCheckIcon'], ['Scheduling', 'ClipboardDocumentListIcon'], ['Quality Control', 'ClipboardDocumentCheckIcon'], ['Shipping', 'TruckIcon']],
  inventory: [['Inventory overview', 'CubeIcon'], ['Containers', 'ArchiveBoxIcon'], ['Receiving', 'TruckIcon']],
  finance: [['Accounts receivable', 'BanknotesIcon'], ['Accounts payable', 'BanknotesIcon']],
  reports: [['Report library', 'DocumentChartBarIcon'], ['Saved reports', 'DocumentTextIcon']],
  admin: [['Company Profile', 'Cog6ToothIcon'], ['Users and Roles', 'UsersIcon'], ['Workflows', 'ClipboardDocumentListIcon'], ['Integrations', 'Cog6ToothIcon']],
}

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

const positionSidebarRailIndicator = (link, { animate = true } = {}) => {
  if (!sidebarRail || !sidebarRailIndicator || !link) return
  if (!animate) sidebarRailIndicator.style.transition = 'none'
  sidebarRail.style.setProperty('--as-sidebar-rail-active-offset', `${link.offsetTop - sidebarRailIndicator.offsetTop}px`)
  sidebarRail.style.setProperty('--as-sidebar-rail-active-height', `${link.offsetHeight}px`)
  if (!animate) requestAnimationFrame(() => sidebarRailIndicator.style.removeProperty('transition'))
}

const selectSidebarArea = (link) => {
  const areaKey = link.dataset.sidebarArea
  const areaLabel = link.dataset.sidebarTitle ?? link.getAttribute('aria-label')
  const destinations = sidebarAreaDestinations[areaKey]
  if (!destinations) return

  for (const candidate of sidebarRailLinks) candidate.setAttribute('aria-expanded', 'false')
  link.setAttribute('aria-expanded', 'true')
  positionSidebarRailIndicator(link)

  sidebarTitle.textContent = areaLabel
  sidebarDestinations.setAttribute('aria-label', `${areaLabel} destinations`)
  sidebarSearch.value = ''
  sidebarSearch.setAttribute('aria-label', `Search ${areaLabel} navigation`)
  for (const [index, destinationLink] of sidebarLinks.entries()) {
    const destination = destinations[index]
    destinationLink.closest('li').hidden = !destination
    destinationLink.dataset.sidebarLabel = destination?.[0] ?? ''
    destinationLink.querySelector('span').textContent = destination?.[0] ?? ''
    destinationLink.querySelector('use').setAttribute('href', `./assets/icons/navigation.svg#${destination?.[1] ?? 'HomeIcon'}`)
    destinationLink.removeAttribute('aria-current')
  }

  const firstDestination = sidebarLinks[0]
  firstDestination.setAttribute('aria-current', 'page')
  positionSidebarIndicator(firstDestination)
  sidebarStatus.textContent = `${areaLabel}: ${firstDestination.dataset.sidebarLabel} is the current destination.`
  if (!reducedMotion()) {
    sidebarPanel.animate([
      { opacity: 0.7, transform: 'translateX(-0.25rem)' },
      { opacity: 1, transform: 'translateX(0)' },
    ], { duration: 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
  }
}

if (sidebarRail) {
  const currentArea = sidebarRailLinks.find((link) => link.getAttribute('aria-expanded') === 'true')
  positionSidebarRailIndicator(currentArea, { animate: false })
  sidebarRail.dataset.animatedIndicator = 'true'
}

for (const link of sidebarRailLinks) {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    selectSidebarArea(link)
  })
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
    const visible = Boolean(link.dataset.sidebarLabel) && link.dataset.sidebarLabel.toLocaleLowerCase().includes(query)
    link.closest('li').hidden = !visible
    if (visible) visibleCount += 1
  }

  const currentLink = sidebarLinks.find((link) => link.getAttribute('aria-current') === 'page')
  positionSidebarIndicator(currentLink, { animate: false })
  sidebarStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'destination' : 'destinations'} available.`
})

window.addEventListener('resize', () => {
  syncSelectedTabIndicator()
  const currentArea = sidebarRailLinks.find((link) => link.getAttribute('aria-expanded') === 'true')
  positionSidebarRailIndicator(currentArea, { animate: false })
  const currentLink = sidebarLinks.find((link) => link.getAttribute('aria-current') === 'page')
  positionSidebarIndicator(currentLink, { animate: false })
})

const menuTrigger = document.querySelector('#menu-trigger')
const menu = document.querySelector('#catalog-menu')
const overlayStatus = document.querySelector('#overlay-status')
const menuItems = () => [...menu.querySelectorAll('[role="menuitem"]:not([disabled])')]
const closeMenu = (restoreFocus = false) => {
  menu.hidden = true
  menuTrigger.setAttribute('aria-expanded', 'false')
  if (restoreFocus) menuTrigger.focus()
}
const openMenu = (focusIndex = null) => {
  menu.hidden = false
  menuTrigger.setAttribute('aria-expanded', 'true')
  if (focusIndex !== null) menuItems().at(focusIndex)?.focus()
}

menuTrigger?.addEventListener('click', (event) => {
  if (event.detail === 0) {
    openMenu(0)
    return
  }
  menu.hidden ? openMenu() : closeMenu()
})

menuTrigger?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu(event.key === 'ArrowUp' ? -1 : 0)
  }
  if (event.key === 'Escape' && !menu.hidden) {
    event.preventDefault()
    closeMenu(true)
  }
})

menu?.addEventListener('keydown', (event) => {
  const items = menuItems()
  const index = items.indexOf(document.activeElement)
  let next = null
  if (event.key === 'ArrowDown') next = (index + 1) % items.length
  if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
  if (event.key === 'Home') next = 0
  if (event.key === 'End') next = items.length - 1
  if (next !== null) {
    event.preventDefault()
    items[next].focus()
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  }
  if (event.key === 'Tab') closeMenu()
})

const dialog = document.querySelector('#catalog-dialog')
let dialogOpener = null
const openDialog = (opener) => {
  dialogOpener = opener
  closeMenu()
  dialog.showModal()
}

menu?.addEventListener('click', (event) => {
  const item = event.target.closest('[role="menuitem"]')
  if (!item) return
  if (item.hasAttribute('data-open-dialog')) {
    openDialog(menuTrigger)
    return
  }
  overlayStatus.textContent = `${item.textContent.trim()} selected for this example.`
  closeMenu(true)
})

document.addEventListener('pointerdown', (event) => {
  if (menu && menuTrigger && !menu.hidden && !menu.contains(event.target) && event.target !== menuTrigger) {
    closeMenu(menu.contains(document.activeElement))
  }
})

document.addEventListener('focusin', (event) => {
  if (menu && menuTrigger && !menu.hidden && !menu.contains(event.target) && event.target !== menuTrigger) closeMenu()
})

document.querySelector('#dialog-open')?.addEventListener('click', (event) => openDialog(event.currentTarget))
document.querySelector('#dialog-cancel')?.addEventListener('click', () => dialog.close())
document.querySelector('#dialog-close')?.addEventListener('click', () => dialog.close())
document.querySelector('#dialog-confirm')?.addEventListener('click', () => dialog.close('confirm'))
dialog?.addEventListener('close', () => dialogOpener?.focus())

const feedbackStatus = document.querySelector('#feedback-action-status')
document.querySelector('#feedback-retry')?.addEventListener('click', () => {
  feedbackStatus.textContent = 'Retry requested. The product would now repeat the upload.'
})
document.querySelector('#feedback-clear')?.addEventListener('click', () => {
  feedbackStatus.textContent = 'Filters cleared. The product would now refresh the results.'
})
