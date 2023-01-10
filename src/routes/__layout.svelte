<script>
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import '../app.css';
</script>
<Header />

<!-- Begin page content -->
<main class="flex-shrink-0">
	<div class="container">
		<slot />
	</div>
</main>

<Footer />

