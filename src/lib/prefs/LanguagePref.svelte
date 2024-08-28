<script lang="ts">
	import { currentLanguage, LanguageKeys, SetLang, t, type Language } from '$i18n';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Label from '$lib/components/Label.svelte';
    import Lang from '$i18n/Lang.json';
	import type { Prefs } from '$lib/models';
	import { goto } from '$app/navigation';
	import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

	export let value: string;
    export let set: (newValue: string) => void;

    function GetLangName(name: string) : string
    {
        var key = name as Language;
        if (key == null)
            return name;

        return Lang[key];
    }
</script>

<div class="flex items-center">
	<Label text="{t["Language"]}">{t["Language description"]}</Label>

	<Dropdown
		class="flex-grow"
		items= { LanguageKeys }
		selected= { value }
		onSelectedChangeSingle={(newValue) => {
			value = newValue;
            console.info("value:",value);
            set(value);
            SetLang(value);
		}}
		getLabel={(name) => GetLangName(name)}
	/>
</div>