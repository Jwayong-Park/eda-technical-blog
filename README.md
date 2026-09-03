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
├── assets/
│   ├── images/
│   └── js/blog.js
├── css/style.css
├── index.html
├── categories.html
├── tags.html
├── search.html
├── search.json
├── sitemap.xml
└── robots.txt
```

## Article design system

Article pages use the Jwayong EDA Lab standard layout:

- Breadcrumb + category
- Large title / subtitle / tags
- Author / date / reading time metadata
- Information summary box
- Main article + right sidebar
- Automatically numbered Table of Contents
- Tags / related category / recent articles / share controls
- Responsive technical figures
- Concept Cards and Engineering Insight boxes
- Markdown code blocks, tables and blockquotes

For diagrams, prefer SVG files under `assets/images/` so technical figures remain sharp on desktop and mobile.

## How to add an article

1. Copy `templates/article.md` into `_posts/`.
2. Rename it using `YYYY-MM-DD-article-name.md`.
3. Edit the YAML front matter at the top.
4. Write the article in Markdown below the second `---`.
5. Add SVG figures under `assets/images/` when needed.
6. Use the classes in `templates/article.md` for concept cards and insight boxes.
7. Commit to `main`.
8. GitHub Pages automatically rebuilds the site.

The `permalink` field can be used to keep a stable URL such as `/posts/eda-unified-ide.html`.
