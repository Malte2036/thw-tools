import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { thwColors, grayColors } from "./colors";

/**
 * A tabs component.
 * @param {string[]} items - The items of the tabs.
 * @param {Function} onSelect - The callback function when a tab is selected.
 */
@customElement("thw-tabs")
export class THWTabs extends LitElement {
  /**
   * The items of the tabs.
   * @type {string[]}
   * @default []
   */
  @property({ type: Array }) items: string[] = [];

  /**
   * The callback function when a tab is selected.
   * @type {Function}
   */
  @property({ attribute: false }) onSelect: (item: string) => void = () => {};

  static override styles = [
    css`
      .tabs {
        display: flex;
        gap: 0.25rem;

        background-color: ${unsafeCSS(grayColors[200])};
        padding: 0.25rem;

        border-radius: 0.5rem;
        border-color: ${unsafeCSS(grayColors[200])};

        width: fit-content;

        button {
          background-color: ${unsafeCSS(grayColors[400])};
          color: white;

          border-radius: 0.5rem;
          border-width: 0px;

          padding: 0.5rem 1rem;
          cursor: pointer;

          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;

          &.selected {
            background-color: ${unsafeCSS(thwColors[900])};
            border-color: ${unsafeCSS(thwColors[900])};
          }
        }
      }
    `,
  ];

  override render() {
    return html`
      <div class="tabs">
        ${this.items.map(
          (item) => html`
            <button
              class=${this.selectedItem === item ? "selected" : ""}
              @click=${() => this.selectItem(item)}
            >
              ${item}
            </button>
          `
        )}
      </div>
    `;
  }

  private selectedItem: string | null = null;

  private selectItem(item: string) {
    this.selectedItem = item;

    this.requestUpdate();

    // Call the onSelect callback
    this.onSelect(item);
  }

  connectedCallback() {
    super.connectedCallback();

    this.selectedItem = this.items[0];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-tabs": THWTabs;
  }
}
