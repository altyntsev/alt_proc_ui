import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import hashlib, time, os, yaml, json
import datetime

main_dir = os.path.abspath(os.path.dirname(__file__)) + '/'
with open(main_dir + '_cfg/_main__uniq.cfg') as f:
    cfg = yaml.safe_load(f)
with open(os.path.expanduser(cfg['user_cfg'])) as f:
    users = yaml.safe_load(f)['users']
users = {user['login']: user for user in users}

security = HTTPBasic()
login_last_bad_dt = 0
def get_login(credentials: HTTPBasicCredentials = Depends(security)):
    return 'snm'
    login, pwd = credentials.username, credentials.password
    md5 = hashlib.md5(pwd.encode('utf-8')).hexdigest()
    global login_last_bad_dt
    if time.time() - login_last_bad_dt < 10:
        raise HTTPException(
            status_code=status.HTTP_418_IM_A_TEAPOT,
            detail="Try in a minute",
            headers={"WWW-Authenticate": "Basic"},
        )
    if login not in users:
        raise HTTPException(
            status_code=status.HTTP_418_IM_A_TEAPOT,
            detail="Unknown user"
        )
    if md5 != users[login]['md5']:
        login_last_bad_dt = time.time()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return login

app = FastAPI(dependencies=[Depends(get_login)])

@app.get("/html/{module}/{page}", response_class=HTMLResponse)
async def html(module, page, credentials: HTTPBasicCredentials = Depends(security)):
    login = get_login(credentials)
    with open(main_dir + 'main.html') as f:
        main_tpl = f.read()
    with open(main_dir + 'menu.html') as f:
        menu = f.read()
    cfg['ui']['user'], cfg['ui']['pwd'] = credentials.username, credentials.password
    cfg['ui']['project'] = __file__.split('/')[-3]
    main_tpl = main_tpl.replace('{app}', cfg['app'])
    main_tpl = main_tpl.replace('{menu}', menu)
    main_tpl = main_tpl.replace('{cfg}', json.dumps(cfg['ui']))
    main_tpl = main_tpl.replace('{user}', login)
    html = main_tpl.replace('xxx', module + '/' + page)

    return html

@app.get("/")
async def root():
    return RedirectResponse(cfg['root'])

app.mount('/', StaticFiles(directory=main_dir))

if __name__ == '__main__':

    uvicorn.run('main:app', host='0.0.0.0', port=cfg['port'],
                reload=True, reload_dirs=[main_dir])
