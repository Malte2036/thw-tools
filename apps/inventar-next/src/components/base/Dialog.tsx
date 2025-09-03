import React from 'react';
import { createComponent } from '@lit/react';

// Import the web component and its class from the installed package
import '@thw-tools/web-components';
import { THWDialog } from '@thw-tools/web-components';

// Define the Dialog props interface based on the web component properties
export interface DialogProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Title of the dialog
   * @default "Dialog title"
   */
  title?: string;

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
 *   title="Confirm Action"
 *   onOutsideClick={() => setIsOpen(false)}
 * >
 *   <div slot="content">
 *     <p>Are you sure you want to continue?</p>
 *   </div>
 *   <div slot="footer">
 *     <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button type="warning" onClick={handleConfirm}>Confirm</Button>
 *   </div>
 * </Dialog>
 * ```
 */
export const Dialog = createComponent({
  tagName: 'thw-dialog',
  elementClass: THWDialog,
  react: React,
  events: {
    onOutsideClick: 'outside-click',
  },
});

export default Dialog;
