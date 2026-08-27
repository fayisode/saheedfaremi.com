<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { Container, Section, Tag, Link, Button, Card, SocialLinks, Seo } from '$lib/components';

	// Replace with whichever address Saheed wants surfaced publicly.
	const EMAIL = 'saheedfaremi@gmail.com';

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | null = null;

	async function copyEmail() {
		if (!browser) return;
		try {
			await navigator.clipboard.writeText(EMAIL);
			copied = true;
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => {
				copied = false;
			}, 1800);
		} catch {
			// clipboard API can fail in private mode or without HTTPS. Fall through
			// silently. The mailto button below stays available as a fallback.
		}
	}

	// Form state. Posts to the managed API (/api/contact); if the endpoint is
	// unavailable or errors, falls back to opening the visitor's mail client
	// prefilled, so the form can never dead-end.
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let website = $state(''); // honeypot: humans never see or fill this
	type SendState = 'idle' | 'sending' | 'sent' | 'error';
	let sendState = $state<SendState>('idle');

	const mailtoHref = $derived.by(() => {
		const subject = name ? `Hello from ${name}` : 'Hello from your site';
		const body = message ? message + (email ? `\n\nReply to: ${email}` : '') : '';
		const params = new SvelteURLSearchParams();
		params.set('subject', subject);
		if (body) params.set('body', body);
		return `mailto:${EMAIL}?${params.toString()}`;
	});

	function fallbackToMailClient() {
		window.location.href = mailtoHref;
	}

	async function sendMessage(event: SubmitEvent) {
		event.preventDefault();
		if (sendState === 'sending') return;
		sendState = 'sending';
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, message, website })
			});
			if (!res.ok) throw new Error(String(res.status));
			sendState = 'sent';
		} catch {
			sendState = 'error';
		}
	}
</script>

<Seo
	title="Contact · Saheed Faremi"
	description="Get in touch with Saheed Faremi about research collaboration, engineering work, or speaking."
/>

<Container width="default">
	<Section spacing="loose" eyebrow="Contact" heading="Send a note." labelledById="contact-heading">
		<p class="text-fg mt-6 max-w-2xl text-xl leading-relaxed">
			Research collaboration, engineering work, talks, or anything else. Write a quick note below
			and I'll get back to you.
		</p>

		<!-- Fast path: tap-to-email + copy-to-clipboard. Works without JS for the
		     mailto link; copy widget needs JS but degrades gracefully. -->
		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={`mailto:${EMAIL}`}
				class="bg-accent text-bg hover:bg-accent-hover rounded-soft font-mono inline-flex h-10
					items-center gap-2 px-4 text-sm tracking-wide
					transition-colors duration-[var(--duration-fast)] focus-visible:outline-2
					focus-visible:outline-offset-2 focus-visible:outline-accent"
			>
				<span aria-hidden="true">→</span>
				Email me directly
			</a>
			<Button variant="ghost" size="md" onclick={copyEmail} aria-live="polite">
				{#if copied}
					Copied ✓
				{:else}
					Copy <code class="text-fg">{EMAIL}</code>
				{/if}
			</Button>
		</div>

		<!-- Slow path: a structured note, posted to /api/contact (managed API). -->
		<form class="mt-14 max-w-2xl space-y-6" onsubmit={sendMessage}>
			<!-- Honeypot: invisible to humans, irresistible to bots. -->
			<div class="hidden" aria-hidden="true">
				<label>
					Website
					<input type="text" name="website" bind:value={website} tabindex="-1" autocomplete="off" />
				</label>
			</div>
			<div class="grid gap-6 sm:grid-cols-2">
				<label class="block">
					<span class="font-mono text-fg-soft text-xs tracking-[0.2em] uppercase">Your name</span>
					<input
						type="text"
						name="name"
						bind:value={name}
						autocomplete="name"
						class="rounded-soft border-border bg-bg-soft text-fg
							focus:border-accent focus:outline-accent mt-2 block w-full border px-3 py-2
							focus:outline-2 focus:outline-offset-1"
					/>
				</label>
				<label class="block">
					<span class="font-mono text-fg-soft text-xs tracking-[0.2em] uppercase">Email</span>
					<input
						type="email"
						name="email"
						bind:value={email}
						autocomplete="email"
						class="rounded-soft border-border bg-bg-soft text-fg
							focus:border-accent focus:outline-accent mt-2 block w-full border px-3 py-2
							focus:outline-2 focus:outline-offset-1"
					/>
				</label>
			</div>
			<label class="block">
				<span class="font-mono text-fg-soft text-xs tracking-[0.2em] uppercase">Message</span>
				<textarea
					name="message"
					rows="6"
					bind:value={message}
					class="rounded-soft border-border bg-bg-soft text-fg
						focus:border-accent focus:outline-accent mt-2 block w-full border px-3 py-2
						focus:outline-2 focus:outline-offset-1"
				></textarea>
			</label>
			<div class="flex flex-wrap items-center gap-3">
				<Button type="submit" variant="primary" size="md" disabled={sendState === 'sending'}>
					{sendState === 'sending' ? 'Sending…' : 'Send message'}
				</Button>
				{#if sendState === 'sent'}
					<p class="text-accent text-sm" role="status">
						Sent. I read everything and reply personally.
					</p>
				{:else if sendState === 'error'}
					<p class="text-fg-soft text-sm" role="alert">
						The direct line hiccuped.
						<button type="button" class="text-accent underline" onclick={fallbackToMailClient}>
							Open your mail client instead
						</button>
					</p>
				{:else}
					<span class="text-fg-muted text-sm">
						Goes straight to my inbox. Nothing is stored on the way.
					</span>
				{/if}
			</div>
		</form>

		<div class="mt-14 grid gap-4 sm:grid-cols-2">
			<Card variant="outlined">
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Find me</p>
				<SocialLinks class="mt-3" />
				<p class="mt-4 text-sm">
					<Link
						href="https://medium.com/@sonirudrakshi99/unesco-india-africa-hackathon-2022-2ec88cea6eb9"
						variant="arrow">UNESCO 2022 piece</Link
					>
				</p>
			</Card>
			<Card>
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Based in</p>
				<p class="text-fg mt-2">Dublin, Ireland. Travel for research.</p>
				<div class="mt-3 flex flex-wrap gap-2">
					<Tag>Europe</Tag>
					<Tag>Africa</Tag>
					<Tag>open to collaboration</Tag>
				</div>
			</Card>
		</div>
	</Section>
</Container>
