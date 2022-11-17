import requests

url = "https://www.google.com/"
response = requests.get(url).json()
print(response)