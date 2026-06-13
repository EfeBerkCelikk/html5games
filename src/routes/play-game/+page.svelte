<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { Joystick } from 'lucide-svelte';
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
</script>

{#if !id}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold text-white">Oyun Seçilmedi</h1>
			<p class="text-gray-400">Bir oyun yüklemek için ?id= kullan</p>
		</div>
	</div>
{:else if !game}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold text-white">Oyun Bulunamadı</h1>
			<p class="text-gray-400">"{id}" adlı oyun mevcut değil</p>
			<a href={base || '/'} class="mt-4 inline-block">
				<Button>Anasayfaya Dön</Button>
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
			<div bind:this={containerEl} class="relative w-full max-w-4xl overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl {isFullscreen ? '!fixed !inset-0 !max-w-none !rounded-none !border-0 flex flex-col' : ''}">
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
								Start Game
							</button>
						</div>
					</div>
				{:else}
					<div class="relative flex-1 {isFullscreen ? '' : 'aspect-video w-full'}">
						<iframe
							src={gameUrl}
							title={game.name}
							class="absolute inset-0 h-full w-full border-0"
							sandbox="allow-scripts allow-forms allow-top-navigation allow-same-origin allow-popups allow-popups-to-escape-sandbox"
						></iframe>
					</div>

					<div class="flex items-center justify-between border-t border-gray-800 bg-[#0d0d0d] px-4 py-2">
						<span class="truncate text-sm font-medium text-white">{game.name}</span>
						<div class="flex items-center gap-2">
							<button
								onclick={toggleFullscreen}
								class="rounded p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
								title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
							>
								{#if isFullscreen}
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
									</svg>
								{:else}
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
									</svg>
								{/if}
							</button>
							<a
								href={base || '/'}
								class="rounded p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
								title="Ana Sayfa"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
								</svg>
							</a>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<footer class="border-t border-gray-800 bg-black px-4 py-3 text-center">
			<a href="https://github.com/mdonmez/html5games" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-500 transition-colors hover:text-white">GitHub Repo</a>
		</footer>
	</div>
{/if}
