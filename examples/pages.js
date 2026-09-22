// Local specimen state only. No API calls, storage or ERP mutations.
const body = document.body
const theme = document.querySelector('#theme-select')
theme?.addEventListener('change', () => { body.dataset.asTheme = theme.value })
document.querySelector('#density-select')?.addEventListener('change', event => { body.dataset.density = event.target.value })
const stateSelect = document.querySelector('#state-select')
function showState() {
  const selected = stateSelect.value
  document.querySelector('#page-content').hidden = selected !== 'ready'
  document.querySelector('#header-actions').hidden = selected !== 'ready'
  document.querySelector('#state-message').hidden = selected === 'ready'
  document.querySelector('#state-message').setAttribute('aria-busy', String(selected === 'loading'))
  const messages = {
    ready: ['Ready sample', 'Values are illustrative.'],
    loading: ['Loading this view', 'Please wait while the workspace loads.'],
    empty: ['Nothing to show yet', 'No records are available for this sample view. Restore the sample to continue reviewing the layout.'],
    error: ['Unable to load this view', 'The sample data is temporarily hidden. Try again to restore the view; your filters and notes are preserved.'],
    restricted: ['This view is restricted', 'Ask your workspace administrator about access. Actual authorization is enforced by the ERP.'],
  }
  const [title,description] = messages[selected]
  document.querySelector('#state-title').textContent = title
  document.querySelector('#state-description').textContent = description
  document.querySelector('#preview-status').textContent = `${title}. ${description}`
  document.querySelector('#retry').hidden = selected === 'restricted' || selected === 'loading'
  document.querySelector('#retry').textContent = selected === 'empty' ? 'Restore sample' : 'Try again'
}
stateSelect?.addEventListener('change', showState)
document.querySelector('#retry')?.addEventListener('click', () => { stateSelect.value = 'ready'; showState(); stateSelect.focus() })
const search = document.querySelector('#order-search')
const orderStatus = document.querySelector('#order-status')
const rows = [...document.querySelectorAll('[data-order]')]
function filterOrders() {
  let count = 0
  for (const row of rows) {
    row.hidden = !row.textContent.toLowerCase().includes(search.value.toLowerCase().trim()) || Boolean(orderStatus.value && orderStatus.value !== row.dataset.status)
    if (!row.hidden) count++
  }
  document.querySelector('#order-count').textContent = `${count} sample ${count === 1 ? 'order' : 'orders'}`
  document.querySelector('#orders-empty').hidden = count > 0
}
search?.addEventListener('input', filterOrders)
orderStatus?.addEventListener('change', filterOrders)
document.querySelector('#clear-orders')?.addEventListener('click', () => { search.value = ''; orderStatus.value = ''; filterOrders(); search.focus() })
document.querySelector('#sort-orders')?.addEventListener('click', event => {
  const th = event.currentTarget.closest('th')
  const ascending = th.getAttribute('aria-sort') !== 'ascending'
  th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending')
  const sorted = [...rows].sort((a,b) => a.cells[0].textContent.localeCompare(b.cells[0].textContent) * (ascending ? 1 : -1))
  sorted.forEach(row => row.parentElement.append(row))
  document.querySelector('#order-count').textContent = `Orders sorted ${ascending ? 'ascending' : 'descending'}. ${rows.filter(row => !row.hidden).length} sample orders.`
})
for (const button of document.querySelectorAll('[data-scope]')) button.addEventListener('click', () => {
  document.querySelectorAll('[data-scope]').forEach(item => item.setAttribute('aria-pressed', String(item === button)))
  let count = 0
  document.querySelectorAll('[data-task]').forEach(task => {
    task.hidden = button.dataset.scope !== 'all' && task.dataset[button.dataset.scope] !== 'true'
    if (!task.hidden) count++
  })
  document.querySelector('#task-count').textContent = `${count} sample tasks`
})
const form = document.querySelector('#detail-form')
const notes = document.querySelector('#receiving-notes')
function clearErrors() {
  notes.removeAttribute('aria-invalid')
  notes.setAttribute('aria-describedby', 'notes-help')
  document.querySelector('#notes-error').hidden = true
  document.querySelector('#save-error').hidden = true
}
notes?.addEventListener('input', clearErrors)
form?.addEventListener('submit', event => {
  event.preventDefault(); clearErrors()
  const status = document.querySelector('#save-status')
  if (!notes.value.trim()) {
    notes.setAttribute('aria-invalid','true'); notes.setAttribute('aria-describedby','notes-help notes-error')
    document.querySelector('#notes-error').hidden = false; status.textContent = 'Review receiving instructions.'; notes.focus(); return
  }
  const fail = document.querySelector('#fail-save')
  if (fail.checked) {
    fail.checked = false
    const error = document.querySelector('#save-error'); error.hidden = false; error.textContent = 'Sample save failed. Your notes are preserved. Select Save sample notes to retry.'
    status.textContent = 'Sample notes have not been saved.'; return
  }
  status.textContent = 'Sample notes saved in this page only. Reloading restores the example.'
})
form?.addEventListener('reset', () => { clearErrors(); document.querySelector('#save-status').textContent = 'Sample notes reset.' })
