<script lang="ts">
	export let title: string;
</script>

<thw-dialog {title}>
	<slot name="content" />
	<slot name="footer" />
</thw-dialog>
