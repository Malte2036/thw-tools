import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { thwColors } from './colors';
import { virtualize } from '@lit-labs/virtualizer/virtualize.js';

/**
 * A table component.
 * @param {string[]} header - The header of the table.
 * @param {(string | TemplateResult | HTMLElement)[][]} values - The values of the table.
 * @param {number | undefined} selectedIndex - The index of the selected row.
 * @param {number | undefined} height - The maximum height of the table.
 *
 * @fires {CustomEvent} row-click - Fired when a row is clicked.
 * @property {Object} event.detail
 * @property {(string | TemplateResult | HTMLElement)[]} event.detail.row - The data of the clicked row.
 * @property {number} event.detail.index - The index of the clicked row.
 */
@customElement('thw-table')
export class THWTable extends LitElement {
  @property({ type: Array }) header: string[] = [];
  @property({ type: Array }) values: (string | TemplateResult | HTMLElement)[][] = [];
  @property({ type: Number }) selectedIndex?: number;
  @property({ type: Number }) height?: number;

  static override styles = css`
    .table-wrapper {
      overflow: auto;
    }
    table {
      width: 100%;
      height: 100%;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      table-layout: fixed;
      min-width: max-content;

      border-collapse: collapse;
      border-radius: 0.5rem;

      & tr,
      & th,
      & td {
        display: flex;
        min-width: 150px;
        flex: 1;
      }

      & th,
      & td {
        display: flex;
        min-width: 150px;
        flex: 1;
        padding: 0.5rem 1rem;
        width: 100%;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
        overflow: hidden;

        /* Text specific handling */
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
        white-space: normal;

        /* All content handling */
        & > * {
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
      }

      & th {
        background-color: ${unsafeCSS(thwColors[100])};
        color: ${unsafeCSS(thwColors[900])};
        font-weight: 600;
        position: sticky;
        top: 0;
        z-index: 1;

        & :first-child {
          border-top-left-radius: 0.5rem;
        }
        & :last-child {
          border-top-right-radius: 0.5rem;
        }
      }
      & tr {
        width: 100%;
        display: flex;
        align-items: stretch;
        transition:
          background-color 0.2s,
          color 0.2s;

        &:hover {
          background-color: ${unsafeCSS(thwColors[200])};
        }

        &.selected {
          background-color: ${unsafeCSS(thwColors[700])};
          color: white;
        }

        & :hover:not(.selected) td {
          cursor: pointer;
        }
      }

      & tbody {
        min-height: 250px !important;
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  `;

  override render() {
    return html`
      <div class="table-wrapper" style=${this.height ? `height: ${this.height}px;` : ''}>
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
              renderItem: (row: (string | TemplateResult | HTMLElement)[], index: number) => html`
                <tr
                  class=${this.selectedIndex === index ? 'selected' : ''}
                  @click=${() => this.handleRowClick(row, index)}
                >
                  ${(this.header || []).map((_, i) => html`<td>${row[i]}</td>`)}
                </tr>
              `,
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  private handleRowClick(row: (string | TemplateResult | HTMLElement)[], index: number) {
    this.selectedIndex = index;
    this.dispatchEvent(
      new CustomEvent('row-click', {
        detail: { row, index },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'thw-table': THWTable;
  }
}
