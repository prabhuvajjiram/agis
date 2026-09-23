# Component contracts: inputs, outputs and state

ASIG is framework neutral. The npm packages ship design tokens and CSS, not React
components, Angular directives, event emitters or reactive signals. The catalogue's
JavaScript demonstrates interactions; it is not a supported application runtime.

## How to read a contract

Each component usage guide lists inputs, outputs/events and state ownership. These are
requirements for a consuming product's adapter. Names such as `value-change` are conceptual
notifications, **not events dispatched by ASIG**. Defaults describe the recommended adapter
behavior unless explicitly identified as a native HTML default. CSS only responds to markup,
classes, attributes and native pseudo-classes; it cannot apply JavaScript defaults.

- **Input:** content, configuration or current state supplied to an adapter. Document its
  type, whether it is required, default, allowed values and clearing behavior.
- **Native event:** an event emitted by the browser, such as `input`, `change`, `submit` or
  `close`. Read the documented DOM property; payloads are not automatically business IDs.
- **Adapter output:** a recommended notification of user intent, with an explicit payload.
  The consuming framework chooses its callback or output name.
- **State:** identify who holds the authoritative value, who may change it and what happens
  during loading, rejection, cancellation and failure.
- **Signal:** a framework's reactive state mechanism. It is not an additional ASIG event type.

## Shared conventions

Use stable string IDs for options, rows, routes and actions. Labels are presentation, never
identity. Recommended adapter payloads use null for an explicitly cleared single value and
[] for no selected values; native HTML controls generally expose strings, so map that
boundary deliberately. Boolean inputs default to false unless their family says otherwise.
Do not coerce the string "false" to a true boolean attribute.

In a controlled adapter, the application supplies current state and receives a change
request. The adapter must not silently mutate authoritative state. Native controls may
change their own DOM state immediately: reconcile them with the accepted application state,
or restore the previous state on rejection. Avoid duplicate notifications when syncing
programmatic updates. Document any uncontrolled mode separately, including initialization
and reset; do not switch modes midway through a control's lifetime.

A request is not a completed operation. Product code owns authorization, validation,
network calls, idempotency, persistence and success/error feedback. Busy/disabled styling
does not enforce these rules. Native disabled controls suppress interaction and are omitted
from FormData; aria-disabled requires a handler guard. Keep draft values after failure.

Native events have their browser-defined timing and propagation; recommended adapter
callbacks make no promise to bubble, be cancelable or cross shadow roots. If a product uses
CustomEvent, document its name, detail schema, bubbles/composed/cancelable options and
cancellation behavior. Do not invent an `asig:*` event API that the CSS does not implement.

## Framework mapping

| Concept | React / Next.js adapter | Angular adapter | Plain HTML / JavaScript |
| --- | --- | --- | --- |
| Inputs | Props such as value, disabled, label | Component inputs | Attributes, DOM properties and application data |
| User intent | Callback props such as onValueChange | Component outputs with documented payloads | Native listeners or explicitly implemented custom events |
| Current state | Application state/store | Application state, including signals where chosen | DOM state or a product-owned store |
| Styling | className and data-/ARIA attributes | Classes and attribute/property bindings | Classes and attributes |
| Interaction runtime | Client-side adapter; Next.js interactive boundary follows the app's conventions | Component implementation or established accessible primitive | Native behavior plus explicit JavaScript |

Import the token CSS before pattern CSS once at the application's global style entry point.
Do not load the catalogue demo scripts into a production application. No framework runtime
is included in either npm package. An accessible primitive may supply focus and keyboard
behavior while ASIG supplies styling. Document the supported framework/browser versions in
the consuming product, not as untested compatibility promises here.

## Example: native Select contract

The adapter receives `options`, a selected `value`, a label and optional `disabled` state.
It reports a proposed selected ID; it does not fetch or save a customer record itself.
This plain JavaScript example shows a product-owned synchronous acceptance policy:

```html
<label for="delivery-method">Delivery method</label>
<select id="delivery-method" class="as-select">
  <option value="">Choose a method</option>
  <option value="pickup">Pickup</option>
  <option value="delivery">Delivery</option>
</select>
```

```js
const control = document.querySelector('#delivery-method')
let selectedId = null // Product-owned state; null means explicitly unselected.
function requestValueChange({ value }) {
  const accepted = value === null || ['pickup', 'delivery'].includes(value)
  if (accepted) selectedId = value
  control.value = selectedId ?? '' // Reconcile even when a request is rejected.
}
control.addEventListener('change', event => {
  requestValueChange({ value: event.currentTarget.value || null })
})
```

React/Next.js could expose the same request through an `onValueChange` callback; Angular
could expose it through a component output. Those names belong to the adapter. An Angular
signal may hold selectedId, but changing a signal is not proof that persistence succeeded.
Native select `change` is a commit event; React's text-input onChange convention should not
be assumed to have identical timing for every native control.

## Family contracts

| Usage guide | Components |
| --- | --- |
| [Actions](ACTIONS.md#inputs-outputs-and-state) | Buttons, link actions, icon actions |
| [Forms](FORMS.md#inputs-outputs-and-state) | Fields, text inputs, textarea, form, validation summary |
| [Selection](SELECTION.md#inputs-outputs-and-state) | Select, Combobox, multi-select adapter boundary |
| [Choices](CHOICES.md#inputs-outputs-and-state) | Checkbox, radio, switch |
| [Navigation](NAVIGATION.md#inputs-outputs-and-state) | Links, breadcrumbs, sidebar, rail, tabs, view switcher, pagination |
| [Data display](DATA_DISPLAY.md#inputs-outputs-and-state) | Cards, description lists, tables, grid adapter boundary |
| [Disclosure](DISCLOSURE.md#inputs-outputs-and-state) | Details, tooltip, popover |
| [Overlays](OVERLAYS.md#inputs-outputs-and-state) | Menus, dialog, confirmation |
| [Feedback](FEEDBACK.md#inputs-outputs-and-state) | Alert, status, toast, loading, skeleton, empty/error state |
| [Specialized inputs](SPECIALIZED_INPUTS.md#inputs-outputs-and-state) | File upload, date, time, local date-time |

Typography, page layout and decorative surfaces receive semantic content, classes and token
values; they emit no events. Actions nested inside them retain their own contracts. See
[typography](TYPOGRAPHY.md), [page composition](PAGE_DESIGN.md) and
[visual expression](VISUAL_EXPRESSION.md) for those presentation inputs.

## Adapter review checklist

Every product adapter must document required inputs/types/defaults, supported variants,
output payloads/timing, state ownership, disabled/busy behavior, validation and error recovery.
Verify one user interaction emits one intent, programmatic synchronization does not loop,
clearing/reset works, IDs remain stable after sorting/filtering, and keyboard behavior matches
the family guide. Test delayed/rejected requests and stale responses where asynchronous data
is involved. A CSS or catalogue test does not establish product adapter conformance.
