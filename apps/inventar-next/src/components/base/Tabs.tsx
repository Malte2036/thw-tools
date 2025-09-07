import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWTabs } from '@thw-tools/web-components';

// Define the Tabs props interface based on the web component properties
export interface TabsProps<T> extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  /**
   * Array of tab item strings
   */
  items?: T[];

  /**
   * Callback function when a tab is selected
   */
  onSelect?: (item: CustomEvent<T>) => void;

  /**
   * Initially selected tab item
   */
  initialSelected?: T;
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
