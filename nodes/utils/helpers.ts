import type { IExecuteFunctions } from 'n8n-workflow';
import type { QlynkApiResponse } from './types';

/**
 * Make an authenticated request to Qlynk API
 */
export async function makeQlynkRequest(
	context: IExecuteFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	endpoint: string,
	body?: any,
): Promise<QlynkApiResponse> {
	const options: any = {
		method,
		url: `https://qlynk.fr/api/v1${endpoint}`,
		json: true,
	};

	if (body) {
		options.body = body;
	}

	try {
		const response = await context.helpers.requestWithAuthentication.call(
			context,
			'qlynkApi',
			options,
		);
		return response as QlynkApiResponse;
	} catch (error) {
		throw new Error(`Qlynk API Error: ${(error as Error).message}`);
	}
}
