<script lang="ts">
	import { browser } from '$app/environment';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { Container, Section, Tag, Link, Button, SocialLinks, Seo } from '$lib/components';

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

	// Form state for the static demo. POST submission is intentionally inert
	// for now; a future Azure Function (or any same-origin POST endpoint) can
	// be wired by changing the form's `action` attribute. The mailto: button
	// + copy widget cover the "I just want to reach Saheed" case without any
	// server.
	let name = $state('');
	let email = $state('');
	let message = $state('');

	const mailtoHref = $derived.by(() => {
		const subject = name ? `Hello from ${name}` : 'Hello from your site';
		const body = message ? message + (email ? `\n\nReply to: ${email}` : '') : '';
		const params = new SvelteURLSearchParams();
		params.set('subject', subject);
		if (body) params.set('body', body);
		return `mailto:${EMAIL}?${params.toString()}`;
	});
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
			<button
				type="button"
				onclick={copyEmail}
				class="font-mono text-fg-soft hover:text-fg hover:bg-bg-soft rounded-soft border-border
					inline-flex h-10 items-center gap-2 border px-4 text-sm tracking-wide
					transition-colors duration-[var(--duration-fast)] focus-visible:outline-2
					focus-visible:outline-offset-2 focus-visible:outline-accent"
				aria-live="polite"
			>
				{#if copied}
					Copied ✓
				{:else}
					Copy <code class="text-fg">{EMAIL}</code>
				{/if}
			</button>
		</div>

		<!-- Slow path: a structured note. Static for now (no Function endpoint). -->
		<form class="mt-14 max-w-2xl space-y-6" action={mailtoHref} method="get">
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
				<Button type="submit" variant="primary" size="md">Open in mail client</Button>
				<span class="text-fg-muted text-sm">
					This form opens your default email app prefilled. No data is sent to a server.
				</span>
			</div>
		</form>

		<div class="mt-14 grid gap-4 sm:grid-cols-2">
			<div class="rounded-card border-border border p-6">
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Find me</p>
				<SocialLinks class="mt-3" />
				<p class="mt-4 text-sm">
					<Link
						href="https://medium.com/@sonirudrakshi99/unesco-india-africa-hackathon-2022-2ec88cea6eb9"
						variant="arrow">UNESCO 2022 piece</Link
					>
				</p>
			</div>
			<div class="rounded-card border-border bg-bg-soft border p-6">
				<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Based in</p>
				<p class="text-fg mt-2">Dublin, Ireland. Travel for research.</p>
				<div class="mt-3 flex flex-wrap gap-2">
					<Tag>Europe</Tag>
					<Tag>Africa</Tag>
					<Tag>open to collaboration</Tag>
				</div>
			</div>
		</div>
	</Section>
</Container>
