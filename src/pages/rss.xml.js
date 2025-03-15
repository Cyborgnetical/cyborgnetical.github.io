import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const posts = await getCollection('Notes');
	return rss({
		title: "PlaceHolde",
		description: "PlaceHolder-Banana",
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/notes/${post.id}/`,
		})),
	});
}
