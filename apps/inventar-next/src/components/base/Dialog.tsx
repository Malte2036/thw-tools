import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWDialog } from '@thw-tools/web-components';

// Define the Dialog props interface based on the web component properties
export interface DialogProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Whether the dialog is open
   * @default false
   */
  open?: boolean;

  /**
   * Dialog title
   */
  title?: string;

  /**
   * Callback function when dialog is closed
   */
  onClose?: () => void;

  /**
   * Callback function when clicking outside the dialog
   */
  onOutsideClick?: () => void;
}

/**
 * React wrapper for the thw-dialog web component.
 *
 * @example
 * ```tsx
 * <Dialog
 *   open={isOpen}
 *   title="Confirmation"
 *   onClose={() => setIsOpen(false)}
 *   onOutsideClick={() => setIsOpen(false)}
 * >
 *   <p>Are you sure you want to continue?</p>
 * </Dialog>
 * ```
 */
export const Dialog = createComponent({
  tagName: 'thw-dialog',
  elementClass: THWDialog,
  react: React,
  events: {
    onClose: 'close',
    onOutsideClick: 'outside-click',
  },
});

// Export the component as default
export default Dialog;
