import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
	
} from 'n8n-workflow';
import { DynamicTool } from '@langchain/core/tools';
import { makeQlynkRequest, formatToolResponse } from '../utils/helpers';

export class QlynkCategoryList implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk Category List',
		name: 'qlynkCategoryList',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'List all your categories',
		defaults: {
			name: 'Qlynk Category List',
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
		properties: [],
	};

	async supplyData(this: ISupplyDataFunctions): Promise<SupplyData> {
		const tool = new DynamicTool({
			name: 'qlynk_category_list',
			description: 'List all your categories from Qlynk. No input required.',
			func: async (): Promise<string> => {
				const response = await makeQlynkRequest(this, 'GET', '/categories');
				return formatToolResponse(response);
			},
		});

		return {
			response: tool,
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];

		try {
			const responseData = await makeQlynkRequest(this, 'GET', '/categories');

			// Pour list, on retourne une seule fois le résultat
			returnData.push({
				json: responseData,
				pairedItem: { item: 0 },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
					},
					pairedItem: { item: 0 },
				});
			} else {
				throw error;
			}
		}

		return [returnData];
	}
}
