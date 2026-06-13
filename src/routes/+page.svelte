<script lang="ts">
	import { Heading, Label, Input } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { Joystick } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import games from '../games.json';

	interface Game {
		id: string;
		name: string;
		cover: string;
		path: string;
	}

	const gamesList = games as Game[];

	function assetUrl(p: string) {
		return `${base}${p}`;
	}

	let imageLoaded: Record<string, boolean> = $state({});
	let imageError: Record<string, boolean> = $state({});

	function onImageLoad(id: string) {
		imageLoaded[id] = true;
	}

	function onImageError(id: string) {
		imageError[id] = true;
	}

	let searchQuery = $state('');

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

<header
	class="sticky top-0 z-50 flex items-center justify-between border-b border-gray-800 bg-black px-6 py-4"
>
	<a href={base || '/'} class="flex items-center gap-3">
		<img src={assetUrl('/logo.svg')} alt="FakePackel" class="h-10 w-10" />
		<Heading tag="h1" class="font-outfit text-3xl font-bold text-white">FakePackel</Heading>
	</a>
	<div></div>
</header>

<main class="flex-auto px-4 py-10 pb-4">
	<section class="mb-12 flex flex-col items-center justify-center overflow-hidden">
		<img src={assetUrl('/logo.svg')} alt="FakePackel" class="h-32 w-32" />
		<p class="mt-4 max-w-2xl text-center text-gray-400">
			Bir dizi elle seçilmiş yüksek kaliteli HTML5 oyun portu.<br />
		</p>
		<div class="relative mt-8 w-full max-w-2xl">
			<Label for="search" class="hidden">Ara</Label>
			<Input
				id="search"
				placeholder="Oyun Ara..."
				bind:value={searchQuery}
				class="!rounded-full !border-white/20 !bg-white/10 px-6 py-3 !pr-14 !text-lg !text-white placeholder-white/40 !backdrop-blur-sm transition-all hover:!scale-105 hover:!bg-white/25"
			/>
			{#if searchQuery}
				<button
					onclick={clearSearch}
					type="button"
					class="absolute top-1/2 right-4 -translate-y-1/2 text-white/60 hover:text-white"
					title="Temizle"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			{/if}
		</div>
	</section>

	<section class="games-list">
		{#if filteredGames.length === 0}
			<div class="flex flex-col items-center justify-center py-12">
				<p class="text-gray-400">"{searchQuery}" ile eşleşen oyun bulunamadı</p>
			</div>
		{:else}
			<div
				class="mx-auto grid w-full max-w-[90rem] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
			>
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
								onerror={() => onImageError(game.id)}
							/>
							<div
								class="hero-card-blur absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
							></div>
							<div
								class="absolute inset-x-0 bottom-0 z-30 flex flex-row items-center justify-between px-4 pt-12 pb-4"
							>
								<span class="font-outfit text-shadow text-base font-semibold text-white">
									{game.name}
								</span>
								<a
									href={base + '/play-game?id=' + game.id}
									class="play-btn relative flex items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-normal text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25"
								>
									<Joystick class="h-4 w-4" />
									Oyna
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</main>

<footer class="border-t border-gray-800 bg-black px-4 py-4 text-center">
	<div class="flex items-center justify-center gap-4 text-sm">
		<a href="https://github.com/EfeBerkCelikk" target="_blank" rel="noopener noreferrer" class="text-xs text-gray-500 transition-colors hover:text-white">Efe Berk Çelik</a>
		<a href="https://github.com/mdonmez/html5games" target="_blank" rel="noopener noreferrer" class="font-semibold text-gray-400 transition-colors hover:text-white flex items-center gap-1.5">
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
			GitHub Repo
		</a>
		<a href="https://github.com/mdonmez" target="_blank" rel="noopener noreferrer" class="text-xs text-gray-500 transition-colors hover:text-white">Muhammed Dönmez</a>
	</div>
</footer>

<style>
	:global(*) {
		font-family: 'Outfit', sans-serif;
	}
	:global(.font-outfit) {
		font-family: 'Outfit', sans-serif;
	}

	.hero-card {
		isolation: isolate;
		border-radius: 1rem;
		position: relative;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
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
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
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

	.hero-card {
		animation: fade-in-up 0.5s ease forwards;
		opacity: 0;
	}
</style>
