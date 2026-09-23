"use client";
import { useState } from "react";
import { orders } from "./orders";

// Product adapter: values in, change requests out. ASIG supplies the styling.
function OrderFilters({ query, stage, onQueryChange, onStageChange, onReset }) {
  return (
    <form
      className="as-page-toolbar"
      role="search"
      aria-label="Filter orders"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="as-field">
        <label className="as-field__label" htmlFor="query">
          Find an order
        </label>
        <input
          className="as-control"
          id="query"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Order or customer"
        />
      </div>
      <div className="as-field">
        <label className="as-field__label" htmlFor="stage">
          Stage
        </label>
        <select
          className="as-select"
          id="stage"
          value={stage}
          onChange={(event) => onStageChange(event.target.value)}
        >
          <option value="all">All stages</option>
          <option value="review">Needs review</option>
          <option value="ready">Ready</option>
        </select>
      </div>
      <button
        className="as-button"
        data-variant="secondary"
        type="button"
        onClick={onReset}
      >
        Reset filters
      </button>
    </form>
  );
}
export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("all");
  const [theme, setTheme] = useState("operations");
  const visible = orders.filter(
    (order) =>
      `${order.id} ${order.customer}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (stage === "all" || order.stage === stage),
  );
  return (
    <div className="as-workspace starter" data-as-theme={theme}>
      <a className="as-skip-link" href="#content">
        Skip to orders
      </a>
      <main className="as-workspace__main" id="content" tabIndex="-1">
        <header className="as-page-header">
          <div className="as-page-header__identity">
            <p className="as-page-text" data-role="caption">
              ASIG / STARTER
            </p>
            <h1 className="as-page-text" data-role="page-title">
              Orders
            </h1>
            <p className="as-page-text" data-role="page-subtitle">
              A working screen. Your framework. One design language.
            </p>
          </div>
          <div className="as-field">
            <label className="as-field__label" htmlFor="theme">
              Theme
            </label>
            <select
              className="as-select"
              id="theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            >
              <option value="operations">Operations</option>
              <option value="operations-dark">Operations dark</option>
              <option value="cad">CAD</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </header>
        <section className="as-page-panel" aria-label="Order workspace">
          <OrderFilters
            query={query}
            stage={stage}
            onQueryChange={setQuery}
            onStageChange={setStage}
            onReset={() => {
              setQuery("");
              setStage("all");
            }}
          />
          <p role="status" aria-live="polite">
            {visible.length} of {orders.length} orders
          </p>
          <div
            className="as-page-table-region"
            tabIndex="0"
            role="region"
            aria-label="Scrollable order table"
          >
            <table className="as-page-table">
              <caption className="starter-caption">
                Sample customer orders
              </caption>
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Stage</th>
                  <th scope="col" data-numeric>
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => (
                  <tr key={order.id}>
                    <td data-identifier>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>
                      {order.stage === "ready" ? "Ready" : "Needs review"}
                    </td>
                    <td data-numeric>{order.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {visible.length === 0 && (
            <p>No orders match. Try another search or reset the filters.</p>
          )}
        </section>
        <footer>
          <p className="starter-note">
            Invented sample data. Filtering stays in this browser; no backend or
            persistence.
          </p>
          <nav className="starter-footer" aria-label="Learning resources">
            <a href="https://prabhuvajjiram.github.io/agis/">
              Component catalogue
            </a>
            <a href="https://github.com/prabhuvajjiram/agis/blob/v0.7.0/docs/COMPONENT_CONTRACTS.md">
              Inputs, outputs and state
            </a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
