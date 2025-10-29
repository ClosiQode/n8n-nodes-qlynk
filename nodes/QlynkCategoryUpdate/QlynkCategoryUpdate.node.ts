import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
	
} from 'n8n-workflow';
import { DynamicTool } from '@langchain/core/tools';
import { makeQlynkRequest, formatToolResponse, parseToolInput } from '../utils/helpers';

export class QlynkCategoryUpdate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk Category Update',
		name: 'qlynkCategoryUpdate',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Update an existing category',
		defaults: {
			name: 'Qlynk Category Update',
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
				description: 'The ID of the category to update',
				required: true,
			},
			{
				displayName: 'Category Name',
				name: 'name',
				type: 'string',
				default: '',
				placeholder: 'Social Media',
				description: 'The new name of the category',
				required: true,
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				default: '#3b82f6',
				placeholder: '#3b82f6',
				description: 'New hex color code for the category',
			},
			{
				displayName: 'Icon',
				name: 'icon',
				type: 'string',
				default: 'folder',
				placeholder: 'folder',
				description: 'New Font Awesome icon name (without fa- prefix)',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions): Promise<SupplyData> {
		const tool = new DynamicTool({
			name: 'qlynk_category_update',
			description: 'Update an existing category. Input should be a JSON object with: category_id (required), name (required), color (optional), icon (optional)',
			func: async (input: string): Promise<string> => {
				const params = parseToolInput(input);

				const body: any = { name: params.name };
				if (params.color) body.color = params.color;
				if (params.icon) body.icon = params.icon;

				const response = await makeQlynkRequest(
					this,
					'PUT',
					`/categories/${params.category_id}`,
					body,
				);
				return formatToolResponse(response);
			},
		});

		return {
			response: tool,
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const category_id = this.getNodeParameter('category_id', i) as number;
				const name = this.getNodeParameter('name', i) as string;
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
