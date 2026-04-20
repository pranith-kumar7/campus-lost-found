import urllib.request
import json

try:
    with urllib.request.urlopen('http://localhost:5000/api/items', timeout=10) as resp:
        data = resp.read().decode('utf-8')
        print('STATUS', resp.status)
        parsed = json.loads(data)
        print('TYPE', type(parsed).__name__)
        if isinstance(parsed, list):
            print('LENGTH', len(parsed))
        else:
            print(parsed)
except Exception as e:
    print('ERROR', repr(e))
