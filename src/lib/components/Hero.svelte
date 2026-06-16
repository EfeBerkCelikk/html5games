<script lang="ts">
	import { i18n } from '$lib/i18n.svelte';

	let { onExplore }: { onExplore: () => void } = $props();
</script>

<section
	class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
>
	<div class="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-900/10 blur-3xl"></div>

	<div class="relative z-10 flex max-w-3xl flex-col items-center gap-6 text-center">
		<h1 class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-5xl font-bold leading-tight text-transparent md:text-7xl">
			FakePackel
		</h1>
		<p class="max-w-xl text-lg text-neutral-400">
			{i18n.t['hero.subtitle']}
		</p>
		<div class="mt-4 flex items-center gap-4">
			<button
				onclick={onExplore}
				class="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
			>
				{i18n.t['hero.explore']}
			</button>
		</div>
	</div>
</section>
