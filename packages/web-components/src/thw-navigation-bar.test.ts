import { describe, test, expect, beforeEach } from "vitest";
import { fixture, html } from "@open-wc/testing";
import "./thw-navigation-bar";
import { THWNavigationBar } from "./thw-navigation-bar";

describe("THWNavigationBar", () => {
  let navbar: THWNavigationBar;

  beforeEach(async () => {
    // Create a new instance using fixture
    navbar = await fixture<THWNavigationBar>(
      html`<thw-navigation-bar></thw-navigation-bar>`
    );

    // Wait for element to be updated
    await navbar.updateComplete;

    // Set up common navigation items
    navbar.navItems = [
      {
        title: "Main",
        items: [
          { name: "Home", href: "/" },
          { name: "Quiz", href: "/quiz/" },
          { name: "Test", href: "/test/" },
          { name: "Test Bar", href: "/test/bar/" },
          { name: "External", href: "https://example.com", external: true },
        ],
      },
    ];

    // Wait for another update after setting navItems
    await navbar.updateComplete;
  });

  describe("isActivePath", () => {
    test("should handle home path cases", () => {
      navbar.currentPath = "/foo";
      expect(navbar.isActivePath("/")).toBe(true);
      navbar.currentPath = "/quiz/";
      expect(navbar.isActivePath("/")).toBe(false);
    });

    test("should handle section paths", () => {
      navbar.currentPath = "/quiz/agt/1";
      expect(navbar.isActivePath("/quiz/")).toBe(true);
      expect(navbar.isActivePath("/test/")).toBe(false);
      expect(navbar.isActivePath("/")).toBe(false);
    });

    test("should handle exact matches for leaf paths", () => {
      navbar.currentPath = "/test/bar";
      expect(navbar.isActivePath("/test/bar/")).toBe(true);
      expect(navbar.isActivePath("/test/")).toBe(false);
      expect(navbar.isActivePath("/")).toBe(false);
    });

    test("should handle external links", () => {
      navbar.currentPath = "https://example.com";
      expect(navbar.isActivePath("https://example.com")).toBe(false);
    });

    test("should handle edge cases", () => {
      // Null/undefined cases
      navbar.currentPath = "";
      expect(navbar.isActivePath(null as unknown as string)).toBe(false);

      // Query params and hashes
      navbar.currentPath = "/quiz/agt/1?param=value#section";
      expect(navbar.isActivePath("/quiz/")).toBe(true);

      // Case sensitivity
      navbar.currentPath = "/QUIZ/AGT/1";
      expect(navbar.isActivePath("/quiz/")).toBe(true);

      // Multiple slashes
      navbar.currentPath = "///quiz///agt///1///";
      expect(navbar.isActivePath("/quiz/")).toBe(true);
    });
  });
});
