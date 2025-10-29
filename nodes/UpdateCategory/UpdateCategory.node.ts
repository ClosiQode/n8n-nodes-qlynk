import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class UpdateCategory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - Update Category',
		name: 'updateCategory',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to update an existing category. You can change its name, color, or icon. Provide the category ID and the new values.',
		defaults: {
			name: 'Update Category',
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
				displayName: 'Category ID',
				name: 'category_id',
				type: 'number',
				default: 0,
				placeholder: '1',
				description: 'REQUIRED: The numeric ID of the category to update',
			},
			{
				displayName: 'Category Name',
				name: 'name',
				type: 'string',
				default: '',
				placeholder: 'Social Media',
				description: 'REQUIRED: The new name for the category',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '#3b82f6',
				placeholder: '#3b82f6',
				description: 'New hex color code (e.g., #3b82f6 for blue)',
			},
			{
				displayName: 'Icon',
				name: 'icon',
				type: 'string',
				default: 'folder',
				placeholder: 'folder',
				description: 'New Font Awesome icon name without fa- prefix',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const category_id = this.getNodeParameter('category_id', i, 0) as number;
				if (!category_id || category_id <= 0) {
					throw new Error('The "category_id" parameter is required and must be > 0.');
				}
				const name = this.getNodeParameter('name', i, '') as string;
				if (!name || name.trim() === '') {
					throw new Error('The "name" parameter is required.');
				}
				const color = this.getNodeParameter('color', i, '#3b82f6') as string;
				const icon = this.getNodeParameter('icon', i, 'folder') as string;

				const body = { name, color, icon };
				const responseData = await makeQlynkRequest(this, 'PUT', `/categories/${category_id}`, body);

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
