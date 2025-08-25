<script lang="ts">
	type Status = 'ACTIVE' | 'COMPLETED' | 'CHECKED_OUT' | 'RETURNED' | 'LOST' | 'DEFECTIVE';

	interface Props {
		status: Status;
	}

	let { status }: Props = $props();

	const statusMap: Record<Status, { text: string; class: string }> = {
		ACTIVE: { text: 'Aktiv', class: 'badge-active' },
		COMPLETED: { text: 'Abgeschlossen', class: 'badge-completed' },
		CHECKED_OUT: { text: 'Ausgegeben', class: 'badge-checked_out' },
		RETURNED: { text: 'Zurück', class: 'badge-returned' },
		LOST: { text: 'Verlust', class: 'badge-lost' },
		DEFECTIVE: { text: 'Defekt', class: 'badge-defective' }
	};

	let badge = $derived(statusMap[status] || { text: 'Unbekannt', class: 'badge-unknown' });
</script>

<span class={badge.class}>
	{badge.text}
</span>

<style>
	span {
		padding: 2px 8px;
		border-radius: 9999px;
		font-weight: 500;
		font-size: 0.875rem;
		white-space: nowrap;
	}
	.badge-active {
		background-color: #dcfce7;
		color: #166534;
	}
	.badge-completed {
		background-color: #e0e7ff;
		color: #3730a3;
	}
	.badge-checked_out {
		background-color: #fef9c3;
		color: #854d0e;
	}
	.badge-returned {
		background-color: #e0e7ff;
		color: #3730a3;
	}
	.badge-lost {
		background-color: #fee2e2;
		color: #991b1b;
	}
	.badge-defective {
		background-color: #ffedd5;
		color: #9a3412;
	}
	.badge-unknown {
		background-color: #f3f4f6;
		color: #4b5563;
	}
</style>
