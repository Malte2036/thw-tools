'use client';

import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWNavigationBar } from '@thw-tools/web-components';

// Define navigation item types
export interface NavigationItem {
  name: string;
  href: string;
  external?: boolean;
}

export interface NavigationGroup {
  title: string;
  items: NavigationItem[];
  external?: boolean;
}

// Define the NavigationBar props interface based on the web component properties
export interface NavigationBarProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * URL to the logo image
   */
  logoUrl?: string;

  /**
   * Title of the site
   */
  title?: string;

  /**
   * Array of navigation groups
   */
  navItems?: NavigationGroup[];

  /**
   * Current path for active state highlighting
   */
  currentPath?: string;
}

/**
 * React wrapper for the thw-navigation-bar web component.
 *
 * @example
 * ```tsx
 * <NavigationBar
 *   logoUrl="/logo.png"
 *   title="My App"
 *   currentPath="/dashboard"
 *   navItems={[
 *     {
 *       title: "Main",
 *       items: [
 *         { name: "Dashboard", href: "/dashboard" },
 *         { name: "Profile", href: "/profile" }
 *       ]
 *     },
 *     {
 *       title: "External",
 *       external: true,
 *       items: [
 *         { name: "Documentation", href: "https://docs.example.com", external: true }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export const NavigationBar = createComponent({
  tagName: 'thw-navigation-bar',
  elementClass: THWNavigationBar,
  react: React,
  events: {},
});

export default NavigationBar;
