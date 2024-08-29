<script lang="ts">
	import { t, getLangName, LanguageKeys, setLang, type Language, language } from '$i18n';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Label from '$lib/components/Label.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { goto, invalidateAll } from '$app/navigation'
	import dataDB from 'svelte';

	let value: Language = get(language);
    export let set: (newValue: string) => void;

	function ReLoad() {
		var path = location.pathname;
		var lang = get(language);
		goto("/").then(() => {
			data
			goto(path)
		});
	}

</script>

<div class="flex items-center">
	<Label text={t("Language")}>{t("Language description")}</Label>

	<Dropdown
		class="flex-grow"
		items= { LanguageKeys }
		selected= { value }
		onSelectedChangeSingle={(newValue) => {
			value = newValue;
			setLang(value);
            set(value);
			ReLoad();
		}}
		getLabel={(name) => getLangName(name)}
	/>
</div>