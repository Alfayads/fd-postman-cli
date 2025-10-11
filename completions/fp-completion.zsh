#compdef fp
# Zsh completion for fd-postman-cli (fp command)

_fp() {
    local -a commands env_commands collection_commands global_commands history_commands workflow_commands auth_commands
    local -a common_options auth_types

    # Main commands with descriptions and emojis
    commands=(
        'get:🌐 Make GET request'
        'post:📤 Make POST request'
        'put:🔄 Make PUT request'
        'delete:🗑️  Make DELETE request'
        'patch:✏️  Make PATCH request'
        'head:📋 Make HEAD request'
        'options:⚙️  Make OPTIONS request'
        'env:🌍 Manage environments'
        'collection:📦 Manage collections'
        'global:🌐 Manage global variables'
        'history:📜 View request history'
        'workflow:🔄 Manage workflows'
        'auth:🔐 Manage authentication'
        'import:📥 Import collections/environments'
        'export:📤 Export collections/environments'
        '--version:ℹ️  Show version'
        '--help:❓ Show help'
    )

    # Subcommands
    env_commands=(
        'set:💾 Set environment variable'
        'list:📋 List all environments'
        'show:👁️  Show environment details'
        'unset:❌ Remove environment variable'
        'use:✅ Set active environment'
        'active:🎯 Show active environment'
        'unuse:⏹️  Unset active environment'
        'delete:🗑️  Delete environment'
    )

    collection_commands=(
        'create:➕ Create new collection'
        'list:📋 List all collections'
        'show:👁️  Show collection details'
        'delete:🗑️  Delete collection'
        'run:▶️  Run collection'
    )

    global_commands=(
        'set:💾 Set global variable'
        'list:📋 List all global variables'
        'unset:❌ Remove global variable'
        'clear:🗑️  Clear all global variables'
    )

    history_commands=(
        'list:📋 List request history'
        'show:👁️  Show history entry'
        'search:🔍 Search history'
        'clear:🗑️  Clear history'
        'replay:🔄 Replay request'
    )

    workflow_commands=(
        'run:▶️  Run workflow'
        'create:➕ Create workflow'
        'list:📋 List workflows'
    )

    auth_commands=(
        'oauth2-url:🔑 Generate OAuth2 authorization URL'
        'oauth2-token:🎫 Exchange code for token'
        'oauth2-client-credentials:🔐 Get client credentials token'
        'pkce-generate:🔒 Generate PKCE credentials'
    )

    # Common options
    common_options=(
        {-H,--header}'[📝 Add custom header]:header'
        {-q,--query}'[🔍 Add query parameter]:param'
        {-d,--data}'[📄 Request body data]:data'
        '--form[📋 Form data]:form'
        {-o,--output}'[💾 Save response to file]:file:_files'
        '--env[🌍 Use environment]:environment'
        '--auth-type[🔐 Authentication type]:type:(none bearer basic apikey oauth2 aws-sigv4 digest custom)'
        '--token[🎫 Bearer token]:token'
        '--username[👤 Username]:username'
        '--password[🔑 Password]:password'
        '--api-key[🔐 API key]:key'
        '--timeout[⏱️  Request timeout]:milliseconds'
        '--insecure[⚠️  Skip SSL verification]'
        '--pretty[🎨 Pretty print response]'
        '--raw[📄 Raw output]'
        '--filter[🔍 JSON path filter]:path'
        '--verbose[📢 Verbose output]'
        '--help[❓ Show help]'
    )

    # Authentication types with descriptions
    auth_types=(
        'none:No authentication'
        'bearer:Bearer token authentication'
        'basic:Basic authentication'
        'apikey:API key authentication'
        'oauth2:OAuth 2.0 authentication'
        'aws-sigv4:AWS Signature Version 4'
        'digest:Digest authentication'
        'custom:Custom JavaScript authentication'
    )

    local curcontext="$curcontext" state line
    typeset -A opt_args

    _arguments -C \
        '1: :->command' \
        '*::arg:->args'

    case $state in
        command)
            _describe -t commands '🚀 FP Commands' commands
            ;;
        args)
            case $line[1] in
                get|post|put|delete|patch|head|options)
                    _arguments \
                        '1:URL:_urls' \
                        $common_options
                    ;;
                env)
                    local -a env_args
                    env_args=(
                        '1: :->env_command'
                        '*::arg:->env_args'
                    )
                    _arguments $env_args
                    case $state in
                        env_command)
                            _describe -t env-commands '🌍 Environment Commands' env_commands
                            ;;
                    esac
                    ;;
                collection)
                    local -a coll_args
                    coll_args=(
                        '1: :->coll_command'
                        '*::arg:->coll_args'
                    )
                    _arguments $coll_args
                    case $state in
                        coll_command)
                            _describe -t collection-commands '📦 Collection Commands' collection_commands
                            ;;
                    esac
                    ;;
                global)
                    local -a global_args
                    global_args=(
                        '1: :->global_command'
                        '*::arg:->global_args'
                    )
                    _arguments $global_args
                    case $state in
                        global_command)
                            _describe -t global-commands '🌐 Global Commands' global_commands
                            ;;
                    esac
                    ;;
                history)
                    local -a hist_args
                    hist_args=(
                        '1: :->hist_command'
                        '*::arg:->hist_args'
                    )
                    _arguments $hist_args
                    case $state in
                        hist_command)
                            _describe -t history-commands '📜 History Commands' history_commands
                            ;;
                    esac
                    ;;
                workflow)
                    local -a wf_args
                    wf_args=(
                        '1: :->wf_command'
                        '*::arg:->wf_args'
                    )
                    _arguments $wf_args
                    case $state in
                        wf_command)
                            _describe -t workflow-commands '🔄 Workflow Commands' workflow_commands
                            ;;
                    esac
                    ;;
                auth)
                    local -a auth_args
                    auth_args=(
                        '1: :->auth_command'
                        '*::arg:->auth_args'
                    )
                    _arguments $auth_args
                    case $state in
                        auth_command)
                            _describe -t auth-commands '🔐 Auth Commands' auth_commands
                            ;;
                    esac
                    ;;
            esac
            ;;
    esac
}

_fp "$@"

# Print helpful message when sourced directly
if [[ "${ZSH_EVAL_CONTEXT}" == "file" ]]; then
    echo "✅ Zsh completion for fp loaded!"
    echo ""
    echo "📝 To enable permanently, add this to your ~/.zshrc:"
    echo ""
    echo "    fpath=(${0:A:h} \$fpath)"
    echo "    autoload -Uz compinit && compinit"
    echo ""
    echo "Then reload your shell:"
    echo ""
    echo "    source ~/.zshrc"
fi

