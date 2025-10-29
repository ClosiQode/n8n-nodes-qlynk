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
		description: 'Lists all your shortened URLs. NO PARAMETERS REQUIRED. RETURNS: Array of URL objects, each with short_code, short_url, original_url, title, description.',
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
			returnData.push({ json: responseData });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message } });
			} else {
				throw error;
			}
		}

		return this.prepareOutputData(returnData);
	}
}
