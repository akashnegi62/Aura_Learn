import urllib.request
import urllib.error
req = urllib.request.Request("https://aura-learn-yl58.onrender.com/health", method="OPTIONS")
req.add_header("Origin", "http://localhost:3000")
req.add_header("Access-Control-Request-Method", "GET")
try:
    with urllib.request.urlopen(req) as response:
        print("Status:", response.status)
        print("Headers:", response.headers)
except urllib.error.URLError as e:
    print("Error:", e)
