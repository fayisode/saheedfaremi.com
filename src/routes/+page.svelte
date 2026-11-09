<script lang="ts">
	import {
		AcademicPublicationList,
		AcademicSection,
		Container,
		Link,
		Seo,
		SocialLinks
	} from '$lib/components';
	import portraitUrl from '$lib/assets/portrait.jpg';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title="Saheed Faremi · Researcher & Engineer"
	description="Saheed Faremi: PhD researcher at University College Cork and data scientist working on EEG microstates, machine learning, and production data systems."
/>

<Container width="default" class="pt-20 sm:pt-24">
	<section aria-labelledby="profile-heading" class="py-12 text-center sm:py-14">
		<img
			src={portraitUrl}
			alt="Saheed Faremi"
			width="112"
			height="112"
			class="border-border mx-auto h-28 w-28 rounded-full border object-cover"
			loading="eager"
			decoding="async"
			fetchpriority="high"
		/>
		<h1 id="profile-heading" class="font-display text-fg mt-6 text-4xl tracking-tight">
			Saheed Faremi
		</h1>
		<p class="text-fg-soft mx-auto mt-3 max-w-2xl text-sm leading-6 sm:text-base">
			PhD researcher, University College Cork · Data scientist
		</p>
		<SocialLinks class="mt-6 justify-center" />
		<div class="mt-7 flex flex-wrap items-center justify-center gap-3">
			<a
				href="/saheed-faremi-cv.pdf"
				class="bg-accent text-bg hover:bg-accent-hover rounded-pill focus-visible:outline-accent
					inline-flex min-h-9 items-center justify-center px-4 py-2 font-mono text-xs font-medium
					transition-colors duration-[var(--duration-fast)] focus-visible:outline-2
					focus-visible:outline-offset-2"
			>
				View / Download Curriculum Vitae (PDF)
			</a>
			<a
				href="/cv"
				class="border-border text-fg hover:border-accent hover:text-accent rounded-pill
					focus-visible:outline-accent inline-flex min-h-9 items-center justify-center border px-4
					py-2 font-mono text-xs transition-colors duration-[var(--duration-fast)]
					focus-visible:outline-2 focus-visible:outline-offset-2"
			>
				View web CV
			</a>
		</div>
	</section>

	<AcademicSection id="about" title="About">
		<div class="text-fg-soft space-y-4 leading-7">
			<p>
				I am a PhD researcher at University College Cork, supervised by <Link
					href="https://lucalongo.eu"
					variant="inline">Luca Longo</Link
				>
				at the
				<Link href="https://lucalongo.eu/LongoLab.php" variant="inline"
					>Artificial Intelligence and Cognitive Load Lab</Link
				>. My doctoral work uses deep learning to study EEG signals. Alongside the doctorate, I
				build data and AI systems for fintech and healthcare.
			</p>
			<p>
				Over the past five years, I have built payment systems, fraud-detection tools,
				document-automation pipelines and machine-learning models for healthcare. I hold an MSc in
				Computer Science from TU Dublin and a BSc in Information Technology from the University of
				Eswatini.
			</p>
		</div>
	</AcademicSection>

	<AcademicSection id="research" title="Research">
		<div>
			<h3 class="font-mono text-fg-muted text-xs tracking-[0.16em] uppercase">Research areas</h3>
			<dl class="mt-4 grid gap-5 md:grid-cols-3">
				{#each data.researchAreaGroups as group (group.group)}
					<div class="research-group">
						<dt class="text-fg text-sm font-semibold leading-6">{group.group}</dt>
						<dd class="text-fg-soft mt-2 text-sm leading-6">{group.items.join('; ')}</dd>
					</div>
				{/each}
			</dl>
		</div>
		<div class="border-border mt-8 border-t pt-6">
			<h3 class="text-fg text-sm leading-6 font-semibold">Doctoral research focus</h3>
			<p class="text-fg-soft mt-3 text-sm leading-6">
				My PhD uses deep learning to test what an EEG microstate actually is, rather than assuming
				that the classical definition is complete.
			</p>
			<ol class="text-fg-soft mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
				<li class="pl-1">Do brain-state sequences have memory beyond the current state?</li>
				<li class="pl-1">
					Are brain states truly separate, or are they parts of a continuous flow, and what
					information is lost when we divide that flow into labels?
				</li>
				<li class="pl-1">
					Does the time spent in a state shape the next one, and does the brain’s switching rule
					stay fixed?
				</li>
				<li class="pl-1">
					Which patterns are stable enough to identify a person across sessions and predict
					cognition or clinical outcomes better than standard statistics?
				</li>
			</ol>
			<p class="text-fg-soft mt-4 text-sm leading-6">
				The work asks which patterns are genuine properties of brain activity and which are created
				by the model or the way it processes the signal.
			</p>
		</div>
	</AcademicSection>

	<AcademicSection id="publications" title="Publications">
		<section id="peer-reviewed" aria-labelledby="peer-reviewed-heading">
			<h3 id="peer-reviewed-heading" class="text-fg text-sm leading-6 font-semibold">
				Peer-reviewed
			</h3>
			<AcademicPublicationList items={data.peerReviewed} start={1} showBibtex={true} />
		</section>
		<section id="other-research" aria-labelledby="other-research-heading" class="mt-8">
			<h3 id="other-research-heading" class="text-fg text-sm leading-6 font-semibold">
				Preprints, registered protocols &amp; doctoral work
			</h3>
			<AcademicPublicationList
				items={data.otherResearch}
				start={data.peerReviewed.length + 1}
				showBibtex={true}
			/>
		</section>
		<section id="under-review" aria-labelledby="under-review-heading" class="mt-8">
			<h3 id="under-review-heading" class="text-fg text-sm leading-6 font-semibold">
				Under review and manuscripts
			</h3>
			<AcademicPublicationList
				items={data.underReview}
				start={data.peerReviewed.length + data.otherResearch.length + 1}
				showBibtex={true}
			/>
		</section>
		<p class="mt-5">
			<Link href="/publications" variant="arrow" class="min-h-6">View all publications</Link>
		</p>
	</AcademicSection>

	<AcademicSection id="projects" title="Projects">
		<ol class="divide-border divide-y" role="list">
			{#each data.selectedProjects as project (project.slug)}
				<li class="py-5 first:pt-0">
					<h3 class="text-fg leading-6 font-medium">
						<Link href={`/projects/${project.slug}`} variant="plain">{project.title}</Link>
					</h3>
					{#if project.role}
						<p class="text-fg-muted mt-1 text-xs leading-5">{project.role} · {project.domain}</p>
					{/if}
					{#if project.summary}
						<p class="text-fg-soft mt-2 text-sm leading-6">{project.summary}</p>
					{/if}
					{#if project.tech.length}
						<p class="font-mono text-fg-muted mt-2 text-xs leading-5">
							{project.tech.join(' · ')}
						</p>
					{/if}
					{#if project.links.live || project.links.repo || project.links.caseStudy}
						<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
							{#if project.links.live}
								<Link
									href={project.links.live}
									variant="inline"
									class="inline-flex min-h-6 items-center"
									aria-label={`Live site for ${project.title}`}>Live site</Link
								>
							{/if}
							{#if project.links.repo}
								<Link
									href={project.links.repo}
									variant="inline"
									class="inline-flex min-h-6 items-center"
									aria-label={`Repository for ${project.title}`}>Code</Link
								>
							{/if}
							{#if project.links.caseStudy}
								<Link
									href={project.links.caseStudy}
									variant="inline"
									class="inline-flex min-h-6 items-center"
									aria-label={`Case study for ${project.title}`}>Case study</Link
								>
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ol>
		<p class="mt-5">
			<Link href="/projects" variant="arrow" class="min-h-6">View all projects</Link>
		</p>
	</AcademicSection>

	<AcademicSection id="talks" title="Talks">
		<ol class="divide-border divide-y" role="list">
			{#each data.talks as talk (talk.slug)}
				<li class="grid gap-2 py-4 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
					<div class="min-w-0">
						<h3 class="text-fg text-sm leading-6 font-medium">
							<Link href={`/talks/${talk.slug}`} variant="plain">{talk.title}</Link>
						</h3>
						<p class="text-fg-soft mt-1 text-sm leading-6">{talk.event}</p>
					</div>
					<p class="font-mono text-fg-muted text-xs leading-6">{talk.year}</p>
				</li>
			{/each}
		</ol>
		<p class="mt-5">
			<Link href="/talks" variant="arrow" class="min-h-6">View all talks</Link>
		</p>
	</AcademicSection>

	<AcademicSection id="experience" title="Experience">
		<ol class="divide-border divide-y" role="list">
			{#each data.experience as item (item.slug)}
				<li class="py-5 first:pt-0">
					<h3 class="text-fg leading-6 font-medium">{item.role}</h3>
					<p class="text-fg-soft mt-1 text-sm leading-6">{item.organization}</p>
					<p class="font-mono text-fg-muted mt-2 text-xs leading-5">
						{#if item.startedAt}
							{item.startedAt} – {item.endedAt ?? 'Present'}
						{:else if item.endedAt}
							Until {item.endedAt}
						{:else}
							Current role
						{/if}
						{#if item.location}
							· {item.location}{/if}
					</p>
					{#if item.summary}
						<p class="text-fg-soft mt-2 text-sm leading-6">{item.summary}</p>
					{/if}
				</li>
			{/each}
		</ol>
	</AcademicSection>

	<AcademicSection id="education" title="Education">
		<ol class="divide-border divide-y" role="list">
			{#each data.education as item (item.slug)}
				<li class="py-5 first:pt-0">
					<h3 class="text-fg leading-6 font-medium">{item.degree}</h3>
					<p class="text-fg-soft mt-1 text-sm leading-6">{item.institution}</p>
					{#if item.field}
						<p class="text-fg-soft mt-1 text-sm leading-6">{item.field}</p>
					{/if}
					<p class="font-mono text-fg-muted mt-2 text-xs leading-5">
						{item.progressionStatus === 'in-progress' ? 'In progress' : 'Completed'}
						{#if item.startedAt}
							· {item.startedAt} – {item.endedAt ?? 'Present'}
						{/if}
					</p>
					{#if item.advisor}
						<p class="text-fg-soft mt-2 text-sm leading-6">Supervisor: {item.advisor}</p>
					{/if}
					{#if item.summary}
						<p class="text-fg-soft mt-2 text-sm leading-6">{item.summary}</p>
					{/if}
				</li>
			{/each}
		</ol>
	</AcademicSection>
</Container>
