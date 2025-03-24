<script lang="ts">
    import type { InventoryItem } from '$lib/api/inventoryModels';
    import { Button, Dialog } from '@thw-tools/svelte-components';

    interface Props {
        inventoryItem: InventoryItem;
        onClose: () => void;
    }

    let { inventoryItem, onClose }: Props = $props();
</script>

<Dialog title="Inventar-Details">
    {#snippet content()}
        <div class="flex flex-col gap-2">
            <div>
                <span class="font-bold">Inventar-Nummer:</span>
                <span>{inventoryItem.inventarNummer}</span>
            </div>
            <div>
                <span class="font-bold">Sach-Nummer:</span>
                <span>{inventoryItem.sachNummer}</span>
            </div>
            <div>
                <span class="font-bold">Ebene:</span>
                <span>{inventoryItem.ebene}</span>
            </div>
            <div>
                <span class="font-bold">Einheit:</span>
                <span>{inventoryItem.einheit}</span>
            </div>
            {#if inventoryItem.art}
                <div>
                    <span class="font-bold">Art:</span>
                    <span>{inventoryItem.art}</span>
                </div>
            {/if}
            <div>
                <span class="font-bold">Ausstattung:</span>
                <span>{inventoryItem.ausstattung}</span>
            </div>
            {#if inventoryItem.hersteller}
                <div>
                    <span class="font-bold">Hersteller:</span>
                    <span>{inventoryItem.hersteller}</span>
                </div>
            {/if}
            {#if inventoryItem.typ}
                <div>
                    <span class="font-bold">Typ:</span>
                    <span>{inventoryItem.typ}</span>
                </div>
            {/if}
            {#if inventoryItem.gerateNummer}
                <div>
                    <span class="font-bold">Geräte-Nummer:</span>
                    <span>{inventoryItem.gerateNummer}</span>
                </div>
            {/if}
        </div>
    {/snippet}
    {#snippet footer()}
        <div>
            <Button click={onClose}>Schließen</Button>
        </div>
    {/snippet}
</Dialog> 