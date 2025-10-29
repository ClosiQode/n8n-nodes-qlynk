import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class QlynkUrlGet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk URL Get',
		name: 'qlynkUrlGet',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to retrieve detailed information about a specific short link by its short code. Returns all link data including the original URL, title, description, statistics, and metadata.',
		defaults: {
			name: 'Qlynk URL Get',
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
				displayName: 'Short Code',
				name: 'short_code',
				type: 'string',
				default: '',
				placeholder: 'abc123',
				description: 'The short code of the link to retrieve (the part after qlynk.fr/)',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const short_code = this.getNodeParameter('short_code', i) as string;
				const responseData = await makeQlynkRequest(this, 'GET', `/urls/${short_code}`);

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
