import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class QlynkUrlCreate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk URL Create',
		name: 'qlynkUrlCreate',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to create a new shortened URL with Qlynk. Provide the long URL to shorten, optionally with a custom code, title, description, and category. Returns the complete short link information including the short code and full short URL.',
		defaults: {
			name: 'Qlynk URL Create',
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
				description: 'The long URL that you want to shorten',
				required: true,
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
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const url = this.getNodeParameter('url', i) as string;
				const custom_code = this.getNodeParameter('custom_code', i, '') as string;
				const title = this.getNodeParameter('title', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const is_indexed = this.getNodeParameter('is_indexed', i, true) as boolean;
				const category_id = this.getNodeParameter('category_id', i, 0) as number;

				const body: any = { url };
				if (custom_code) body.custom_code = custom_code;
				if (title) body.title = title;
				if (description) body.description = description;
				body.is_indexed = is_indexed ? 1 : 0;
				if (category_id > 0) body.category_id = category_id;

				const responseData = await makeQlynkRequest(this, 'POST', '/urls', body);

				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
