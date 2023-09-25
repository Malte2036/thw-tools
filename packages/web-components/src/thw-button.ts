import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { thwColors, grayColors } from "./colors";

@customElement("thw-button")
export class THWButton extends LitElement {
  @property({ type: String }) type = "primary";
  @property({ type: Boolean }) disabled = false;

  @property({ type: String }) size = "normal";

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

        &.big {
          font-size: 1.25rem;
          line-height: 1.75rem;
        }

        &:hover {
          background-color: ${unsafeCSS(thwColors[800])};
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
