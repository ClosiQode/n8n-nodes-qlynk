import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Qlynk implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qlynk',
		name: 'qlynk',
		icon: 'file:qlynk.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Qlynk URL shortener API - Create, manage and track short links',
		defaults: {
			name: 'Qlynk',
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
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'URL',
						value: 'url',
						description: 'Manage short links',
					},
					{
						name: 'Category',
						value: 'category',
						description: 'Organize links into categories',
					},
					{
						name: 'Stats',
						value: 'stats',
						description: 'Get link statistics',
					},
				],
				default: 'url',
			},

			// URL Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['url'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new short link',
						action: 'Create a short link',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a short link by code',
						action: 'Get a short link',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all your short links',
						action: 'List short links',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a short link',
						action: 'Update a short link',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a short link',
						action: 'Delete a short link',
					},
				],
				default: 'create',
			},

			// Category Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['category'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new category',
						action: 'Create a category',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a category by ID',
						action: 'Get a category',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all your categories',
						action: 'List categories',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a category',
						action: 'Update a category',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a category',
						action: 'Delete a category',
					},
				],
				default: 'list',
			},

			// Stats Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['stats'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get statistics for a short link',
						action: 'Get statistics',
					},
				],
				default: 'get',
			},

			// URL Create Fields
			{
				displayName: 'Original URL',
				name: 'url',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'https://example.com/my-long-url',
				description: 'The long URL to shorten',
				required: true,
			},
			{
				displayName: 'Custom Code',
				name: 'custom_code',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: 'my-link',
				description: 'Optional custom short code. If not provided, a random code will be generated.',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'My Link Title',
				description: 'Optional title for the link',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'Description of the link',
				description: 'Optional description for the link',
			},
			{
				displayName: 'Is Indexed',
				name: 'is_indexed',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['create', 'update'],
					},
				},
				default: true,
				description: 'Whether the link should be indexed by search engines',
			},
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['create', 'update'],
					},
				},
				default: 0,
				placeholder: '1',
				description: 'Optional category ID to organize the link',
			},

			// URL Get/Update/Delete Fields
			{
				displayName: 'Short Code',
				name: 'short_code',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				placeholder: 'abc123',
				description: 'The short code of the link',
				required: true,
			},

			// URL Update - Original URL
			{
				displayName: 'Original URL',
				name: 'url',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['url'],
						operation: ['update'],
					},
				},
				default: '',
				placeholder: 'https://example.com/my-long-url',
				description: 'The new long URL',
			},

			// Category Create/Update Fields
			{
				displayName: 'Category Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'Social Media',
				description: 'The name of the category',
				required: true,
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['create', 'update'],
					},
				},
				default: '#3b82f6',
				placeholder: '#3b82f6',
				description: 'Hex color code for the category',
			},
			{
				displayName: 'Icon',
				name: 'icon',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['create', 'update'],
					},
				},
				default: 'folder',
				placeholder: 'folder',
				description: 'Font Awesome icon name (without fa- prefix)',
			},

			// Category Get/Update/Delete Fields
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['category'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				placeholder: '1',
				description: 'The ID of the category',
				required: true,
			},

			// Stats Fields
			{
				displayName: 'Short Code',
				name: 'short_code',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['stats'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: 'abc123',
				description: 'The short code to get statistics for',
				required: true,
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['stats'],
						operation: ['get'],
					},
				},
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				// URL Resource
				if (resource === 'url') {
					if (operation === 'create') {
						const url = this.getNodeParameter('url', i) as string;
						const custom_code = this.getNodeParameter('custom_code', i, '') as string;
						const title = this.getNodeParameter('title', i, '') as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const is_indexed = this.getNodeParameter('is_indexed', i, true) as boolean;
						const category_id = this.getNodeParameter('category_id', i, 0) as number;

						const body: any = { url };
						if (custom_code) body.custom_code = custom_code;
						if (title) body.title = title;
						if (description) body.description = description;
						body.is_indexed = is_indexed ? 1 : 0;
						if (category_id > 0) body.category_id = category_id;

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'POST',
								url: 'https://qlynk.fr/api/v1/urls',
								body,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'get') {
						const short_code = this.getNodeParameter('short_code', i) as string;

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'GET',
								url: `https://qlynk.fr/api/v1/urls/${short_code}`,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'list') {
						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'GET',
								url: 'https://qlynk.fr/api/v1/urls',
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'update') {
						const short_code = this.getNodeParameter('short_code', i) as string;
						const url = this.getNodeParameter('url', i, '') as string;
						const title = this.getNodeParameter('title', i, '') as string;
						const description = this.getNodeParameter('description', i, '') as string;
						const is_indexed = this.getNodeParameter('is_indexed', i, true) as boolean;
						const category_id = this.getNodeParameter('category_id', i, 0) as number;

						const body: any = {};
						if (url) body.url = url;
						if (title) body.title = title;
						if (description) body.description = description;
						body.is_indexed = is_indexed ? 1 : 0;
						if (category_id > 0) body.category_id = category_id;

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'PUT',
								url: `https://qlynk.fr/api/v1/urls/${short_code}`,
								body,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'delete') {
						const short_code = this.getNodeParameter('short_code', i) as string;

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'DELETE',
								url: `https://qlynk.fr/api/v1/urls/${short_code}`,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}
				}

				// Category Resource
				if (resource === 'category') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const color = this.getNodeParameter('color', i, '#3b82f6') as string;
						const icon = this.getNodeParameter('icon', i, 'folder') as string;

						const body = { name, color, icon };

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'POST',
								url: 'https://qlynk.fr/api/v1/categories',
								body,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'get') {
						const category_id = this.getNodeParameter('category_id', i) as number;

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'GET',
								url: `https://qlynk.fr/api/v1/categories/${category_id}`,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'list') {
						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'GET',
								url: 'https://qlynk.fr/api/v1/categories',
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'update') {
						const category_id = this.getNodeParameter('category_id', i) as number;
						const name = this.getNodeParameter('name', i) as string;
						const color = this.getNodeParameter('color', i, '#3b82f6') as string;
						const icon = this.getNodeParameter('icon', i, 'folder') as string;

						const body = { name, color, icon };

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'PUT',
								url: `https://qlynk.fr/api/v1/categories/${category_id}`,
								body,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}

					if (operation === 'delete') {
						const category_id = this.getNodeParameter('category_id', i) as number;

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'DELETE',
								url: `https://qlynk.fr/api/v1/categories/${category_id}`,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}
				}

				// Stats Resource
				if (resource === 'stats') {
					if (operation === 'get') {
						const short_code = this.getNodeParameter('short_code', i) as string;
						const period = this.getNodeParameter('period', i, 'week') as string;

						const responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'qlynkApi',
							{
								method: 'GET',
								url: `https://qlynk.fr/api/v1/stats/${short_code}?period=${period}`,
								json: true,
							},
						);

						returnData.push({
							json: responseData,
							pairedItem: { item: i },
						});
					}
				}
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
