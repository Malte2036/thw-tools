import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWTable } from '@thw-tools/web-components';

// Define the Table props interface based on the web component properties
export type TableProps = React.HTMLAttributes<HTMLElement> & {
  /**
   * Array of header strings for the table columns
   */
  header?: string[];

  /**
   * Array of data rows (each row is an array of values)
   */
  values?: unknown[][];

  /**
   * Index of the currently selected row
   */
  selectedIndex?: number;

  /**
   * Height of the table in pixels
   */
  height?: number;
};

/**
 * React wrapper for the thw-table web component.
 *
 * @example
 * ```tsx
 * <Table
 *   header={['Name', 'Email', 'Role']}
 *   values={[
 *     ['John Doe', 'john@example.com', 'Admin'],
 *     ['Jane Smith', 'jane@example.com', 'User']
 *   ]}
 *   selectedIndex={0}
 *   onRowClick={(e) => console.log('Row clicked:', e.detail)}
 * />
 * ```
 */
export const Table = createComponent({
  tagName: 'thw-table',
  elementClass: THWTable,
  react: React,
  events: {
    onRowClick: 'row-click',
  },
});

export default Table;
