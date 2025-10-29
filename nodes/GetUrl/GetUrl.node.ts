import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class GetUrl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - Get URL',
		name: 'getUrl',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Retrieves details of a shortened URL. REQUIRED: short_code (string). RETURNS: Complete URL object with short_code, short_url, original_url, title, description, category_id, created_at.',
		defaults: {
			name: 'Get URL',
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
				description: 'REQUIRED: The short code of the link to retrieve (the part after qlynk.fr/)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const short_code = this.getNodeParameter('short_code', i, '') as string;
				if (!short_code || short_code.trim() === '') {
					throw new Error('The "short_code" parameter is required.');
				}
				const responseData = await makeQlynkRequest(this, 'GET', `/urls/${short_code}`);
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
