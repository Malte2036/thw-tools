<script lang="ts">
	import { userToFriendlyString } from '$lib/api/inventarItem';
	import type { Organisation } from '$lib/api/organisationApi';

	export let organisation: Organisation | undefined;
</script>

<div class="flex flex-col gap-2">
	<div class="font-bold text-2xl">Organisation:</div>
	<div class="flex flex-col gap-4">
		<p>Name: {organisation?.name}</p>
		<div class="flex flex-col gap-2">
			<div class="font-bold text-xl">Mitglieder:</div>
			<ul class="flex flex-col gap-2 list-disc pl-4">
				{#each organisation?.members ?? [] as member}
					<li>
						{userToFriendlyString(member)}
						<span class="text-gray-500">
							({member.email})
						</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
