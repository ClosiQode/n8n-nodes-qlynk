import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class QlynkCategoryDelete implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk URL Delete',
		name: 'qlynkCategoryDelete',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to permanently delete a category by its code. This action cannot be undone. All statistics associated with this link will also be deleted.',
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
				name: 'category_id',
				type: 'number',
				default: '',
				placeholder: '1',
				description: 'The numeric ID of the category to delete',
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
