<script context="module" lang="ts">
	import { check, type Update } from '@tauri-apps/plugin-updater';
	import { writable } from 'svelte/store';

	export let currentUpdate = writable<Update | null>(null);

	export async function refreshUpdate() {
		let update = await check();
		if (update === null || !update.available) return;
		currentUpdate.set(update);
	}
</script>

<script lang="ts">
	import BigButton from '$lib/components/BigButton.svelte';
	import ConfirmPopup from '$lib/components/ConfirmPopup.svelte';
	import { pushError } from '$lib/invoke';
	import Icon from '@iconify/svelte';
	import { message } from '@tauri-apps/plugin-dialog';
	import { platform } from '@tauri-apps/plugin-os';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { Button, Dialog } from 'bits-ui';
	import { onMount } from 'svelte';

	import { t, T } from '$i18n';

	let popupOpen = false;
	let loading = false;

	onMount(() => {
		refreshUpdate();
	});

	async function installUpdate() {
		if ($currentUpdate === null) return;

		try {
			await $currentUpdate.downloadAndInstall();
		} catch (e) {
			let message: string;
			if (typeof e === 'string') {
				message = e;
			} else if (e instanceof Error) {
				message = e.message;
			} else {
				message = 'Unknown error';
			}

			pushError(
				{
					name: 'Failed to update Gale',
					message
				},
				true
			);
		}

		$currentUpdate = null;
	}

	async function update() {
		loading = true;
		await installUpdate();
		loading = false;

		if (platform() !== 'windows') {
			// on other platforms installUpdate() relaunches the app itself
			await message(t('Update installed description'), {
				title: t('Update installed')
			});
			await relaunch();
		}
	}
</script>

{#if $currentUpdate != null}
	<Button.Root
		class="my-auto ml-auto mr-1.5 flex items-center rounded-md bg-green-600 
            px-2 py-1 font-semibold text-slate-100 enabled:hover:bg-green-500"
		disabled={loading}
		on:click={() => (popupOpen = true)}
	>
		{#if loading}
			<Icon icon="mdi:loading" class="mr-1 animate-spin" />
		{:else}
			<Icon icon="mdi:arrow-up-circle" class="mr-1" />
		{/if}
		<span class="text-sm">{loading ? t('Downloading update') : t('Update available')}</span>
	</Button.Root>
{/if}

<ConfirmPopup title="{t("App update available")}" bind:open={popupOpen}>
	<Dialog.Description class="text-slate-300">
		<p>
			{#if currentUpdate}
				{T("App update available description 1", {"newVersion": $currentUpdate?.version, "currentVersion": $currentUpdate?.currentVersion})}
			{:else}
				{t("App update available description 2")}
			{/if}

			{t("App update available description 3")}
		</p>
		<p class="mt-1">{t("App update available description 4")}</p>
	</Dialog.Description>

	<svelte:fragment slot="buttons">
		<BigButton color="green" fontWeight="semibold" on:click={update}>{t("Install")}</BigButton>
	</svelte:fragment>
</ConfirmPopup>
