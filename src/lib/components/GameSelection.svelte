<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import { games, setActiveGame } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { Button } from 'bits-ui';
	import { invokeCommand } from '$lib/invoke';
	import Link from './Link.svelte';
	import { t } from '$i18n';

	export let onSelect: () => void;

	let shownGames = games;
	let searchTerm = '';

	$: refresh(searchTerm);

	function refresh(searchTerm: string) {
		let lowerSearch = searchTerm.toLowerCase();

		let newGames =
			searchTerm.length > 0
				? games.filter((game) => {
						return (
							game.displayName.toLowerCase().includes(lowerSearch) ||
							game.aliases.some((alias) => alias.toLowerCase().includes(lowerSearch))
						);
					})
				: games;

		newGames.sort((a, b) => {
			if (a.favorite && !b.favorite) return -1;
			if (!a.favorite && b.favorite) return 1;
			return 0;
		});

		shownGames = newGames;
	}
</script>

<div class="relative mt-1 flex-grow">
	<SearchBar bind:value={searchTerm} placeholder={t('Search for games')} />
</div>

<div class="mt-2 flex h-96 flex-col overflow-y-auto">
	{#if shownGames.length > 0}
		{#each shownGames as game}
			<Button.Root
				class="group mr-2 flex items-center rounded-lg p-1 hover:bg-gray-700"
				on:click={() => {
					setActiveGame(game);
					onSelect();
				}}
			>
				<img
					src="games/{game.id}.webp"
					alt={game.displayName}
					class="mr-2 h-8 w-8 rounded group-hover:shadow-xl"
				/>

				<span class="flex-grow text-left text-slate-200">
					{game.displayName}
				</span>

				<Button.Root
					class="{game.favorite
						? 'block'
						: 'hidden group-hover:block'} mr-1 rounded-md p-1 hover:bg-gray-600"
					on:click={(evt) => {
						evt.stopPropagation();
						game.favorite = !game.favorite;
						refresh(searchTerm);
						invokeCommand('favorite_game', { id: game.id });
					}}
				>
					<Icon
						icon={game.favorite ? 'mdi:star' : 'mdi:star-outline'}
						class="text-xl text-yellow-400"
					/>
				</Button.Root>
			</Button.Root>
		{/each}
	{:else}
		<div class="mt-4 text-center text-slate-300">{t('No games found')}</div>
		<div class="max-w-[35rem] text-sm text-slate-400">
			{t('No games found description 1')}
			<Link href="https://thunderstore.io">thunderstore.io</Link>
			{t('No games found description 2')}
			<Link href="https://discord.com/channels/1168655651455639582/1246088342458863618">Discord</Link>
			{t('No games found description 3')}
			<Link href="https://github.com/Kesomannen/ModManager/issues/">Github</Link>
			{t('No games found description 4')}
		</div>
	{/if}
</div>
