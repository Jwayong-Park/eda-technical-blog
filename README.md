# Jwayong EDA Lab

EDA, Semiconductor Design, STA, Logic Implementation and AI Engineering Blog.

## Blog structure

```text
eda-technical-blog/
├── _config.yml
├── _layouts/
│   ├── default.html
│   └── post.html
├── _posts/
│   └── YYYY-MM-DD-article-name.md
├── templates/
│   └── article.md
├── css/
│   └── style.css
├── index.html
├── sitemap.xml
└── robots.txt
```

## How to add an article

1. Copy `templates/article.md` into `_posts/`.
2. Rename it using `YYYY-MM-DD-article-name.md`.
3. Edit the YAML front matter at the top.
4. Write the article in Markdown below the second `---`.
5. Commit to `main`.
6. GitHub Pages automatically rebuilds the site.

The `permalink` field can be used to keep a stable URL such as `/posts/eda-unified-ide.html`.
