import fs from 'fs/promises';
import path from 'path';
import type { PageServerLoad } from './$types';
import type { ProtectiveSuite } from '$lib/cbrn/ProtectiveSuite';

export const prerender = true;

export const load = (async () => {
	const staticFolderPath = path.join(process.cwd(), 'static');
	const jsonFolderPath = path.join(staticFolderPath, 'cbrn/protectiveSuites/');
	const fileNames = await fs.readdir(jsonFolderPath);

	const jsonData: ProtectiveSuite[] = await Promise.all(
		fileNames.map(async (fileName) => {
			if (path.extname(fileName) === '.json') {
				const filePath = path.join(jsonFolderPath, fileName);
				const fileContent = await fs.readFile(filePath, 'utf-8');
				return JSON.parse(fileContent);
			}
		})
	);

	return {
		allProtectiveSuites: jsonData
	};
}) satisfies PageServerLoad;
