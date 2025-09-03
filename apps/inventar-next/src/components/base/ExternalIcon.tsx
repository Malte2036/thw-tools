import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWExternalIcon } from '@thw-tools/web-components';

// Define the ExternalIcon props interface
export interface ExternalIconProps extends React.HTMLAttributes<HTMLElement> {
  // No additional props needed for the external icon
}

/**
 * React wrapper for the thw-external-icon web component.
 *
 * @example
 * ```tsx
 * <ExternalIcon />
 *
 * // Or with custom styling
 * <ExternalIcon className="my-custom-icon" />
 * ```
 */
export const ExternalIcon = createComponent({
  tagName: 'thw-external-icon',
  elementClass: THWExternalIcon,
  react: React,
  events: {},
});

export default ExternalIcon;
