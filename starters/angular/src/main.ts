import { Component, computed, input, output, signal } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";

@Component({
  selector: "app-order-filters",
  standalone: true,
  template: ` <form
    class="as-page-toolbar"
    role="search"
    aria-label="Filter orders"
    (submit)="$event.preventDefault()"
  >
    <div class="as-field">
      <label class="as-field__label" for="query">Find an order</label
      ><input
        #search
        class="as-control"
        id="query"
        type="search"
        [value]="query()"
        (input)="queryChange.emit(search.value)"
        placeholder="Order or customer"
      />
    </div>
    <div class="as-field">
      <label class="as-field__label" for="stage">Stage</label
      ><select
        #status
        class="as-select"
        id="stage"
        [value]="stage()"
        (change)="stageChange.emit(status.value)"
      >
        <option value="all">All stages</option>
        <option value="review">Needs review</option>
        <option value="ready">Ready</option>
      </select>
    </div>
    <button
      class="as-button"
      data-variant="secondary"
      type="button"
      (click)="resetRequested.emit()"
    >
      Reset filters
    </button>
  </form>`,
})
class OrderFilters {
  // Product adapter: inputs and outputs are Angular APIs, not ASIG exports.
  query = input.required<string>();
  stage = input.required<string>();
  queryChange = output<string>();
  stageChange = output<string>();
  resetRequested = output<void>();
}
@Component({
  selector: "app-root",
  standalone: true,
  imports: [OrderFilters],
  templateUrl: "./app.html",
})
class App {
  orders = [
    {
      id: "SO-1042",
      customer: "Northstar Studio",
      stage: "review",
      quantity: 12,
    },
    { id: "SO-1043", customer: "Cedar Works", stage: "ready", quantity: 8 },
    { id: "SO-1044", customer: "Harbor Design", stage: "ready", quantity: 16 },
  ];
  query = signal("");
  stage = signal("all");
  theme = signal("operations");
  visible = computed(() =>
    this.orders.filter(
      (order) =>
        `${order.id} ${order.customer}`
          .toLowerCase()
          .includes(this.query().trim().toLowerCase()) &&
        (this.stage() === "all" || order.stage === this.stage()),
    ),
  );
  reset() {
    this.query.set("");
    this.stage.set("all");
  }
}
bootstrapApplication(App).catch(console.error);
