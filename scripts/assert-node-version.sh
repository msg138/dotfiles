#!/bin/bash

# Specify the minimum required Node.js version
MINIMUM_NODE_VERSION="18.19.0"

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

# Check if Node.js is installed
if command -v node &> /dev/null; then
    # Get Node.js version
    NODE_VERSION=$(node --version | cut -d 'v' -f2)
    
    # Compare versions
    if compare_versions "$NODE_VERSION" "$MINIMUM_NODE_VERSION"; then
        echo "Node.js is installed, and its version ($NODE_VERSION) is greater than or equal to $MINIMUM_NODE_VERSION."
    else
        echo "Node.js version is below the required minimum version. Minimum version required: $MINIMUM_NODE_VERSION"
    fi
else
    echo "Node.js is not installed. Please install Node.js."
fi
