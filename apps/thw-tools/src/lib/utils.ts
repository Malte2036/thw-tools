import { version } from '$app/environment';
import { trackIdentity } from '@thw-tools/shared/dist/analytics';
import { formatDate } from '@thw-tools/shared/dist/date';

export async function trackBuildIdentity() {
	await trackIdentity(formatDate(+version));
}
