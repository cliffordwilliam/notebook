# Notebook

1. create repo dir locally `mkdir notebook`
2. go in it and init git `git init`
3. create a README.md
4. add and commit it
5. login using gh `gh auth login`
6. use gh to push this to remote `gh repo create notebook --public --source=. --remote=origin --push`
7. scaffold new jekyll proj using force since we have README.md in here `docker run --rm -v "$PWD:/srv/jekyll" jekyll/jekyll jekyll new . --force`
8. make docker compose up to install dependencies and serve on local port (turn md to html)
9. edit the url here `_config.yml`, to `baseurl: "/notebook"` and `url: "https://cliffordwilliam.com"`
