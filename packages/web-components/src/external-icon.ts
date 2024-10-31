import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("thw-external-icon")
export class THWExternalIcon extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      width: 1rem;
      height: 1rem;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `;

  override render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-external-icon": THWExternalIcon;
  }
}
