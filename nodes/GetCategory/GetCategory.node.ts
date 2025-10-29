import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class GetCategory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - Get Category',
		name: 'getCategory',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to retrieve detailed information about a specific category by its ID. Returns the category name, color, icon, and associated links count.',
		defaults: {
			name: 'Get Category',
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
				description: 'REQUIRED: The numeric ID of the category to retrieve',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		// When used as AI tool, items.length is 0 but we still need to execute once
		const length = Math.max(items.length, 1);

		for (let i = 0; i < length; i++) {
			try {
				const category_id = this.getNodeParameter('category_id', i, 0) as number;
				if (!category_id || category_id <= 0) {
					throw new Error('The "category_id" parameter is required and must be > 0.');
				}
				const responseData = await makeQlynkRequest(this, 'GET', `/categories/${category_id}`);
				returnData.push({ json: responseData });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return this.prepareOutputData(returnData);
	}
}
