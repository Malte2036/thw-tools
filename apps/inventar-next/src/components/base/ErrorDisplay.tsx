import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWErrorDisplay } from '@thw-tools/web-components';

// Define the ErrorDisplay props interface based on the web component properties
export interface ErrorDisplayProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Label/title for the error display
   * @default ""
   */
  label?: string;

  /**
   * Error object to display
   */
  error?: any;
}

/**
 * React wrapper for the thw-error-display web component.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   label="Failed to load data"
 *   error={new Error('Network error')}
 * />
 *
 * // Or with a custom error object
 * <ErrorDisplay
 *   label="API Error"
 *   error={{ status: 404, statusText: 'Not Found' }}
 * />
 * ```
 */
export const ErrorDisplay = createComponent({
  tagName: 'thw-error-display',
  elementClass: THWErrorDisplay,
  react: React,
  events: {},
});

export default ErrorDisplay;
