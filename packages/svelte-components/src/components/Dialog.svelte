<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  interface Props {
    title: string;
    content?: Snippet;
    footer?: Snippet;
    /**
     * "modal" renders a centered dialog (default).
     * "sheet" renders a bottom sheet on mobile and a centered dialog on desktop.
     */
    variant?: 'modal' | 'sheet';
    onClose?: () => void;
  }

  let { title, content, footer, variant = 'modal', onClose = () => {} }: Props = $props();

  let isMobile = $state(
    typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches
  );

  $effect(() => {
    if (variant !== 'sheet' || typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const update = (matches: boolean) => (isMobile = matches);
    update(mediaQuery.matches);
    mediaQuery.addEventListener('change', (event) => update(event.matches));
    return () => mediaQuery.removeEventListener('change', (event) => update(event.matches));
  });

  onMount(() => {
    if (variant !== 'sheet') {
      return;
    }
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

{#snippet header()}
  <div class="flex items-center justify-between gap-3">
    <h2 id="thw-dialog-sheet-title" class="text-xl font-bold text-thw-900">{title}</h2>
    <button
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-thw-50 hover:text-thw"
      onclick={onClose}
      aria-label="Schließen"
    >
      <span class="h-5 w-5">
        <!--! Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2024 Fonticons, Inc. -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 384 512"
          fill="currentColor"
          ><path
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s12.5 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
          /></svg
        >
      </span>
    </button>
  </div>
{/snippet}

{#if variant === 'modal'}
  <thw-dialog {title}>
    <div slot="content" class="contents">
      {@render content?.()}
    </div>
    <div slot="footer" class="contents">
      {@render footer?.()}
    </div>
  </thw-dialog>
{:else}
  <div class="fixed inset-0 z-50 flex justify-center {isMobile ? 'items-end' : 'items-center'}">
    <button
      class="absolute inset-0 h-full w-full bg-black/50"
      aria-label="Dialog schließen"
      transition:fade={{ duration: 150 }}
      onclick={onClose}
    ></button>

    {#if isMobile}
      <div
        class="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 pb-safe shadow-[0_-8px_30px_rgb(0_0_0_/_0.15)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thw-dialog-sheet-title"
        transition:fly={{ y: '100vh', duration: 300, easing: cubicOut }}
      >
        <div
          class="mx-auto -mt-3 mb-4 h-1.5 w-10 rounded-full bg-gray-200"
          aria-hidden="true"
        ></div>
        {@render header()}

        <div class="mt-4">
          {@render content?.()}
        </div>

        {#if footer}
          <div class="mt-5 flex w-full flex-row justify-end gap-2">
            {@render footer()}
          </div>
        {/if}
      </div>
    {:else}
      <div
        class="relative z-10 max-h-[85vh] w-[28rem] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl bg-white p-6 shadow-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thw-dialog-sheet-title"
        transition:fly={{ y: 8, duration: 160 }}
      >
        {@render header()}

        <div class="mt-4">
          {@render content?.()}
        </div>

        {#if footer}
          <div class="mt-5 flex w-full flex-row justify-end gap-2">
            {@render footer()}
          </div>
        {/if}
      </div>
    {/if}
  </div>
{/if}
