import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { thwColors } from "./colors";

/**
 * A loading spinner component.
 */
@customElement("thw-loading-spinner")
export class THWLoadingSpinner extends LitElement {
  static override styles = [
    css`
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .spinner {
        border: 0.2em solid transparent;
        border-bottom: 0.2em solid ${unsafeCSS(thwColors[1000])};
        border-radius: 50%;
        width: 2em;
        height: 2em;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ];

  override render() {
    return html`
      <div class="spinner-container">
        <div class="spinner "></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-loading-spinner": THWLoadingSpinner;
  }
}
