<script lang="ts">
	import './layout.css';
	import { base } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={base + '/logo.svg'} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;900&display=swap"
		rel="stylesheet"
	/>
	<title>FakePackel</title>
</svelte:head>

<div class="m-0 flex min-h-screen flex-col p-0">
	{@render children()}
</div>
