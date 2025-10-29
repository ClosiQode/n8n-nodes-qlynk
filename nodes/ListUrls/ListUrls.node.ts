import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class ListUrls implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - List URLs',
		name: 'listUrls',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to list all short links in your Qlynk account. Returns a complete list with all link details including codes, URLs, titles, categories, and statistics.',
		defaults: {
			name: 'List URLs',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: INodeExecutionData[] = [];

		try {
			const responseData = await makeQlynkRequest(this, 'GET', '/urls');

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
