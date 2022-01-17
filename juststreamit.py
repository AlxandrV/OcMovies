import os

os.system(
    # "sass ./public/style/style.scss ./public/style/style.css"
    "sass --watch ./public/style/style.scss:./public/style/style.css"
    # "python ocmovies-api-en/manage.py runserver"
    )