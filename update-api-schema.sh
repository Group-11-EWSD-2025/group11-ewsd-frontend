#!/bin/bash

# Function to print usage
print_usage() {
  echo "Usage: $0 <schema-type>"
  echo "Valid schema types: use service"
}

# Function to fetch and process schema
fetch_and_process_schema() {
  local schema_url=$1
  local schema_type=$2
  local output_json="api_schema/${schema_type}-schema.json"
  local output_schema="src/types/api-schema/${schema_type}-schema.d.ts"

  # Ensure the output directory exists
  mkdir -p "$(dirname "$output_json")"

  # Fetch the schema
  if ! curl -o "$output_json" "$schema_url"; then
    echo "Failed to fetch schema from $schema_url"
    exit 1
  fi

  # Format the schema
  npx prettier --write "$output_json"

  # Generate TypeScript definitions
  npx openapi-typescript "$output_json" -o "$output_schema"
}

# Skip the '--' argument if present
if [ "$1" == "--" ]; then
  shift
fi

# Check if schema type is provided
if [ -z "$1" ]; then
  print_usage
  exit 1
fi

# Determine schema URL and type
case "$1" in
  service)
    SCHEMA_URL="https://api.nuosmagick.com/magicworkforce/v1alpha/openapi.json"
    ;;
  *)
    echo "Invalid argument. Use service."
    print_usage
    exit 1
    ;;
esac

# Fetch and process the schema
fetch_and_process_schema "$SCHEMA_URL" $1