<script lang="ts">
  interface Props {
    title?: string;
    type?: 'info' | 'warning' | 'success' | 'error' | 'thw';
    children?: import('svelte').Snippet;
  }

  let { title = undefined, type = 'info', children }: Props = $props();

  // Define color schemes for different types
  const colorSchemes = {
    info: {
      bg: 'bg-blue-100',
      border: 'border-l-4 border-blue-600',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-l-4 border-yellow-600',
      titleColor: 'text-yellow-800',
      textColor: 'text-yellow-700',
    },
    success: {
      bg: 'bg-green-100',
      border: 'border-l-4 border-green-600',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-l-4 border-red-600',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
    },
    thw: {
      bg: 'bg-thw-100',
      border: 'border-l-4 border-thw-600',
      titleColor: 'text-thw-800',
      textColor: 'text-thw-700',
    },
  };

  const scheme = colorSchemes[type];
</script>

<div class="{scheme.bg} {scheme.border} p-4 mb-8 rounded-r-lg">
  {#if title}
    <h3 class="font-bold {scheme.titleColor} mb-2">{title}</h3>
  {/if}
  <div class={scheme.textColor}>
    {@render children?.()}
  </div>
</div>
