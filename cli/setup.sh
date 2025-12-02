#!/bin/bash
# Setup script for Goods Tracker CLI

set -e

echo "🚀 Setting up Goods Tracker CLI..."

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

echo "✓ Python 3 found"

# Install dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r cli/requirements.txt --quiet

# Make CLI executable
chmod +x cli/goods_tracker.py

# Create symlink for global access (optional)
if [ "$1" = "--global" ]; then
    echo "🔗 Creating global command..."

    # Determine the best location for the symlink
    if [ -d "/usr/local/bin" ] && [ -w "/usr/local/bin" ]; then
        ln -sf "$(pwd)/cli/goods_tracker.py" /usr/local/bin/goods-tracker
        echo "✓ Installed to /usr/local/bin/goods-tracker"
    else
        echo "⚠️  /usr/local/bin not writable. Installing to ~/bin instead..."
        mkdir -p ~/bin
        ln -sf "$(pwd)/cli/goods_tracker.py" ~/bin/goods-tracker
        echo "✓ Installed to ~/bin/goods-tracker"
        echo ""
        echo "📝 Add this to your ~/.zshrc or ~/.bashrc:"
        echo "   export PATH=\"\$HOME/bin:\$PATH\""
    fi
else
    echo ""
    echo "💡 To install globally, run: ./cli/setup.sh --global"
    echo "   Otherwise, use: python3 cli/goods_tracker.py [command]"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Quick start:"
echo "  goods-tracker init              # Initialize project"
echo "  goods-tracker status            # Check system status"
echo "  goods-tracker deploy database   # Deploy database"
echo "  goods-tracker deploy frontend   # Deploy frontend"
echo "  goods-tracker test              # Run tests"
echo ""
