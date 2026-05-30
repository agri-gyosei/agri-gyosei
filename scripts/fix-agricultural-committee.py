# -*- coding: utf-8 -*-
import sys, io, urllib.request, json, os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

API_URL = "https://nfjvozuoywgzejfokrdc.supabase.co/rest/v1"
KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"}

def fetch(path):
    req = urllib.request.Request(API_URL + path, headers=H)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode("utf-8"))

def patch(path, data):
    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(API_URL + path, data=body,
                                  headers={**H, "Prefer": "return=minimal"}, method="PATCH")
    with urllib.request.urlopen(req) as r:
        return r.status

rows = fetch("/dacha_articles?slug=eq.agricultural-committee-application-complete-guide&select=body_mdx")
body = rows[0]["body_mdx"]

# eMAFF農地ナビの平文URLを<a>タグに変換
# (https://map.maff.go.jp/) の形が2箇所ある
LINK = '<a href="https://map.maff.go.jp/" target="_blank" rel="noopener noreferrer">https://map.maff.go.jp/</a>'

old1 = '「eMAFF農地ナビ」（https://map.maff.go.jp/）だ'
new1 = f'「eMAFF農地ナビ」（{LINK}）だ'

old2 = 'eMAFF農地ナビ（https://map.maff.go.jp/）にアクセスする'
new2 = f'eMAFF農地ナビ（{LINK}）にアクセスする'

body = body.replace(old1, new1)
body = body.replace(old2, new2)

print("OK: eMAFFリンクを修正しました")

status = patch("/dacha_articles?slug=eq.agricultural-committee-application-complete-guide", {"body_mdx": body})
print(f"OK: 保存完了 HTTP {status}")
