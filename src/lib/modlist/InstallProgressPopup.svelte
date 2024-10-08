<script lang="ts">
	import { get } from 'svelte/store';
	import { T, t } from '$i18n';
	import Popup from '$lib/components/Popup.svelte';
	import { invokeCommand } from '$lib/invoke';
	import type { InstallProgress } from '$lib/models';
	import { formatTime, shortenFileSize } from '$lib/util';

	import { listen } from '@tauri-apps/api/event';

	import { Dialog, Progress } from 'bits-ui';
	import { onMount } from 'svelte';

	let open = false;

	let progress: InstallProgress = {
		totalProgress: 0,
		installedMods: 0,
		totalMods: 0,
		currentName: '',
		canCancel: false,
		task: {
			kind: 'installing'
		}
	};

	onMount(() => {
		listen<InstallProgress>('install_progress', (event) => {
			progress = event.payload;

			switch (progress.task.kind) {
				case 'done':
					progress.totalProgress = 1;
					progress.installedMods = progress.totalMods;
					setTimeout(() => {
						open = false;
					}, 250);
					break;

				case 'error':
					open = false;
					break;

				default:
					open = true;
					break;
			}
		});
	});
</script>

<Popup
	title="{t('Installing mods')} ({progress.installedMods}/{progress.totalMods})"
	canClose={progress.canCancel}
	bind:open
	confirmClose={{
		title: t("Abort installation"),
		message: t("Abort installation description")
	}}
	onClose={() => {
		invokeCommand('cancel_install');
	}}
>
	<Dialog.Description class="text-slate-400">
		{#if progress.task.kind == 'done'}
			{t("Done ex")}
		{:else if progress.task.kind == 'downloading'}
			{T("Install progress downloading", {"name": progress.currentName})} ({shortenFileSize(progress.task.payload.downloaded)}/{shortenFileSize(progress.task.payload.total)})
		{:else if progress.task.kind == 'extracting'}
			{T("Install progress extracting", {"name": progress.currentName})}
		{:else if progress.task.kind == 'installing'}
			{T("Install progress installing", {"name": progress.currentName})}
		{/if}
	</Dialog.Description>

	<Progress.Root
		value={progress.totalProgress}
		max={1}
		class="relative mt-2 h-4 w-full overflow-hidden rounded-full bg-gray-900"
	>
		<div
			class="absolute left-0 top-0 h-full rounded-l-full bg-green-600 transition-all"
			style="width: {progress.totalProgress * 100}%"
		/>
	</Progress.Root>
</Popup>
