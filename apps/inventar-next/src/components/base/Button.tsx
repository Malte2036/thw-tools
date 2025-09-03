import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWButton } from '@thw-tools/web-components';

// Define the Button props interface based on the web component properties
export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant of the button.
   * @default "primary"
   */
  type?: 'primary' | 'secondary' | 'warning';

  /**
   * Size of the button.
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
}

// Create a React wrapper for the thw-button web component
/**
 * React wrapper for the thw-button web component.
 *
 * @example
 * ```tsx
 * <Button type="primary" size="medium" disabled={false} onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export const Button = createComponent({
  tagName: 'thw-button',
  elementClass: THWButton,
  react: React,
  events: {
    // Map React event props to custom element events
    onClick: 'click',
    onFocus: 'focus',
    onBlur: 'blur',
  },
});

// Export the component as default
export default Button;
