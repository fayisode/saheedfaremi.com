/**
 * Type declarations for the `virtual:content` virtual module provided by the
 * build-time content plugin (src/lib/content/_plugin.ts).
 *
 * Consumers import:
 *   import content from 'virtual:content';
 *
 * Without these declarations, TypeScript would flag the import as an unknown
 * module. The plugin guarantees the shape; this file mirrors it.
 */
declare module 'virtual:content' {
	import type {
		Award,
		Education,
		Experience,
		News,
		Project,
		Publication,
		Talk
	} from '$lib/content/schemas';

	type ContentMap = {
		projects: Project[];
		publications: Publication[];
		talks: Talk[];
		awards: Award[];
		experience: Experience[];
		education: Education[];
		news: News[];
	};

	const content: Readonly<ContentMap>;
	export default content;
}
