import { getQuestions } from '$lib/api/api';
import { QuestionType } from '$lib/model/question';

export async function GET() {
	const types: QuestionType[] = Object.values(QuestionType);

	const quizTypeLinks = types.map(
		(t) =>
			`
            <url>
                <loc>https://thw-tools.de/quiz/${t}/</loc>
                <priority>0.7</priority>
            </url>
            <url>
                <loc>https://thw-tools.de/quiz/${t}/listing/</loc>
                <priority>0.8</priority>
            </url>`
	);

	const singleQuestionLinks = await Promise.all(
		types.map(async (t) => {
			const questionIds = await getQuestions(t);
			return questionIds
				.sort((a, b) => a.number - b.number)
				.map(
					(q) =>
						`
                    <url>
                        <loc>https://thw-tools.de/quiz/${t}/${q.number}/</loc>
                        <priority>0.6</priority>
                    </url>`
				)
				.join('');
		})
	);

	return new Response(
		`
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
        <url>
            <loc>https://thw-tools.de/</loc>
            <priority>1.00</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/faq/</loc>
            <priority>0.9</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/clothing/</loc>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/funkrufnamen/</loc>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/quiz/stats/</loc>
            <priority>0.4</priority>
        </url>
        ${quizTypeLinks.join('')}
        ${singleQuestionLinks.join('')}
      </urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
