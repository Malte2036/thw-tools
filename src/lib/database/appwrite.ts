import { Client, Databases, Account, Graphql } from 'appwrite';
import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECTID } from '$env/static/public';

const endpoint =
	PUBLIC_APPWRITE_ENDPOINT.startsWith('http') || typeof window === 'undefined'
		? PUBLIC_APPWRITE_ENDPOINT
		: `https://${window.location.hostname}${PUBLIC_APPWRITE_ENDPOINT}`;

const client = new Client();
client.setEndpoint(endpoint).setProject(PUBLIC_APPWRITE_PROJECTID);

export const account = new Account(client);
export const databases = new Databases(client);
export const graphql = new Graphql(client);
