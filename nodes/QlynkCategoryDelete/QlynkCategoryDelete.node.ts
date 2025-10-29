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

export class QlynkCategoryDelete implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk Category Delete',
		name: 'qlynkCategoryDelete',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Delete a category',
		defaults: {
			name: 'Qlynk Category Delete',
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
				description: 'The ID of the category to delete',
				required: true,
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions): Promise<SupplyData> {
		const tool = new DynamicTool({
			name: 'qlynk_category_delete',
			description: 'Delete a category by its ID. Input should be a JSON object with: category_id (required)',
			func: async (input: string): Promise<string> => {
				const params = parseToolInput(input);
				const response = await makeQlynkRequest(
					this,
					'DELETE',
					`/categories/${params.category_id}`,
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
				const responseData = await makeQlynkRequest(this, 'DELETE', `/categories/${category_id}`);

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
