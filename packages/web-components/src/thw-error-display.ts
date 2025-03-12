import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * A component to display a label and an error message.
 * @param {string} label - The label to display.
 * @param {Error | null} error - The error object to display details from.
 */
@customElement("thw-error-display")
export class THWErrorDisplay extends LitElement {
  /**
   * The label to display.
   * @type {string}
   */
  @property({ type: String }) label: string = "";

  /**
   * The error object to display details from.
   * @type {Error | null}
   */
  @property({ type: Object }) error: Error | null = null;

  static override styles = css`
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }
    .label {
      font-size: 1.25rem;
      line-height: 1.75rem;
      font-weight: 700;
    }
    .error-message {
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: #6b7280;
    }
  `;

  override render() {
    console.log(this.error);

    return html`
      <div class="container">
        <h1 class="label">${this.label}</h1>
        ${this.error
          ? html`
              <p class="error-message">
                ${"status" in this.error && this.error.status
                  ? html`
                      Statuscode: ${this.error.status}
                      ${"statusText" in this.error && this.error.statusText
                        ? `- ${this.error.statusText}`
                        : ""}
                    `
                  : this.error.message
                  ? this.error.message
                  : "Unbekannter Fehler"}
              </p>
            `
          : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-error-display": THWErrorDisplay;
  }
}
