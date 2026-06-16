<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { Button } from 'flowbite-svelte';
	import { Joystick } from 'lucide-svelte';
	import { i18n } from '$lib/i18n.svelte';
	import games from '../../games.json';

	interface GameServer {
		command: string;
		workdir: string;
		port: number;
	}

	interface Game {
		id: string;
		name: string;
		cover: string;
		path: string;
		server?: GameServer;
	}

	const gamesList = games as Game[];

	let id = $derived($page.url.searchParams.get('id') || '');
	let game = $derived(gamesList.find((g) => g.id === id));

	let started = $state(false);
	let isFullscreen = $state(false);
	let containerEl: HTMLDivElement | undefined = $state();
	let barVisible = $state(true);
	let showBarPos = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem('showbar_pos') || 'bottom-right' : 'bottom-right'
	);

	let gameUrl = $derived.by(() => {
		if (!game) return '';
		if (game.server) {
			return `http://localhost:${game.server.port}/`;
		}
		return `${base}${game.path}`;
	});

	function startGame() {
		started = true;
	}

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			containerEl?.requestFullscreen();
			isFullscreen = true;
		} else {
			document.exitFullscreen();
			isFullscreen = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'F11') {
			e.preventDefault();
			toggleFullscreen();
		}
	}

	function barStyle(pos: string) {
		switch (pos) {
			case 'bottom-left': return 'bottom-2 left-2';
			case 'bottom-center': return 'bottom-2 left-1/2 -translate-x-1/2';
			default: return 'bottom-2 right-2';
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if !id}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold text-white">{i18n.t['play.no_game']}</h1>
			<p class="text-gray-400">{i18n.t['play.use_id']}</p>
		</div>
	</div>
{:else if !game}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold text-white">{i18n.t['play.not_found']}</h1>
			<p class="text-gray-400">"{id}" {i18n.t['play.not_available']}</p>
			<a href={base || '/'} class="mt-4 inline-block">
				<Button>{i18n.t['play.back_home']}</Button>
			</a>
		</div>
	</div>
{:else if game}
	<div class="flex min-h-screen flex-col" style="background-color: #000;">
		<header class="flex items-center justify-between border-b border-gray-800 bg-black px-4 py-3">
			<a href={base || '/'} class="flex items-center gap-2">
				<img src={base + '/logo.svg'} alt="FakePackel" class="h-8 w-8" />
				<span class="font-outfit text-lg font-bold text-white">FakePackel</span>
			</a>
			<div class="flex items-center gap-3">
				<a href="https://github.com/EfeBerkCelikk" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-400 transition-colors hover:text-white">Efe Berk Çelik</a>
				<a href="https://github.com/mdonmez" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-400 transition-colors hover:text-white">Muhammed Dönmez</a>
			</div>
		</header>

		<div class="flex flex-1 flex-col items-center justify-center px-4 py-6">
			<div bind:this={containerEl} class="relative w-full max-w-4xl overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl {isFullscreen ? '!fixed !inset-0 !max-w-none !rounded-none !border-0' : ''}">
				{#if !started}
					<div class="relative flex aspect-video w-full flex-col items-center justify-center gap-6 overflow-hidden" style="background-color: #0a0a0a;">
						<img
							src={base + game.cover}
							alt=""
							class="absolute inset-0 h-full w-full object-cover blur-sm opacity-40"
						/>
						<div class="relative z-10 flex flex-col items-center gap-6">
							<h2 class="text-xl font-semibold text-white drop-shadow-lg">{game.name}</h2>
							<button
								onclick={startGame}
								class="flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-gray-200"
							>
								<Joystick class="h-5 w-5" />
								{i18n.t['play.start']}
							</button>
						</div>
					</div>
				{:else}
					<div class="relative flex-1 aspect-video w-full">
						<iframe
							src={gameUrl}
							title={game.name}
							class="absolute inset-0 h-full w-full border-0"
							sandbox="allow-scripts allow-forms allow-top-navigation allow-same-origin allow-popups allow-popups-to-escape-sandbox"
						></iframe>

						{#if barVisible}
							<div class="absolute inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-gray-800 bg-[#0d0d0d]/90 px-3 py-1.5 backdrop-blur-sm">
								<span class="truncate text-sm font-medium text-white/80">{game.name}</span>
								<div class="flex items-center gap-1">
									<button
										onclick={() => barVisible = false}
										class="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
										title={i18n.t['play.hide_bar']}
									>
										<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									<button
										onclick={toggleFullscreen}
										class="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
										title={isFullscreen ? i18n.t['play.exit_fs'] : i18n.t['play.fullscreen']}
									>
										{#if isFullscreen}
											<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
											</svg>
										{:else}
											<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
											</svg>
										{/if}
									</button>
									<a
										href={base || '/'}
										class="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
										title={i18n.t['play.home']}
									>
										<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
										</svg>
									</a>
								</div>
							</div>
						{:else}
							<button
								onclick={() => barVisible = true}
								class="absolute z-40 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white {barStyle(showBarPos)}"
								title={i18n.t['play.show_bar']}
							>
								<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
								</svg>
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<footer class="border-t border-gray-800 bg-black px-4 py-3 text-center">
			<a href="https://github.com/mdonmez/html5games" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-500 transition-colors hover:text-white">{i18n.t['footer.repo']}</a>
		</footer>
	</div>
{/if}
