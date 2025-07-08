#!/bin/sh

echo "📦 Generating Prisma Client..."
npx prisma generate

echo "🚀 Starting application..."
npm run dev
