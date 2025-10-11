#!/usr/bin/env bash
# Bash completion for fd-postman-cli (fp command)

_fp_completion() {
    local cur prev words cword
    _init_completion || return

    # Get the current word being completed
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    # Main commands with emojis/symbols
    local commands="
        get:🌐_Make_GET_request
        post:📤_Make_POST_request
        put:🔄_Make_PUT_request
        delete:🗑️_Make_DELETE_request
        patch:✏️_Make_PATCH_request
        head:📋_Make_HEAD_request
        options:⚙️_Make_OPTIONS_request
        env:🌍_Manage_environments
        collection:📦_Manage_collections
        global:🌐_Manage_global_variables
        history:📜_View_request_history
        workflow:🔄_Manage_workflows
        auth:🔐_Manage_authentication
        import:📥_Import_collections/environments
        export:📤_Export_collections/environments
        --version:ℹ️_Show_version
        --help:❓_Show_help
    "

    # Subcommands for different main commands
    local env_commands="set:💾 list:📋 show:👁️ unset:❌ use:✅ active:🎯 unuse:⏹️ delete:🗑️"
    local collection_commands="create:➕ list:📋 show:👁️ delete:🗑️ run:▶️"
    local global_commands="set:💾 list:📋 unset:❌ clear:🗑️"
    local history_commands="list:📋 show:👁️ search:🔍 clear:🗑️ replay:🔄"
    local workflow_commands="run:▶️ create:➕ list:📋"
    local auth_commands="oauth2-url:🔑 oauth2-token:🎫 oauth2-client-credentials:🔐 pkce-generate:🔒"

    # Common options with descriptions
    local common_options="
        -H|--header:📝_Custom_header
        -q|--query:🔍_Query_parameter
        -d|--data:📄_Request_body
        --form:📋_Form_data
        -o|--output:💾_Save_response
        --env:🌍_Use_environment
        --auth-type:🔐_Authentication_type
        --token:🎫_Bearer_token
        --timeout:⏱️_Request_timeout
        --insecure:⚠️_Skip_SSL_verification
        --pretty:🎨_Pretty_print
        --raw:📄_Raw_output
        --filter:🔍_JSON_filter
        --verbose:📢_Verbose_output
    "

    # Authentication types
    local auth_types="none bearer basic apikey oauth2 aws-sigv4 digest custom"

    # If we're completing the first argument after 'fp'
    if [ $COMP_CWORD -eq 1 ]; then
        local cmd_list=$(echo "$commands" | tr ' ' '\n' | cut -d: -f1 | grep -v '^$')
        COMPREPLY=( $(compgen -W "$cmd_list" -- "$cur") )
        return 0
    fi

    # Get the main command
    local main_cmd="${COMP_WORDS[1]}"

    # Subcommand completion based on main command
    case "$main_cmd" in
        env)
            if [ $COMP_CWORD -eq 2 ]; then
                COMPREPLY=( $(compgen -W "set list show unset use active unuse delete" -- "$cur") )
            fi
            ;;
        collection)
            if [ $COMP_CWORD -eq 2 ]; then
                COMPREPLY=( $(compgen -W "create list show delete run" -- "$cur") )
            fi
            ;;
        global)
            if [ $COMP_CWORD -eq 2 ]; then
                COMPREPLY=( $(compgen -W "set list unset clear" -- "$cur") )
            fi
            ;;
        history)
            if [ $COMP_CWORD -eq 2 ]; then
                COMPREPLY=( $(compgen -W "list show search clear replay" -- "$cur") )
            fi
            ;;
        workflow)
            if [ $COMP_CWORD -eq 2 ]; then
                COMPREPLY=( $(compgen -W "run create list" -- "$cur") )
            fi
            ;;
        auth)
            if [ $COMP_CWORD -eq 2 ]; then
                COMPREPLY=( $(compgen -W "oauth2-url oauth2-token oauth2-client-credentials pkce-generate" -- "$cur") )
            fi
            ;;
        get|post|put|delete|patch|head|options)
            # Complete options for HTTP methods
            case "$prev" in
                --auth-type)
                    COMPREPLY=( $(compgen -W "$auth_types" -- "$cur") )
                    ;;
                --env)
                    # TODO: Get actual environment names from storage
                    COMPREPLY=( $(compgen -W "development staging production" -- "$cur") )
                    ;;
                -H|--header|-q|--query|--form)
                    # Don't complete after these, user needs to type the value
                    COMPREPLY=()
                    ;;
                *)
                    # Complete common options
                    local opts="-H --header -q --query -d --data --form -o --output --env --auth-type --token --username --password --api-key --timeout --insecure --pretty --raw --filter --verbose --help"
                    COMPREPLY=( $(compgen -W "$opts" -- "$cur") )
                    ;;
            esac
            ;;
    esac
}

# Register the completion function
complete -F _fp_completion fp

# Print helpful message when sourced
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    echo "⚠️  This script should be sourced, not executed!"
    echo ""
    echo "📝 To enable bash completion for fp, add this to your ~/.bashrc:"
    echo ""
    echo "    source $(realpath "${BASH_SOURCE[0]}")"
    echo ""
    echo "Then reload your shell:"
    echo ""
    echo "    source ~/.bashrc"
fi

