import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { thwColors, grayColors } from "./colors";

@customElement("thw-button")
export class THWButton extends LitElement {
  @property({ type: String }) type = "primary";
  @property({ type: Boolean }) disabled = false;

  static styles = [
    css`
      button {
        background-color: ${unsafeCSS(thwColors[1000])};
        color: white;

        border-color: ${unsafeCSS(thwColors[1000])};

        border-radius: 0.25rem;
        border-width: 1px;
        padding: 0.5rem 1rem;
        cursor: pointer;

        &:hover {
          background-color: ${unsafeCSS(thwColors[800])};
        }

        &:disabled {
          cursor: not-allowed;
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

  render() {
    return html`
      <button ?disabled=${this.disabled} class=${this.type}>
        <slot></slot>
      </button>
    `;
  }
}
