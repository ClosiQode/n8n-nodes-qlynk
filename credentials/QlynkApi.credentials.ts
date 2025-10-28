import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class QlynkApi implements ICredentialType {
	name = 'qlynkApi';
	displayName = 'Qlynk API';
	documentationUrl = 'https://qlynk.fr/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://qlynk.fr',
			placeholder: 'https://qlynk.fr',
			description: 'The base URL of your Qlynk instance',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'abc123...xyz789',
			description: 'The API key for authentication. You can generate one from your Qlynk dashboard under Profile > API Keys.',
			required: true,
		},
	];

	// This allows the credential to be used by other nodes using requestWithAuthentication
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.apiKey}}',
			},
		},
	};

	// Test the credentials
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/api/v1/categories',
			method: 'GET',
		},
	};
}
