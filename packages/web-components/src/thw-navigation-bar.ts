import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { thwColors, grayColors } from "./colors";
import "./external-icon";

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

interface NavCategory {
  title: string;
  items: NavItem[];
  external?: boolean;
}

/**
 * A navigation bar component.
 * @param {string} logoUrl - The URL of the logo image.
 * @param {string} title - The title of the navigation bar.
 * @param {NavCategory[]} navItems - The navigation items to display.
 * @param {string} currentPath - The current path of the page.
 */
@customElement("thw-navigation-bar")
export class THWNavigationBar extends LitElement {
  @property({ type: String }) logoUrl: string = "";
  @property({ type: String }) title: string = "";
  @property({ type: Array }) navItems: NavCategory[] = [];
  @property({ type: String }) currentPath: string = "";
  @state() private isMenuOpen: boolean = false;

  static override styles = css`
    :host {
      display: block;
    }

    nav {
      border-bottom: 1px solid black;
    }

    .nav-container {
      width: 100%;
      max-width: 80rem;
      margin: 0 auto;
      padding: 0 0.5rem;
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      height: 4rem;
    }

    .logo-container {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }

    .logo {
      height: 3rem;
    }

    .site-title {
      font-size: 2.25rem;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .site-title {
        font-size: 1.875rem;
      }
    }

    @media (max-width: 640px) {
      .site-title {
        font-size: 1.5rem;
      }
    }

    .site-title:hover {
      color: ${unsafeCSS(thwColors[800])};
    }

    .desktop-nav {
      display: none;
      align-items: center;
    }

    @media (min-width: 768px) {
      .desktop-nav {
        display: flex;
      }
    }

    .nav-group {
      position: relative;
    }

    .nav-group-button {
      padding: 0.5rem 0.75rem;
      font-weight: bold;
      color: black;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.2s;
    }

    .nav-group-button:hover {
      color: ${unsafeCSS(thwColors[800])};
    }

    .external-indicator {
      font-size: 0.75rem;
      font-weight: normal;
      color: ${unsafeCSS(grayColors[500])};
    }

    .dropdown {
      position: absolute;
      right: 0;
      margin-top: 0.25rem;
      width: 16rem;
      background-color: white;
      border: 1px solid black;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      z-index: 50;
    }

    .nav-group:hover .dropdown {
      opacity: 1;
      visibility: visible;
    }

    .nav-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      color: black;
      text-decoration: none;
      transition: all 0.2s;
    }

    .nav-link:first-child {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    .nav-link:last-child {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    .nav-link:hover {
      background-color: ${unsafeCSS(thwColors[800])};
      color: white;
    }

    .nav-link.active {
      background-color: ${unsafeCSS(thwColors[50])};
      color: ${unsafeCSS(thwColors[800])};
    }

    .mobile-menu-button {
      display: flex;
      align-items: center;
      color: black;
      background: none;
      border: none;
      cursor: pointer;
      transition: color 0.2s;
    }

    @media (min-width: 768px) {
      .mobile-menu-button {
        display: none;
      }
    }

    .mobile-menu-button:hover {
      color: ${unsafeCSS(thwColors[800])};
    }

    .mobile-nav {
      border-top: 1px solid black;
      padding: 0.5rem 1rem;
    }

    .mobile-nav-title {
      font-weight: bold;
      font-size: 1.125rem;
      padding: 0.5rem 0;
    }
  `;

  public isActivePath(href: string): boolean {
    if (!href) return false;
    if (!this.currentPath) return href === "";

    const normalize = (path: string) => {
      return (
        path
          .toLowerCase()
          .split(/[?#]/)[0] // Remove query parameters and hashes
          .replace(/\/+/g, "/") // Replace multiple slashes with single slash
          .replace(/\/$/, "") || // Remove trailing slash
        "/"
      );
    };

    const currentPath = normalize(this.currentPath);
    const testHref = normalize(href);

    if (href.startsWith("http://") || href.startsWith("https://")) {
      return false; // External links are never active
    }

    // Build a list of nav item hrefs
    const navItemHrefs: string[] = [];
    const collectHrefs = (navItems: any[]) => {
      navItems.forEach((item) => {
        if (item.items) {
          collectHrefs(item.items);
        } else if (!item.external) {
          navItemHrefs.push(normalize(item.href));
        }
      });
    };
    collectHrefs(this.navItems);

    // Find all hrefs that are prefixes of currentPath
    const matchingHrefs = navItemHrefs.filter((navHref) =>
      currentPath.startsWith(navHref)
    );

    // If there are matching hrefs, pick the longest one
    let activeHref;
    if (matchingHrefs.length > 0) {
      activeHref = matchingHrefs.reduce((a, b) =>
        a.length >= b.length ? a : b
      );
    } else {
      // If no matching hrefs, activeHref is '/'
      activeHref = "/";
    }

    return testHref === activeHref;
  }

  private toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  override render() {
    return html`
      <nav>
        <div class="nav-container">
          <div class="nav-content">
            <a href="/" class="logo-container">
              ${this.logoUrl
                ? html`<img src=${this.logoUrl} class="logo" alt="Logo" />`
                : ""}
              <h1 class="site-title">${this.title}</h1>
            </a>

            <div class="desktop-nav">
              ${(this.navItems || []).map(
                (category) => html`
                  <div class="nav-group">
                    <button class="nav-group-button">
                      ${category.title}
                      ${category.external
                        ? html`<span class="external-indicator">(Extern)</span>`
                        : ""}
                    </button>
                    <div class="dropdown">
                      ${category.items.map(
                        (item) => html`
                          <a
                            href=${item.href}
                            target=${item.external ? "_blank" : ""}
                            rel=${item.external ? "noopener noreferrer" : ""}
                            class="nav-link ${this.isActivePath(item.href)
                              ? "active"
                              : ""}"
                          >
                            <span>${item.name}</span>
                            ${item.external
                              ? html`<thw-external-icon></thw-external-icon>`
                              : ""}
                          </a>
                        `
                      )}
                    </div>
                  </div>
                `
              )}
            </div>

            <button
              class="mobile-menu-button"
              @click=${this.toggleMenu}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          ${this.isMenuOpen
            ? html`
                <div class="mobile-nav">
                  ${(this.navItems || []).map(
                    (category) => html`
                      <div>
                        <div class="mobile-nav-title">
                          ${category.title}
                          ${category.external
                            ? html`<span class="external-indicator"
                                >(Extern)</span
                              >`
                            : ""}
                        </div>
                        ${category.items.map(
                          (item) => html`
                            <a
                              href=${item.href}
                              target=${item.external ? "_blank" : ""}
                              rel=${item.external ? "noopener noreferrer" : ""}
                              class="nav-link ${this.isActivePath(item.href)
                                ? "active"
                                : ""}"
                              @click=${() => (this.isMenuOpen = false)}
                            >
                              <span>${item.name}</span>
                              ${item.external
                                ? html`<thw-external-icon></thw-external-icon>`
                                : ""}
                            </a>
                          `
                        )}
                      </div>
                    `
                  )}
                </div>
              `
            : ""}
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "thw-navigation-bar": THWNavigationBar;
  }
}
