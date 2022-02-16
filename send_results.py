import os, requests, json, base64

# This directory is where you have all your results locally, generally named as `allure-results`
allure_results_directory = '/target/allure-results'
# This url is where the Allure container is deployed. We are using localhost as example
allure_server = 'http://localhost:5050'
# Project ID according to existent projects in your Allure container - Check endpoint for project creation >> `[POST]/projects`
project_id = 'new-team'
# Set security_user & security_password according to Allure container configuration
security_user='admin'
security_password='nimda'

current_directory = os.path.dirname(os.path.realpath(__file__))
results_directory = current_directory + allure_results_directory
print('RESULTS DIRECTORY PATH: ' + results_directory)

files = os.listdir(results_directory)

print('FILES:')
results = []
for file in files:
    result = {}

    file_path = results_directory + "/" + file
    print(file_path)

    if os.path.isfile(file_path):
        try:
            with open(file_path, "rb") as f:
                content = f.read()
                if content.strip():
                    b64_content = base64.b64encode(content)
                    result['file_name'] = file
                    result['content_base64'] = b64_content.decode('UTF-8')
                    results.append(result)
                else:
                    print('Empty File skipped: '+ file_path)
        finally :
            f.close()
    else:
        print('Directory skipped: '+ file_path)

headers = {'Content-type': 'application/json'}
cookie = {}
request_body = {
    "results": results
}
json_request_body = json.dumps(request_body)

ssl_verification = True

print("------------------LOGIN-----------------")
credentials_body = {
    "username": security_user,
    "password": security_password
}
json_credentials_body = json.dumps(credentials_body)
session = requests.Session()
response = session.post(allure_server + '/allure-docker-service/login', headers=headers, data=json_credentials_body, verify=ssl_verification)
print("STATUS CODE:")
print(response.status_code)
print("RESPONSE COOKIES:")
json_prettier_response_body = json.dumps(session.cookies.get_dict(), indent=4, sort_keys=True)
print(json_prettier_response_body)

csrf_access_token = session.cookies['csrf_access_token']
headers['X-CSRF-TOKEN'] = csrf_access_token

csrf_refresh_token = session.cookies['csrf_refresh_token']
refresh_token_cookie = session.cookies['refresh_token_cookie']

access_token_cookie = session.cookies['access_token_cookie']
cookie['access_token_cookie']=access_token_cookie




print("------------------CLEAN-RESULTS------------------")
response = requests.get(allure_server + '/allure-docker-service/clean-results?project_id=' + project_id, headers=headers, cookies=cookie, verify=ssl_verification)
print("STATUS CODE:")
print(response.status_code)
print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)

print("------------------SEND-RESULTS------------------")
response = session.post(allure_server + '/allure-docker-service/send-results?project_id=' + project_id+'&force_project_creation=true', headers=headers, cookies=cookie, data=json_request_body, verify=ssl_verification)
print("STATUS CODE:")
print(response.status_code)
print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)

# If you want to generate reports on demand use the endpoint `GET /generate-report` and disable the Automatic Execution >> `CHECK_RESULTS_EVERY_SECONDS: NONE`
print("------------------GENERATE-REPORT------------------")
execution_name = 'Predator'
execution_from = 'http://localhost'
execution_type = 'Windows'
response = session.get (allure_server + '/allure-docker-service/generate-report?project_id=' + project_id + '&execution_name=' + execution_name + '&execution_from=' + execution_from + '&execution_type=' + execution_type, headers=headers, cookies=cookie, verify=ssl_verification)
print("STATUS CODE:")
print(response.status_code)
print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)

print('ALLURE REPORT URL:')
print(json_response_body['data']['report_url'])

print("------------------LOGOUT------------------")
response = requests.delete(allure_server + '/allure-docker-service/logout', headers=headers, cookies=cookie, verify=ssl_verification)
print("STATUS CODE:")
print(response.status_code)
print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)

headers['X-CSRF-TOKEN'] = csrf_refresh_token
cookie['refresh_token_cookie']=refresh_token_cookie
response = requests.delete(allure_server + '/allure-docker-service/logout-refresh-token', headers=headers, cookies=cookie, verify=ssl_verification)
print("STATUS CODE:")
print(response.status_code)
print("RESPONSE:")
json_response_body = json.loads(response.content)
json_prettier_response_body = json.dumps(json_response_body, indent=4, sort_keys=True)
print(json_prettier_response_body)