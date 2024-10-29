import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { thwColors } from "./colors";

/**
 * A table component.
 * @param {string[]} header - The header of the table.
 * @param {string[][]} values - The values of the table.
 * @param {Function} onValueClick - The callback function when a table row is clicked.
 * @param {number | undefined} selectedIndex - The index of the selected row.
 */
@customElement("thw-table")
export class THWTable extends LitElement {
  @property({ type: Array }) header: string[] = [];
  @property({ type: Array }) values: string[][] = [];
  @property({ attribute: false }) onValueClick?: (
    row: string[],
    index: number
  ) => void;
  @property({ type: Number }) selectedIndex?: number;

  static override styles = css`
    .overflow-x-auto {
      overflow-x: auto;
    }
    .max-h-600 {
      max-height: 600px;
      overflow: auto;
    }
    table {
      min-width: 100%;
      border-collapse: collapse;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 0.5rem;
    }
    th,
    td {
      padding: 0.5rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    th {
      background-color: ${unsafeCSS(thwColors[100])};
      color: ${unsafeCSS(thwColors[900])};
      font-weight: 600;
    }
    tr {
      transition: background-color 0.2s, color 0.2s;
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
      <div class="overflow-x-auto">
        <div class="max-h-600">
          <table>
            <thead>
              <tr>
                ${this.header.map((title) => html`<th>${title}</th>`)}
              </tr>
            </thead>
            <tbody>
              ${this.values.map(
                (row, index) => html`
                  <tr
                    class=${this.selectedIndex === index ? "selected" : ""}
                    @click=${() => this.handleRowClick(row, index)}
                  >
                    ${this.header.map((_, i) => html`<td>${row[i]}</td>`)}
                  </tr>
                `
              )}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  private handleRowClick(row: string[], index: number) {
    if (this.onValueClick) {
      this.selectedIndex = index;
      this.onValueClick(row, index);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-table": THWTable;
  }
}
