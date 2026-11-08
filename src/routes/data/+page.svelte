<script lang="ts">
	import { Container, Section, Seo, Link, Tag, Card } from '$lib/components';
</script>

<Seo
	title="LEMON EEG Data · Saheed Faremi"
	description="Preprocessed LEMON resting-state EEG data, the Conv-VaDE microstate repository, and a summary of the transition-dynamics companion analysis."
/>

<Container width="narrow">
	<Section spacing="loose" eyebrow="Data" heading="LEMON EEG preprocessed data.">
		<div class="mt-10 space-y-6 text-lg leading-relaxed text-fg">
			<p>
				This page serves as the stable hub for the preprocessed EEG data behind the
				<Link href="https://doi.org/10.1186/s40708-026-00327-9" variant="inline"
					>Conv-VaDE microstate study</Link
				>
				(Brain Informatics, 2026). Links here are kept current; if a mirror moves, this page is
				updated, so cite this page rather than any single download link.
			</p>

			<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
				<Card variant="outlined" class="p-5">
					<p class="font-display text-3xl text-fg">203</p>
					<p class="mt-1 text-sm text-fg-soft">participants, healthy adults</p>
				</Card>
				<Card variant="outlined" class="p-5">
					<p class="font-display text-3xl text-fg">18</p>
					<p class="mt-1 text-sm text-fg-soft">cluster counts per participant, K = 3 to 20</p>
				</Card>
				<Card variant="outlined" class="p-5">
					<p class="font-display text-3xl text-fg">3654</p>
					<p class="mt-1 text-sm text-fg-soft">trained Conv-VaDE models</p>
				</Card>
				<Card variant="outlined" class="p-5">
					<p class="font-display text-3xl text-fg">22</p>
					<p class="mt-1 text-sm text-fg-soft">verified cohort tables</p>
				</Card>
			</div>

			<h2 class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Sources</h2>

			<p>
				<strong>Primary source (canonical).</strong> Recordings originate from the MPI-Leipzig
				Mind-Brain-Body LEMON release (Babayan et al., <em>Scientific Data</em>, 2019). The exact
				archive used in the study, with paired eyes-closed and eyes-open EEGLAB files for the 203
				analysed participants, is hosted by GWDG:
				<Link
					href="https://ftp.gwdg.de/pub/misc/MPI-Leipzig_Mind-Brain-Body-LEMON/EEG_MPILMBB_LEMON/EEG_Preprocessed_BIDS_ID/EEG_Preprocessed/"
					variant="inline">EEG_Preprocessed_BIDS_ID/EEG_Preprocessed</Link
				>.
			</p>

			<p>
				<strong>Processed mirror.</strong> Derived materials (topographic-map extracts, cohort
				metric tables, and the paper's regenerated figures) are mirrored on Google Drive:
				<Link
					href="https://drive.google.com/drive/folders/1aNCnjgy8qX3qWuKtsam5_xZc5nsGr3x6?usp=sharing"
					variant="inline">Conv-VaDE LEMON mirror</Link
				>. Drive folder locations can change; this page always carries the current link.
			</p>

			<h2 class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Repository</h2>

			<p>
				The <Link href="https://github.com/fayisode/cnn_vae_microstate" variant="inline"
					>cnn_vae_microstate repository</Link
				> contains all necessary components for auditing the study: the analysis code, 22 cohort
				tables of per-participant metrics across K = 3 to 20 for all 203 participants, and the
				figure pipeline that rebuilds the five data figures.
			</p>

			<p>
				<code class="text-fg">images/</code> carries the seven paper figures.
				<code class="text-fg">cohort_tables/</code> holds 22 files of per-participant metrics:
				cluster-validity indices for Conv-VaDE and ModKMeans across K = 3 to 20 for all 203
				participants, plus the derived summary tables behind every number quoted in the paper.
				<code class="text-fg">analysis/fig_pipeline/</code> contains the scripts that regenerate
				the five data figures from those tables; <code class="text-fg">build_verified.py</code>
				constructs the tidy frames with completeness asserts, then the per-figure scripts run unchanged.
			</p>

			<p>To reproduce the figures:</p>
			<pre class="overflow-x-auto rounded-card border border-border bg-bg-soft p-4 text-sm leading-relaxed"><code>git clone https://github.com/fayisode/cnn_vae_microstate.git
cd cnn_vae_microstate/analysis/fig_pipeline
python3 build_verified.py          # asserts 203 x 18, no NaN
python3 distributions/raincloud_plots.py
python3 baseline_comparison/vae_vs_baseline.py
python3 k_selection_stats/k_selection.py
python3 run_optimal_k_primary.py   # K* distribution: K=4 76/203, K=3 60/203</code></pre>

			<h2 class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Final results</h2>

			<p>
				The final outputs consist of verified cohort tables and five regenerated data figures.
				Every number quoted in the study traces to the cohort tables in
				<code class="text-fg">cohort_tables/</code>, and the derived tables and figures are mirrored
				in the Conv-VaDE LEMON Drive folder linked above.
			</p>

			<h2 class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">
				Companion analysis: transition dynamics
			</h2>

			<p>
				A companion analysis examined whether the segmentations reproduce the transition
				dynamics established in the classical microstate literature. State sequences from both
				Conv-VaDE and ModKMeans were tested for Markov structure, recurrence properties,
				entropy, and long-range temporal correlations across all 203 participants.
			</p>

			<p>
				A second-order G-squared test against a first-order Markov chain was insignificant for a
				mean of 76.6% of runs, so a first-order chain describes most of the cohort. Against
				first-order Markov surrogates, both methods depart significantly from chance (z = 7.5 for
				Conv-VaDE, z = 8.2 for ModKMeans). Conv-VaDE departs further in absolute magnitude: the
				mean absolute transition-matrix difference is 35.6 ± 15.5%, versus 23.6 ± 9.1% for
				ModKMeans, and it ranks higher in all 203 participants (paired p = 4.6 × 10⁻³⁵, d = 1.38).
			</p>

			<p>
				Recurrence quantification puts determinism at 0.998 with dwell times retained, dropping
				to 0.341 with dwell removed. The apparent structure is carried by how long states persist,
				while the transition rule itself is near-memoryless. Entropy rate rises with the number
				of states, from 0.181 at K = 3 to 0.381 at K = 20, reflecting the cost of a finer state
				alphabet.
			</p>

			<p>
				Occupancy is persistent: the Hurst exponent is 0.833, above 0.5 in every participant.
				The K trade-off is explicit. Decoder reconstruction stays flat across K (0.910 at K = 3
				to 0.905 at K = 20), silhouette decreases from 0.184 to 0.103, and GEV rises from 0.495
				to 0.702. Per-state variance gain drops below 0.01 at K = 8, indicating a data-driven
				balance at K = 8 to 9, while K = 4 remains preferred where alignment with the canonical
				four-microstate literature matters. Taken together, the sequences are persistent in
				occupancy, memoryless in transitions, and more structured under the generative model.
			</p>

			<h2 class="font-mono text-fg-muted text-xs tracking-[0.2em] uppercase">Preprocessing</h2>

			<p><strong>What the preprocessing does, in order.</strong></p>
			<ul class="list-disc space-y-2 pl-6 text-base">
				<li>
					61 scalp electrodes plus one VEOG channel, 10–10 montage, 250 Hz sampling, eyes-closed
					resting condition.
				</li>
				<li>Common-average reference; zero-phase FIR bandpass, 2–20 Hz, to keep microstate
					boundaries temporally aligned.</li>
				<li>Topographic maps extracted at local maxima of the Global Field Power signal with
					pycrostates, minimum inter-peak distance of three samples (12 ms).</li>
				<li>Azimuthal-equidistant projection of electrode positions, cubic-spline interpolation
					to a 40 × 40 topographic image; points outside the electrode convex hull set to zero.</li>
				<li>Per-participant z-score normalisation (clipped at ±5σ) with statistics estimated on
					the training split only, so no evaluation information leaks into the scaling.</li>
				<li>Polarity invariance: each map and its sign-inverted counterpart are treated as the
					same microstate state throughout training and evaluation.</li>
			</ul>

			<p>
				Participant identifiers and the full pipeline are in the
				<Link href="https://github.com/fayisode/cnn_vae_microstate" variant="inline"
					>cnn_vae_microstate repository</Link
				>. Questions and correction requests via the
				<Link href="/contact" variant="inline">contact page</Link>.
			</p>

			<p class="text-fg-soft text-base">
				<Tag variant="outline">EEG</Tag>
				<Tag variant="outline">LEMON</Tag>
				<Tag variant="outline">microstates</Tag>
				<Tag variant="outline">open data</Tag>
			</p>

			<p class="text-fg-soft text-sm">
				Please cite Babayan et al. (2019, Scientific Data 6:180308) for the LEMON dataset and the
				Brain Informatics paper for the processing pipeline.
			</p>
		</div>
	</Section>
</Container>
