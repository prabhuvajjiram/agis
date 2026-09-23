import "./style.css";
import { orders } from "./orders.js";
const query = document.querySelector("#query");
const stage = document.querySelector("#stage");
const rows = document.querySelector("#rows");
function render() {
  const term = query.value.trim().toLowerCase();
  const visible = orders.filter(
    (order) =>
      `${order.id} ${order.customer}`.toLowerCase().includes(term) &&
      (stage.value === "all" || order.stage === stage.value),
  );
  rows.replaceChildren(
    ...visible.map((order) => {
      const tr = document.createElement("tr");
      for (const [index, value] of [
        order.id,
        order.customer,
        order.stage === "ready" ? "Ready" : "Needs review",
        order.quantity,
      ].entries()) {
        const cell = document.createElement("td");
        cell.textContent = String(value);
        if (index === 0) cell.dataset.identifier = "";
        if (index === 3) cell.dataset.numeric = "";
        tr.append(cell);
      }
      return tr;
    }),
  );
  document.querySelector("#result-count").textContent =
    `${visible.length} of ${orders.length} orders`;
  document.querySelector("#empty").hidden = visible.length > 0;
}
query.addEventListener("input", render);
stage.addEventListener("change", render);
document
  .querySelector("#filters")
  .addEventListener("submit", (event) => event.preventDefault());
document.querySelector("#filters").addEventListener("reset", () => {
  query.value = "";
  stage.value = "all";
  render();
});
document.querySelector("#theme").addEventListener("change", (event) => {
  document.querySelector("#app").dataset.asTheme = event.currentTarget.value;
});
render();
