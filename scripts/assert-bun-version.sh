#!/bin/bash

# Specify the minimum required Node.js version
MINIMUM_BUN_VERSION="1.0.22"

# Function to compare version numbers
compare_versions() {
    local version1="$1"
    local version2="$2"

    # Split version strings into arrays
    IFS='.' read -ra version1_array <<< "$version1"
    IFS='.' read -ra version2_array <<< "$version2"

    # Compare each version block
    for i in "${!version1_array[@]}"; do
        if [ "${version1_array[$i]}" -lt "${version2_array[$i]}" ]; then
            return 1
        elif [ "${version1_array[$i]}" -gt "${version2_array[$i]}" ]; then
            return 0
        fi
    done

    return 0
}

# Check if Bun is installed
if command -v bun &> /dev/null; then
    # Get Bun version
    BUN_VERSION=$(bun --version | cut -d 'v' -f2)
    
    # Compare versions
    if compare_versions "$BUN_VERSION" "$MINIMUM_BUN_VERSION"; then
        echo "Bun is installed, and its version ($BUN_VERSION) is greater than or equal to $MINIMUM_BUN_VERSION."
    else
        echo "Bun version is below the required minimum version. Minimum version required: $MINIMUM_BUN_VERSION"
    fi
else
    echo "Bun is not installed. Please install Bun."
fi
