import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWLoadingSpinner } from '@thw-tools/web-components';

// Define the LoadingSpinner props interface
export type LoadingSpinnerProps = React.HTMLAttributes<HTMLElement>;

/**
 * React wrapper for the thw-loading-spinner web component.
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 *
 * // Or with custom styling
 * <LoadingSpinner className="my-custom-spinner" />
 * ```
 */
export const LoadingSpinner = createComponent({
  tagName: 'thw-loading-spinner',
  elementClass: THWLoadingSpinner,
  react: React,
  events: {},
});

export default LoadingSpinner;
