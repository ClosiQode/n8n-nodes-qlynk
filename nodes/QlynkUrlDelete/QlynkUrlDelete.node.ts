import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class QlynkUrlDelete implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk URL Delete',
		name: 'qlynkUrlDelete',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to permanently delete a short link by its code. This action cannot be undone. All statistics associated with this link will also be deleted.',
		defaults: {
			name: 'Qlynk URL Delete',
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
				description: 'The short code of the link to delete',
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
				const responseData = await makeQlynkRequest(this, 'DELETE', `/urls/${short_code}`);

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
