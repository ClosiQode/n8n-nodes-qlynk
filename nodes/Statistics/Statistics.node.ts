import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class Statistics implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk - Statistics',
		name: 'statistics',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Gets statistics for a shortened URL. REQUIRED: short_code (string). OPTIONAL: period (\'day\'|\'week\'|\'month\'|\'year\'|\'all\', default \'week\'). RETURNS: Statistics object with total_visits, unique_visitors, devices breakdown, countries list, browsers breakdown.',
		defaults: {
			name: 'Statistics',
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
				description: 'REQUIRED: The short code of the link to get statistics for',
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'options',
				options: [
					{
						name: 'Day',
						value: 'day',
					},
					{
						name: 'Week',
						value: 'week',
					},
					{
						name: 'Month',
						value: 'month',
					},
					{
						name: 'Year',
						value: 'year',
					},
					{
						name: 'All Time',
						value: 'all',
					},
				],
				default: 'week',
				description: 'The time period for the statistics. Choose "week" for last 7 days, "all" for complete history.',
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
				const period = this.getNodeParameter('period', i, 'week') as string;

				const responseData = await makeQlynkRequest(
					this,
					'GET',
					`/stats/${short_code}?period=${period}`,
				);

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
