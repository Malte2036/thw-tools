import { getAllDatabaseQuestions } from '$lib/Database';
import type { QuestionType } from '$lib/quiz/question/Question';

export async function GET() {
	const types: QuestionType[] = ['ga', 'agt', 'cbrn'];
	const singleQuestionLinks = await Promise.all(
		types.map(async (t) => {
			const questions = await getAllDatabaseQuestions(t);
			return questions
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
            <loc>https://thw-tools.de/quiz/ga/</loc>
            <priority>0.7</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/quiz/ga/listing/</loc>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/quiz/agt/</loc>
            <priority>0.7</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/quiz/agt/listing/</loc>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/quiz/cbrn/</loc>
            <priority>0.7</priority>
        </url>
        <url>
            <loc>https://thw-tools.de/quiz/cbrn/listing/</loc>
            <priority>0.8</priority>
        </url>
        ${singleQuestionLinks.join('')}
      </urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
