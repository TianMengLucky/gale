<script lang="ts">
	import { currentLanguage, LanguageKeys, SetLang, t, type Language } from '$i18n';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Label from '$lib/components/Label.svelte';
    import Lang from '$i18n/Lang.json';
	import type { Prefs } from '$lib/models';
	import { goto } from '$app/navigation';

	export let value: number = LanguageKeys.indexOf(currentLanguage as string);
    export let set: (newValue: number) => void;

    function GetLangName(name: string) : string
    {
        var key = name as Language;
        if (key == null)
            return name;

        return Lang[key];
    }

    function Reload()
    {
        var thisPage = window.location.pathname;
        goto('/').then(
            () => goto(thisPage)
        );
    }
</script>

<div class="flex items-center">
	<Label text="{t["Language"]}">{t["Language description"]}</Label>

	<Dropdown
		class="flex-grow"
		items= { LanguageKeys }
		selected= { LanguageKeys[value] }
		onSelectedChangeSingle={(newValue) => {
			value = LanguageKeys.indexOf(newValue);
            console.info("value:",value, newValue);
            set(value);
            SetLang(value);
            Reload();
		}}
		getLabel={(name) => GetLangName(name)}
	/>
</div>