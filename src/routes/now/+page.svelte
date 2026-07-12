<script lang="ts">
	import { Container, Section, Seo, Link, Tag } from '$lib/components';
</script>

<Seo title="Now · Saheed Faremi" description="What Saheed Faremi is working on right now." />

<Container width="narrow">
	<Section spacing="loose" eyebrow="Now" heading="What I'm doing right now.">
		<p class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
			Last updated: July 2026
		</p>

		<div class="mt-10 space-y-5 text-lg leading-relaxed text-fg">
			<p>
				Doctoral research on <strong>EEG microstates with variational autoencoders</strong>
				at University College Cork, supervised by
				<Link href="https://lucalongo.eu" variant="inline">Luca Longo</Link>. The work asks whether
				a learned latent geometry produces a microstate alphabet that's more stable across sessions
				and more behaviourally predictive than classical clustering.
			</p>

			<!-- TODO: Saheed, update this section with your current specific task -->
			<p>
				Currently working on: <span class="text-fg-soft"
					>[add the concrete thing on your desk this week]</span
				>.
			</p>

			<p>
				Recent: the Conv-VaDE paper was presented at
				<Link href="https://xai2026.ufc.br" variant="inline">XAI 2026 in Fortaleza, Brazil</Link> (July
				2026). A Brain Informatics paper is under review.
			</p>

			<p>Based in Dublin, Ireland. I travel for research.</p>

			<p class="text-fg-soft text-base">
				<Tag variant="accent">open to collaboration</Tag>
				<Tag variant="outline">seeking funding</Tag>
				<Tag variant="outline">computing resources</Tag>
			</p>

			<p class="pt-2">
				<Link href="/contact" variant="arrow">Get in touch</Link>
			</p>

			<p class="text-fg-soft text-sm pt-4">
				This is a <Link href="https://nownownow.com" variant="inline">/now</Link> page: a living snapshot
				of current focus, updated when the focus changes.
			</p>
		</div>
	</Section>
</Container>
