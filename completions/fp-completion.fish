# Fish completion for fd-postman-cli (fp command)

# Main commands
complete -c fp -f -n "__fish_use_subcommand" -a "get" -d "🌐 Make GET request"
complete -c fp -f -n "__fish_use_subcommand" -a "post" -d "📤 Make POST request"
complete -c fp -f -n "__fish_use_subcommand" -a "put" -d "🔄 Make PUT request"
complete -c fp -f -n "__fish_use_subcommand" -a "delete" -d "🗑️  Make DELETE request"
complete -c fp -f -n "__fish_use_subcommand" -a "patch" -d "✏️  Make PATCH request"
complete -c fp -f -n "__fish_use_subcommand" -a "head" -d "📋 Make HEAD request"
complete -c fp -f -n "__fish_use_subcommand" -a "options" -d "⚙️  Make OPTIONS request"
complete -c fp -f -n "__fish_use_subcommand" -a "env" -d "🌍 Manage environments"
complete -c fp -f -n "__fish_use_subcommand" -a "collection" -d "📦 Manage collections"
complete -c fp -f -n "__fish_use_subcommand" -a "global" -d "🌐 Manage global variables"
complete -c fp -f -n "__fish_use_subcommand" -a "history" -d "📜 View request history"
complete -c fp -f -n "__fish_use_subcommand" -a "workflow" -d "🔄 Manage workflows"
complete -c fp -f -n "__fish_use_subcommand" -a "auth" -d "🔐 Manage authentication"
complete -c fp -f -n "__fish_use_subcommand" -a "import" -d "📥 Import collections/environments"
complete -c fp -f -n "__fish_use_subcommand" -a "export" -d "📤 Export collections/environments"
complete -c fp -f -n "__fish_use_subcommand" -l "version" -d "ℹ️  Show version"
complete -c fp -f -n "__fish_use_subcommand" -l "help" -d "❓ Show help"

# Environment subcommands
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "set" -d "💾 Set environment variable"
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "list" -d "📋 List all environments"
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "show" -d "👁️  Show environment details"
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "unset" -d "❌ Remove environment variable"
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "use" -d "✅ Set active environment"
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "active" -d "🎯 Show active environment"
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "unuse" -d "⏹️  Unset active environment"
complete -c fp -f -n "__fish_seen_subcommand_from env" -a "delete" -d "🗑️  Delete environment"

# Collection subcommands
complete -c fp -f -n "__fish_seen_subcommand_from collection" -a "create" -d "➕ Create new collection"
complete -c fp -f -n "__fish_seen_subcommand_from collection" -a "list" -d "📋 List all collections"
complete -c fp -f -n "__fish_seen_subcommand_from collection" -a "show" -d "👁️  Show collection details"
complete -c fp -f -n "__fish_seen_subcommand_from collection" -a "delete" -d "🗑️  Delete collection"
complete -c fp -f -n "__fish_seen_subcommand_from collection" -a "run" -d "▶️  Run collection"

# Global subcommands
complete -c fp -f -n "__fish_seen_subcommand_from global" -a "set" -d "💾 Set global variable"
complete -c fp -f -n "__fish_seen_subcommand_from global" -a "list" -d "📋 List all global variables"
complete -c fp -f -n "__fish_seen_subcommand_from global" -a "unset" -d "❌ Remove global variable"
complete -c fp -f -n "__fish_seen_subcommand_from global" -a "clear" -d "🗑️  Clear all global variables"

# History subcommands
complete -c fp -f -n "__fish_seen_subcommand_from history" -a "list" -d "📋 List request history"
complete -c fp -f -n "__fish_seen_subcommand_from history" -a "show" -d "👁️  Show history entry"
complete -c fp -f -n "__fish_seen_subcommand_from history" -a "search" -d "🔍 Search history"
complete -c fp -f -n "__fish_seen_subcommand_from history" -a "clear" -d "🗑️  Clear history"
complete -c fp -f -n "__fish_seen_subcommand_from history" -a "replay" -d "🔄 Replay request"

# Workflow subcommands
complete -c fp -f -n "__fish_seen_subcommand_from workflow" -a "run" -d "▶️  Run workflow"
complete -c fp -f -n "__fish_seen_subcommand_from workflow" -a "create" -d "➕ Create workflow"
complete -c fp -f -n "__fish_seen_subcommand_from workflow" -a "list" -d "📋 List workflows"

# Auth subcommands
complete -c fp -f -n "__fish_seen_subcommand_from auth" -a "oauth2-url" -d "🔑 Generate OAuth2 authorization URL"
complete -c fp -f -n "__fish_seen_subcommand_from auth" -a "oauth2-token" -d "🎫 Exchange code for token"
complete -c fp -f -n "__fish_seen_subcommand_from auth" -a "oauth2-client-credentials" -d "🔐 Get client credentials token"
complete -c fp -f -n "__fish_seen_subcommand_from auth" -a "pkce-generate" -d "🔒 Generate PKCE credentials"

# Common options for HTTP methods
set -l http_commands get post put delete patch head options

# Header option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -s H -l header -d "📝 Add custom header"

# Query option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -s q -l query -d "🔍 Add query parameter"

# Data option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -s d -l data -d "📄 Request body data"

# Form option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l form -d "📋 Form data"

# Output option
complete -c fp -r -n "__fish_seen_subcommand_from $http_commands" -s o -l output -d "💾 Save response to file"

# Environment option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l env -d "🌍 Use environment"

# Auth type option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l auth-type -d "🔐 Authentication type" -a "none bearer basic apikey oauth2 aws-sigv4 digest custom"

# Token option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l token -d "🎫 Bearer token"

# Username option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l username -d "👤 Username"

# Password option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l password -d "🔑 Password"

# API key option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l api-key -d "🔐 API key"

# Timeout option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l timeout -d "⏱️  Request timeout (ms)"

# Insecure option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l insecure -d "⚠️  Skip SSL verification"

# Pretty option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l pretty -d "🎨 Pretty print response"

# Raw option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l raw -d "📄 Raw output"

# Filter option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l filter -d "🔍 JSON path filter"

# Verbose option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l verbose -d "📢 Verbose output"

# Help option
complete -c fp -f -n "__fish_seen_subcommand_from $http_commands" -l help -d "❓ Show help"

# Print message when loaded
echo "✅ Fish completion for fp loaded!"

