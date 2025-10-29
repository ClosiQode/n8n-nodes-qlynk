import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class QlynkCategoryGet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk Category Get',
		name: 'qlynkCategoryGet',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to retrieve detailed information about a specific category by its ID. Returns the category name, color, icon, and associated links count.',
		defaults: {
			name: 'Qlynk Category Get',
		},
		inputs: ['main'],
		outputs: ['main'],
		// usableAsTool: true,
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
				description: 'The numeric ID of the category to retrieve',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const category_id = this.getNodeParameter('category_id', i) as number;
				const responseData = await makeQlynkRequest(this, 'GET', `/categories/${category_id}`);

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
