import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { makeQlynkRequest } from '../utils/helpers';

export class QlynkStats implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk Stats',
		name: 'qlynkStats',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Use this tool to retrieve detailed statistics for a short link. Provide the short code and optionally a time period (day, week, month, year, or all). Returns visit counts, geographic data, devices, browsers, and referrers.',
		defaults: {
			name: 'Qlynk Stats',
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
				description: 'The short code of the link to get statistics for',
				required: true,
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
				const short_code = this.getNodeParameter('short_code', i) as string;
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
