<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import GamesGrid from '$lib/components/GamesGrid.svelte';
	import { Joystick } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/i18n.svelte';
	import games from '../games.json';

	interface Game {
		id: string;
		name: string;
		cover: string;
		path: string;
	}

	const gamesList = games as Game[];

	let activeTab = $state('home');
	let featuredGames = $derived(gamesList.slice(-3).reverse());

	let showBarPos = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem('showbar_pos') || 'bottom-right' : 'bottom-right'
	);

	function setBarPosition(pos: string) {
		showBarPos = pos;
		localStorage.setItem('showbar_pos', pos);
	}

	function onExplore() {
		activeTab = 'games';
	}

	function assetUrl(p: string) {
		return `${base}${p}`;
	}
</script>

<Navbar {activeTab} onTabChange={(tab) => activeTab = tab} />

<div class="min-h-screen" style="background: linear-gradient(to bottom, #09090b 0%, #140b22 50%, #09090b 100%);">
	{#if activeTab === 'home'}
		<Hero {onExplore} />

		<section class="relative overflow-hidden px-4 pb-16 pt-24">
			<div class="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-700/15 blur-3xl"></div>
			<div class="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-indigo-800/10 blur-3xl"></div>

			<div class="relative z-10 mx-auto flex max-w-[90rem] flex-col items-center gap-8">
				<div class="text-center">
					<h2 class="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
						{i18n.t['featured.title']}
					</h2>
					<p class="mt-1 text-sm text-neutral-500">{i18n.t['featured.subtitle']}</p>
				</div>

				<div class="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
					{#each featuredGames as game, i (game.id)}
						<div
							class="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 transition-all hover:scale-[1.02] hover:border-neutral-700"
							style="animation-delay: {i * 100}ms"
							onclick={() => goto(base + '/play-game?id=' + game.id)}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goto(base + '/play-game?id=' + game.id); } }}
							role="link"
							tabindex="0"
						>
							<div class="relative h-[200px] w-full overflow-hidden">
								<img
									src={assetUrl(game.cover)}
									alt={game.name}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
								<div class="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 pb-4">
									<span class="font-semibold text-white drop-shadow-lg">{game.name}</span>
									<div class="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
										<Joystick class="h-4 w-4" />
										{i18n.t['games.play']}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{:else if activeTab === 'games'}
		<section class="relative overflow-hidden px-4 pt-24 pb-12">
			<div class="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl"></div>
			<div class="relative z-10">
				<GamesGrid games={gamesList} />
			</div>
		</section>
	{:else if activeTab === 'settings'}
		<section class="relative overflow-hidden px-4 pt-24 pb-12">
			<div class="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl"></div>
			<div class="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6">
				<h2 class="text-center text-2xl font-bold text-white">{i18n.t['settings.title']}</h2>

				<div class="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
					<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">{i18n.t['settings.language']}</h3>
					<div class="flex flex-col gap-3">
						<label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/5">
							<input
								type="radio"
								name="locale"
								value="en"
								checked={i18n.locale === 'en'}
								onchange={() => i18n.setLocale('en')}
								class="accent-orange-500"
							/>
							{i18n.t['settings.english']}
						</label>
						<label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/5">
							<input
								type="radio"
								name="locale"
								value="tr"
								checked={i18n.locale === 'tr'}
								onchange={() => i18n.setLocale('tr')}
								class="accent-orange-500"
							/>
							{i18n.t['settings.turkish']}
						</label>
					</div>
				</div>

				<div class="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
					<h3 class="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">{i18n.t['settings.showbar']}</h3>
					<div class="flex flex-col gap-3">
						{#each ['bottom-left', 'bottom-center', 'bottom-right'] as pos}
							<label class="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-white transition-colors hover:bg-white/5">
								<input
									type="radio"
									name="showbar_pos"
									value={pos}
									checked={showBarPos === pos}
									onchange={() => setBarPosition(pos)}
									class="accent-orange-500"
								/>
								{pos === 'bottom-left' ? i18n.t['settings.bottom_left'] : pos === 'bottom-center' ? i18n.t['settings.bottom_center'] : i18n.t['settings.bottom_right']}
							</label>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}
</div>

<footer class="border-t border-neutral-800 bg-black px-4 py-4 text-center">
	<div class="flex items-center justify-center gap-4 text-sm">
		<a href="https://github.com/EfeBerkCelikk" target="_blank" rel="noopener noreferrer" class="text-xs text-neutral-500 transition-colors hover:text-white">Efe Berk Çelik</a>
		<a href="https://github.com/mdonmez/html5games" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 font-semibold text-neutral-400 transition-colors hover:text-white">
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
			{i18n.t['footer.repo']}
		</a>
		<a href="https://github.com/mdonmez" target="_blank" rel="noopener noreferrer" class="text-xs text-neutral-500 transition-colors hover:text-white">Muhammed Dönmez</a>
	</div>
</footer>

<style>
	:global(*) {
		font-family: 'Outfit', sans-serif;
	}
	:global(.font-outfit) {
		font-family: 'Outfit', sans-serif;
	}
</style>
