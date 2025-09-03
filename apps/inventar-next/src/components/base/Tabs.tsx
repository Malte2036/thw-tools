import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWTabs } from '@thw-tools/web-components';

// Define the Tabs props interface based on the web component properties
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  /**
   * Array of tab item strings
   */
  items?: string[];

  /**
   * Callback function when a tab is selected
   */
  onSelect?: (item: string) => void;

  /**
   * Initially selected tab item
   */
  initialSelected?: string;
}

/**
 * React wrapper for the thw-tabs web component.
 *
 * @example
 * ```tsx
 * <Tabs
 *   items={['Tab 1', 'Tab 2', 'Tab 3']}
 *   initialSelected="Tab 1"
 *   onSelect={(item) => console.log('Selected:', item)}
 * />
 * ```
 */
export const Tabs = createComponent({
  tagName: 'thw-tabs',
  elementClass: THWTabs,
  react: React,
  events: {
    onSelect: 'select',
  },
});

export default Tabs;
