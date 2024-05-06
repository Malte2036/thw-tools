import { findQuestions } from '$lib/Database';
import { loadClothingSizesTables } from '$lib/clothing/clothingUtils';
import { QuestionType } from '$lib/model/question';

export async function GET() {
	const types: QuestionType[] = Object.values(QuestionType);

	const singleQuestionLinks = await Promise.all(
		types.map(async (t) => {
			const questionIds = await findQuestions({ type: t }, 'number');
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

	const clothingTables = await loadClothingSizesTables();
	const clothingLinks = clothingTables.map(
		(table) =>
			`
        <url>
            <loc>https://thw-tools.de/clothing/${table.name}/${table.gender}/</loc>
            <priority>0.6</priority>
        </url>`
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
            <loc>https://thw-tools.de/clothing/</loc>
            <priority>0.8</priority>
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
        ${clothingLinks.join('')}
      </urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
