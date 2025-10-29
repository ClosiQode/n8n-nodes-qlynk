import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	SupplyData,
	
} from 'n8n-workflow';
import { DynamicTool } from '@langchain/core/tools';
import { makeQlynkRequest, formatToolResponse, parseToolInput } from '../utils/helpers';

export class QlynkStats implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk Stats',
		name: 'qlynkStats',
		icon: 'file:qlynk.png',
		group: ['transform'],
		version: 1,
		description: 'Get statistics for a short link',
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
				description: 'The short code to get statistics for',
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
				description: 'The time period for statistics',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions): Promise<SupplyData> {
		const tool = new DynamicTool({
			name: 'qlynk_stats_get',
			description:
				'Get statistics for a short link. Input should be a JSON object with: short_code (required), period (optional: day, week, month, year, all - default: week)',
			func: async (input: string): Promise<string> => {
				const params = parseToolInput(input);
				const period = params.period || 'week';
				const response = await makeQlynkRequest(
					this,
					'GET',
					`/stats/${params.short_code}?period=${period}`,
				);
				return formatToolResponse(response);
			},
		});

		return {
			response: tool,
		};
	}

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
