import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class UpdateUrl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - Update URL',
		name: 'updateUrl',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to update an existing short link. You can modify the original URL, title, description, indexing settings, or change the category. Provide the short code to identify which link to update.',
		defaults: {
			name: 'Update URL',
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
				displayName: 'Short Code',
				name: 'short_code',
				type: 'string',
				default: '',
				placeholder: 'abc123',
				description: 'The short code of the link to update',
				required: true,
			},
			{
				displayName: 'Original URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/my-long-url',
				description: 'The new long URL to point to. Leave empty to keep the current URL.',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				placeholder: 'My Link Title',
				description: 'New title for the link. Leave empty to keep the current title.',
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
				description: 'New description for the link. Leave empty to keep the current description.',
			},
			{
				displayName: 'Is Indexed',
				name: 'is_indexed',
				type: 'boolean',
				default: true,
				description: 'Whether the link should be indexed by search engines',
			},
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'number',
				default: 0,
				placeholder: '1',
				description: 'New category ID. Use 0 to remove from category.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const short_code = this.getNodeParameter('short_code', i) as string;
				const url = this.getNodeParameter('url', i, '') as string;
				const title = this.getNodeParameter('title', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const is_indexed = this.getNodeParameter('is_indexed', i, true) as boolean;
				const category_id = this.getNodeParameter('category_id', i, 0) as number;

				const body: any = {};
				if (url) body.url = url;
				if (title) body.title = title;
				if (description) body.description = description;
				body.is_indexed = is_indexed ? 1 : 0;
				if (category_id > 0) body.category_id = category_id;

				const responseData = await makeQlynkRequest(this, 'PUT', `/urls/${short_code}`, body);

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
