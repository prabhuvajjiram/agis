const form = document.querySelector('#procurement-form')
const instructions = document.querySelector('#instructions')
const fieldError = document.querySelector('#instructions-error')
const saveError = document.querySelector('#save-error')
const status = document.querySelector('#save-status')
const failure = document.querySelector('#simulate-failure')

document.querySelector('#theme-select').addEventListener('change', event => {
  document.body.dataset.asTheme = event.target.value
})

function clearErrors() {
  fieldError.hidden = true
  saveError.hidden = true
  instructions.removeAttribute('aria-invalid')
  instructions.setAttribute('aria-describedby', 'instructions-help')
}
instructions.addEventListener('input', clearErrors)
form.addEventListener('reset', () => {
  clearErrors()
  failure.checked = false
  status.textContent = 'Sample draft reset. No ERP records changed.'
})
form.addEventListener('submit', event => {
  event.preventDefault()
  clearErrors()
  if (!instructions.value.trim()) {
    fieldError.hidden = false
    instructions.setAttribute('aria-invalid', 'true')
    instructions.setAttribute('aria-describedby', 'instructions-help instructions-error')
    status.textContent = 'Review receiving instructions.'
    instructions.focus()
    return
  }
  if (failure.checked) {
    failure.checked = false
    saveError.hidden = false
    saveError.textContent = 'Sample save failed. Your values are preserved. Select Save sample draft to retry.'
    status.textContent = 'Sample draft has not been saved.'
    return
  }
  status.textContent = 'Sample draft saved in this page only. Reloading restores the example.'
})
