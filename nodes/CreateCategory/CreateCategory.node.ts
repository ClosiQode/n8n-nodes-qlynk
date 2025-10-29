import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from "n8n-workflow";
import { makeQlynkRequest } from "../utils/helpers";

export class CreateCategory implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Qlynk - Create Category",
		name: "createCategory",
		icon: "file:qlynk.png",
		group: ["transform"],
		version: 1,
		description: "Use this tool to create a new category for organizing your short links. Provide a name, and optionally customize the color and icon. Returns the created category with its ID.",
		defaults: {
			name: "Create Category",
		},
		inputs: ["main"],
		outputs: ["main"],
		usableAsTool: true,
		credentials: [
			{
				name: "qlynkApi",
				required: true,
			},
		],
		properties: [
			{
				displayName: "Category Name",
				name: "name",
				type: "string",
				default: "",
				placeholder: "Social Media",
				description: "The name of the category",
				required: true,
			},
			{
				displayName: "Color",
				name: "color",
				type: "string",
				default: "#3b82f6",
				placeholder: "#3b82f6",
				description: "Hex color code for the category (e.g., #3b82f6 for blue)",
			},
			{
				displayName: "Icon",
				name: "icon",
				type: "string",
				default: "folder",
				placeholder: "folder",
				description: "Font Awesome icon name without fa- prefix (e.g., folder, star, tag)",
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const name = this.getNodeParameter("name", i) as string;
				const color = this.getNodeParameter("color", i, "#3b82f6") as string;
				const icon = this.getNodeParameter("icon", i, "folder") as string;

				const body = { name, color, icon };
				const responseData = await makeQlynkRequest(this, "POST", "/categories", body);

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
