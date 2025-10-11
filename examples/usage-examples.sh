#!/bin/bash

# fd-postman-cli Usage Examples
# Make this script executable: chmod +x usage-examples.sh

echo "==============================================="
echo "fd-postman-cli Usage Examples"
echo "==============================================="
echo ""

# Example 1: Simple GET request
echo "Example 1: Simple GET request"
echo "Command: fp get https://jsonplaceholder.typicode.com/posts/1"
fp get https://jsonplaceholder.typicode.com/posts/1
echo ""
read -p "Press enter to continue..."
echo ""

# Example 2: GET with query parameters
echo "Example 2: GET with query parameters"
echo "Command: fp get https://jsonplaceholder.typicode.com/posts -q \"userId=1\""
fp get https://jsonplaceholder.typicode.com/posts -q "userId=1"
echo ""
read -p "Press enter to continue..."
echo ""

# Example 3: GET with custom headers
echo "Example 3: GET with custom headers"
echo "Command: fp get https://jsonplaceholder.typicode.com/posts/1 -H \"Accept: application/json\""
fp get https://jsonplaceholder.typicode.com/posts/1 -H "Accept: application/json"
echo ""
read -p "Press enter to continue..."
echo ""

# Example 4: POST with JSON data
echo "Example 4: POST with JSON data"
echo "Command: fp post https://jsonplaceholder.typicode.com/posts -d '{\"title\":\"foo\",\"body\":\"bar\",\"userId\":1}'"
fp post https://jsonplaceholder.typicode.com/posts -d '{"title":"foo","body":"bar","userId":1}'
echo ""
read -p "Press enter to continue..."
echo ""

# Example 5: POST with data from file
echo "Example 5: POST with data from file"
echo "Command: fp post https://jsonplaceholder.typicode.com/posts -d @examples/sample-request.json"
fp post https://jsonplaceholder.typicode.com/posts -d @examples/sample-request.json
echo ""
read -p "Press enter to continue..."
echo ""

# Example 6: PUT request
echo "Example 6: PUT request"
echo "Command: fp put https://jsonplaceholder.typicode.com/posts/1 -d '{\"id\":1,\"title\":\"updated\",\"body\":\"updated body\",\"userId\":1}'"
fp put https://jsonplaceholder.typicode.com/posts/1 -d '{"id":1,"title":"updated","body":"updated body","userId":1}'
echo ""
read -p "Press enter to continue..."
echo ""

# Example 7: PATCH request
echo "Example 7: PATCH request"
echo "Command: fp patch https://jsonplaceholder.typicode.com/posts/1 -d '{\"title\":\"patched title\"}'"
fp patch https://jsonplaceholder.typicode.com/posts/1 -d '{"title":"patched title"}'
echo ""
read -p "Press enter to continue..."
echo ""

# Example 8: DELETE request
echo "Example 8: DELETE request"
echo "Command: fp delete https://jsonplaceholder.typicode.com/posts/1"
fp delete https://jsonplaceholder.typicode.com/posts/1
echo ""
read -p "Press enter to continue..."
echo ""

# Example 9: Save response to file
echo "Example 9: Save response to file"
echo "Command: fp get https://jsonplaceholder.typicode.com/posts/1 -o response.json"
fp get https://jsonplaceholder.typicode.com/posts/1 -o response.json
echo ""
echo "Response saved to response.json"
cat response.json
rm response.json
echo ""

echo "==============================================="
echo "All examples completed!"
echo "==============================================="

