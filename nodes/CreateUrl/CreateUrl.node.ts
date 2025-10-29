import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class CreateUrl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - Create URL',
		name: 'createUrl',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Creates a shortened URL using Qlynk. REQUIRED: Provide the long URL to shorten. OPTIONAL: custom_code for vanity URL, title, description, is_indexed (true/false), category_id (number). RETURNS: Object with short_code (string) and short_url (full shortened URL string).',
		defaults: {
			name: 'Create URL',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'qlynkApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Original URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/my-long-url',
				description: 'REQUIRED: The long URL that you want to shorten',
			},
			{
				displayName: 'Custom Code',
				name: 'custom_code',
				type: 'string',
				default: '',
				placeholder: 'my-link',
				description: 'Optional custom short code for the URL. If not provided, a random code will be automatically generated.',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				placeholder: 'My Link Title',
				description: 'Optional title for the short link',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				placeholder: 'Description of the link',
				description: 'Optional description for the short link',
			},
			{
				displayName: 'Is Indexed',
				name: 'is_indexed',
				type: 'boolean',
				default: true,
				description: 'Whether the short link should be indexed by search engines (SEO)',
			},
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'number',
				default: 0,
				placeholder: '1',
				description: 'Optional category ID to organize this link. Use 0 or leave empty for no category.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: any[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const url = this.getNodeParameter('url', i, '') as string;
				const custom_code = this.getNodeParameter('custom_code', i, '') as string;
				const title = this.getNodeParameter('title', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const is_indexed = this.getNodeParameter('is_indexed', i, true) as boolean;
				const category_id = this.getNodeParameter('category_id', i, 0) as number;

				// Validation manuelle pour AI Agent compatibility
				if (!url || url.trim() === '') {
					throw new Error('The "url" parameter is required. Please provide the long URL to shorten.');
				}

				const body: any = { url };
				if (custom_code) body.custom_code = custom_code;
				if (title) body.title = title;
				if (description) body.description = description;
				body.is_indexed = is_indexed ? 1 : 0;
				if (category_id > 0) body.category_id = category_id;

				const responseData = await makeQlynkRequest(this, 'POST', '/urls', body);
				returnData.push(responseData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: (error as Error).message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
