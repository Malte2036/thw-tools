<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  type TableCell =
    | string
    | HTMLElement
    | SvelteComponent
    | {
        component: typeof SvelteComponent;
        props: Record<string, any>;
      };

  let {
    header = [],
    values = [],
    onValueClick = undefined,
    selectedIndex = $bindable(undefined),
  } = $props<{
    header: string[];
    values: TableCell[][];
    onValueClick?: ((row: TableCell[], index: number) => void) | undefined;
    selectedIndex?: number | undefined;
  }>();

  function handleRowClick(event: CustomEvent<{ row: TableCell[]; index: number }>) {
    const { row, index } = event.detail;
    selectedIndex = index;
    if (onValueClick) {
      onValueClick(row, index);
    }
  }
</script>

<thw-table {header} {values} {selectedIndex} onrow-click={handleRowClick}></thw-table>
