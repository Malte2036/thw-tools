import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { thwColors } from "./colors";
import { virtualize } from "@lit-labs/virtualizer/virtualize.js";

/**
 * A table component.
 * @param {string[]} header - The header of the table.
 * @param {string[][]} values - The values of the table.
 * @param {number | undefined} selectedIndex - The index of the selected row.
 * @param {number | undefined} maxHeight - The maximum height of the table.
 *
 * @fires {CustomEvent} row-click - Fired when a row is clicked.
 * @property {Object} event.detail
 * @property {string[]} event.detail.row - The data of the clicked row.
 * @property {number} event.detail.index - The index of the clicked row.
 */
@customElement("thw-table")
export class THWTable extends LitElement {
  @property({ type: Array }) header: string[] = [];
  @property({ type: Array }) values: string[][] = [];
  @property({ type: Number }) selectedIndex?: number;
  @property({ type: Number }) maxHeight?: number;

  static override styles = css`
    .table-wrapper {
      width: 100%;
    }
    table {
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    tbody {
      height: 600px;
    }
    tr {
      display: flex;
      width: 100%;
    }
    th,
    td {
      padding: 0.5rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      flex: 1;
    }
    th {
      background-color: ${unsafeCSS(thwColors[100])};
      color: ${unsafeCSS(thwColors[900])};
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    tr:hover {
      background-color: ${unsafeCSS(thwColors[200])};
    }
    tr.selected {
      background-color: ${unsafeCSS(thwColors[700])};
      color: white;
    }
    th:first-child {
      border-top-left-radius: 0.5rem;
    }
    th:last-child {
      border-top-right-radius: 0.5rem;
    }
    tr:hover:not(.selected) td {
      cursor: pointer;
    }
  `;

  override render() {
    return html`
      <div
        class="table-wrapper"
        style=${this.maxHeight ? `max-height: ${this.maxHeight}px;` : ""}
      >
        <table>
          <thead>
            <tr>
              ${(this.header || []).map((title) => html`<th>${title}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${virtualize({
              scroller: true,
              items: this.values,
              renderItem: (row, index) => html`
                <tr
                  class=${this.selectedIndex === index ? "selected" : ""}
                  @click=${() => this.handleRowClick(row, index)}
                >
                  ${row.map((cell) => html`<td>${cell}</td>`)}
                </tr>
              `,
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  private handleRowClick(row: string[], index: number) {
    this.selectedIndex = index;
    this.dispatchEvent(
      new CustomEvent("row-click", {
        detail: { row, index },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-table": THWTable;
  }
}
