#!/bin/bash

# Fix pattern for all nodes
files=(
  "nodes/DeleteUrl/DeleteUrl.node.ts"
  "nodes/DeleteCategory/DeleteCategory.node.ts"
  "nodes/CreateCategory/CreateCategory.node.ts"
  "nodes/GetCategory/GetCategory.node.ts"
  "nodes/ListCategories/ListCategories.node.ts"
  "nodes/UpdateCategory/UpdateCategory.node.ts"
  "nodes/Statistics/Statistics.node.ts"
)

for file in "${files[@]}"; do
  echo "Fixing $file..."
  sed -i 's/const returnData: any\[\] = \[\];/const returnData: INodeExecutionData[] = [];/g' "$file"
  sed -i 's/returnData\.push(responseData);/returnData.push({ json: responseData });/g' "$file"
  sed -i 's/returnData\.push({ error:/returnData.push({ json: { error:/g' "$file"
  sed -i 's/return \[this\.helpers\.returnJsonArray(returnData)\];/return this.prepareOutputData(returnData);/g' "$file"
done

echo "Done!"
