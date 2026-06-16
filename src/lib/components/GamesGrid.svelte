<script lang="ts">
	import { Label, Input } from 'flowbite-svelte';
	import { Joystick } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n.svelte';

	interface Game {
		id: string;
		name: string;
		cover: string;
		path: string;
	}

	let { games: gamesList }: { games: Game[] } = $props();

	let searchQuery = $state('');
	let imageLoaded: Record<string, boolean> = $state({});

	function assetUrl(p: string) {
		return `${base}${p}`;
	}

	function onImageLoad(id: string) {
		imageLoaded[id] = true;
	}

	function fuzzyMatch(text: string, query: string): number {
		const t = text.toLowerCase();
		const q = query.toLowerCase();

		if (t === q) return 100;
		if (t.startsWith(q)) return 90 + (q.length / t.length) * 10;
		if (t.includes(q)) return 70 + (q.length / t.length) * 10;

		let score = 0;
		let qIdx = 0;
		let prevMatch = false;

		for (let i = 0; i < t.length && qIdx < q.length; i++) {
			if (t[i] === q[qIdx]) {
				score += prevMatch ? 2 : 1;
				prevMatch = true;
				qIdx++;
			} else {
				prevMatch = false;
			}
		}

		if (qIdx === q.length) {
			return Math.min(score * 5, 60);
		}
		return 0;
	}

	let filteredGames = $derived(
		searchQuery.trim()
			? gamesList
					.filter((g) => fuzzyMatch(g.name, searchQuery) > 0)
					.map((g) => ({ game: g, score: fuzzyMatch(g.name, searchQuery) }))
					.sort((a, b) => b.score - a.score)
					.map((g) => g.game)
			: gamesList
	);

	function clearSearch() {
		searchQuery = '';
	}
</script>

<div class="flex flex-col items-center gap-8">
	<div class="relative w-full max-w-2xl">
		<Label for="search" class="hidden">Ara</Label>
		<Input
			id="search"
			placeholder={i18n.t['games.search']}
			bind:value={searchQuery}
			class="!rounded-full !border-white/20 !bg-white/10 px-6 py-3 !pr-14 !text-lg !text-white placeholder-white/40 !backdrop-blur-sm transition-all hover:!scale-105 hover:!bg-white/25"
		/>
		{#if searchQuery}
			<button
				onclick={clearSearch}
				type="button"
				class="absolute top-1/2 right-4 -translate-y-1/2 text-white/60 hover:text-white"
				title={i18n.t['search.clear']}
			>
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		{/if}
	</div>

	<h2 class="text-center text-2xl font-bold text-white">{i18n.t['games.recently']}</h2>

	{#if filteredGames.length === 0}
		<div class="flex flex-col items-center justify-center py-12">
			<p class="text-gray-400">{i18n.t['games.no_results']} "{searchQuery}"</p>
		</div>
	{:else}
		<div class="mx-auto grid w-full max-w-[90rem] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredGames as game, i (game.name)}
				<div
					class="hero-card group block w-full cursor-pointer overflow-hidden rounded-2xl"
					style="animation-delay: {i * 50}ms"
					onclick={() => goto(base + '/play-game?id=' + game.id)}
					onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goto(base + '/play-game?id=' + game.id); } }}
					role="link"
					tabindex="0"
				>
					<div class="hero-card-surface relative h-[200px] w-full overflow-hidden rounded-2xl">
						{#if !imageLoaded[game.id]}
							<div class="skeleton-loader absolute inset-0"></div>
						{/if}
						<img
							src={assetUrl(game.cover)}
							alt=""
							class="hero-card-image absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							class:hidden={!imageLoaded[game.id]}
							onload={() => onImageLoad(game.id)}
						/>
						<div class="hero-card-blur absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
						<div class="absolute inset-x-0 bottom-0 z-30 flex flex-row items-center justify-between px-4 pt-12 pb-4">
							<span class="font-outfit text-shadow text-base font-semibold text-white">
								{game.name}
							</span>
							<a
								href={base + '/play-game?id=' + game.id}
								class="play-btn relative flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-normal text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25"
							>
								<Joystick class="h-4 w-4" />
								{i18n.t['games.play']}
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.hero-card {
		isolation: isolate;
		border-radius: 1rem;
		position: relative;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		animation: fade-in-up 0.5s ease forwards;
		opacity: 0;
	}

	.hero-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
	}

	.hero-card-surface {
		position: relative;
		backface-visibility: hidden;
		transform: translateZ(0);
		will-change: transform;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		transition: box-shadow 0.3s ease;
	}

	.hero-card:hover .hero-card-surface {
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	}

	.text-shadow {
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
	}

	.skeleton-loader {
		background: linear-gradient(90deg, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s infinite;
	}

	.hero-card-image.hidden {
		display: none;
	}

	@keyframes skeleton-shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
