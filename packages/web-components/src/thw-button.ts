import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TailwindElement } from "./shared/tailwind.element";

@customElement("thw-button")
export class THWButton extends TailwindElement("") {
  @property({ type: String }) type = "primary";
  @property({ type: Boolean }) disabled = false;

  render() {
    return html`
      <button
        class="${this.type === "primary"
          ? "bg-thw text-white hover:bg-thw-800"
          : "border-2 border-thw bg-white hover:bg-thw-100 text-thw disabled:text-gray-400 disabled:border-gray-400"} rounded-md px-2 py-1"
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `;
  }
}
