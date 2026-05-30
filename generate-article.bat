@echo off
cd /d C:\Users\Admin\agri-gyosei
npx tsx scripts/generate-article.ts >> C:\Users\Admin\agri-gyosei\logs\article-log.txt 2>&1
