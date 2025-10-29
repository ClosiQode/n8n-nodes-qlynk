// Shared types for Qlynk nodes

export interface QlynkUrlCreate {
	url: string;
	custom_code?: string;
	title?: string;
	description?: string;
	is_indexed?: number;
	category_id?: number;
}

export interface QlynkUrlUpdate {
	url?: string;
	title?: string;
	description?: string;
	is_indexed?: number;
	category_id?: number;
}

export interface QlynkCategory {
	name: string;
	color?: string;
	icon?: string;
}

export interface QlynkStatsParams {
	short_code: string;
	period?: 'day' | 'week' | 'month' | 'year' | 'all';
}

export interface QlynkApiResponse {
	success: boolean;
	data?: any;
	error?: string;
	message?: string;
	[key: string]: any;
}
