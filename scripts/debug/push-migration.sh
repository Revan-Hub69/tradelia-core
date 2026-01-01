#!/bin/bash
# Push the latest migration to Supabase

echo "🚀 Pushing migration to Supabase..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Push migrations
echo "📝 Pushing migrations..."
supabase db push

echo ""
echo "✅ Migration pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify the migration in Supabase dashboard"
echo "2. Run: npm run test:db-state"
echo "3. Check API endpoints for real data"
