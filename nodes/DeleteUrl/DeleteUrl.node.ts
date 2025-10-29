import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class DeleteUrl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - Delete URL',
		name: 'deleteUrl',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Deletes a shortened URL permanently. REQUIRED: short_code (string). RETURNS: Success confirmation message.',
		defaults: {
			name: 'Delete URL',
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
				description: 'REQUIRED: The short code of the link to delete',
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
				const responseData = await makeQlynkRequest(this, 'DELETE', `/urls/${short_code}`);
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
