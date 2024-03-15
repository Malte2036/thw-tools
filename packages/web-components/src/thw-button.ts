import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { thwColors, grayColors } from "./colors";

/**
 * A button component.
 * @slot - The content of the button.
 * @param {string} type - The type of the button. Can be "primary" or "secondary".
 * @param {boolean} disabled - Whether the button is disabled.
 * @param {string} size - The size of the button. Can be "small", "medium", or "large".
 */
@customElement("thw-button")
export class THWButton extends LitElement {
  /**
   * The type of the button.
   * @type {"primary" | "secondary"}
   * @default "primary"
   */
  @property({ type: String }) type: "primary" | "secondary" = "primary";

  /**
   * Whether the button is disabled.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean }) disabled: boolean = false;

  /**
   * The size of the button.
   * @type {"small"| "medium" | "large"}
   * @default "medium"
   */
  @property({ type: String }) size: "small" | "medium" | "large" = "medium";

  static override styles = [
    css`
      button {
        background-color: ${unsafeCSS(thwColors[1000])};
        color: white;

        border-color: ${unsafeCSS(thwColors[1000])};

        border-radius: 0.5rem;
        border-width: 1px;
        padding: 0.5rem 1rem;
        cursor: pointer;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;

        width: 100%;

        font-size: 1rem;
        line-height: 1.5rem;

        &.small {
          font-size: 0.75rem;
          line-height: 1.25rem;
          padding: 0.25rem 0.5rem;
        }

        &.large {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }

        &:hover {
          background-color: ${unsafeCSS(thwColors[900])};
        }

        &:disabled {
          cursor: not-allowed;
          background-color: white;
          color: ${unsafeCSS(grayColors[400])};

          border-color: black;
        }

        &.secondary {
          background-color: white;
          color: ${unsafeCSS(thwColors[1000])};

          border-color: ${unsafeCSS(thwColors[1000])};

          &:hover {
            background-color: ${unsafeCSS(thwColors[100])};
          }

          &:disabled {
            color: ${unsafeCSS(grayColors[400])};
            border-color: ${unsafeCSS(grayColors[400])};
          }
        }
      }
    `,
  ];

  override render() {
    return html`
      <button ?disabled=${this.disabled} class=${`${this.type} ${this.size}`}>
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-button": THWButton;
  }
}
