<script lang="ts">
	import { base } from '$app/paths';
	import { i18n } from '$lib/i18n.svelte';

	let {
		activeTab = 'home',
		onTabChange
	}: {
		activeTab: string;
		onTabChange: (tab: string) => void;
	} = $props();

	let scrollY = $state(0);
	let scrolled = $derived(scrollY > 100);

	let navClass = $derived(
		'fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border px-1.5 py-1 transition-all duration-300 ' +
		(scrolled
			? 'border-neutral-700/50 bg-neutral-900/80 backdrop-blur-md shadow-lg'
			: 'border-transparent bg-neutral-900/20 shadow-none')
	);

	function tabClass(tab: string) {
		const base = 'rounded-full px-4 py-1.5 text-sm font-medium transition-all';
		if (activeTab === tab) return base + ' bg-white/10 text-white';
		return base + ' text-neutral-400 hover:text-white';
	}
</script>

<svelte:window bind:scrollY />

<nav class={navClass}>
	<a href={base || '/'} class="flex items-center gap-2 px-3 py-1" onclick={() => onTabChange('home')}>
		<img src={base + '/logo.svg'} alt="FakePackel" class="h-6 w-6" />
		<span class="font-outfit text-sm font-bold text-white">FakePackel</span>
	</a>
	<div class="mx-1 h-4 w-px bg-neutral-700"></div>
	<button onclick={() => onTabChange('games')} class={tabClass('games')}>
		{i18n.t['nav.games']}
	</button>
	<button onclick={() => onTabChange('settings')} class={tabClass('settings')}>
		{i18n.t['nav.settings']}
	</button>
</nav>
