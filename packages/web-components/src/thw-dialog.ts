import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { thwColors } from "./colors";

/**
 * A dialog component.
 * @slot content - The content of the dialog.
 * @slot footer - The footer of the dialog.
 * @param {string} title - The title of the dialog.
 * @param {boolean} open - Whether the dialog is open.
 **/
@customElement("thw-dialog")
export class THWDialog extends LitElement {
  /**
   * The title of the dialog.
   * @type {string}
   */
  @property({ type: String }) title = "Dialog title";

  /**
   * Whether the dialog is open.
   * @type {boolean}
   * @default false
   */
  @property({ type: Boolean }) open = false;

  static override styles = [
    css`
      .outerWrapper {
        display: flex;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.8);

        .innerWrapper {
          display: flex;
          overflow: scroll;
          position: relative;
          padding: 1rem;
          margin: 1rem;
          flex-direction: column;
          gap: 0.5rem;
          border-radius: 0.375rem;
          max-width: 28rem;
          max-height: 100vh;
          background-color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          .title {
            font-size: 1.5rem;
            line-height: 2rem;

            color: ${unsafeCSS(thwColors[1000])};
            font-weight: bold;
          }

          .footer {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
            justify-content: space-between;
            width: 100%;
          }
        }
      }
    `,
  ];

  render() {
    console.log(this.open);

    if (!this.open) {
      return;
    }

    return html`
      <div class="outerWrapper">
        <div class="innerWrapper">
          <div class="title">${this.title}</div>

          <slot name="content" class="content"></slot>

          <slot name="footer" class="footer"></slot>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", (event) => {
      let outerWrapper = this.shadowRoot?.querySelector(".outerWrapper");
      let innerWrapper = this.shadowRoot?.querySelector(".innerWrapper");
      if (
        event.composedPath().includes(outerWrapper!) &&
        !event.composedPath().includes(innerWrapper!)
      ) {
        this.close();
      }
    });
  }

  close() {
    this.open = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-dialog": THWDialog;
  }
}
