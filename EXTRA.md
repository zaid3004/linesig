<!-- Here goes any extra information that they client's IT team may need to finish on their own using their own services and resources -->

# LineSig website — handover notes for the IT team

The site is a **static HTML / CSS / JS** website. There is no build step, no framework, no database and no server-side code. Every page is a plain `.html` file that can be served by any web server.

- Intended domain: `https://www.linesig.com`
- Contact email used by the site: `sales@linesig.com`
- Fonts: Barlow Condensed, Inter and IBM Plex Mono, loaded from Google Fonts

---

## 1. Project layout

```
index.html, about.html, products.html, projects.html, downloads.html,
contact.html, certifications.html          top-level pages
product-*.html                              one page per product / sub-type
css/style.css                               the only stylesheet (design tokens in :root)
js/script.js                                mobile nav, active-link highlight, contact form
images/                                     logo + product photos
documents/<Product>/                        datasheets, flyers, manuals (PDF)
documents/Spec Docs/                        source Word documents (internal, see 7)
```

Things worth knowing:

- The header, nav and footer are **copy-pasted into every page**. A nav or footer change means editing every `.html` file, or moving them into shared templates / includes if you adopt a CMS or build tool.
- Folder names under `documents/` contain spaces, capitals and `&` (for example `Pig SIgnaler`, `Pig Launcher & Receiver`, `Dozing Skids`). They are linked URL-encoded. On a Linux server paths are **case-sensitive**, so keep the names exactly as they are, or update the links if you rename anything.

---

## 2. Contact form (needs your decision)

Currently `contact.html` + `js/script.js` validate in the browser (all fields except Phone are required), then POST the data via `fetch` to **FormSubmit**:

```
https://formsubmit.co/ajax/sales@linesig.com
```

What this means in practice:

1. **One-time activation:** the first real submission makes FormSubmit email `sales@linesig.com` an activation link. Someone must click it, or no messages will be delivered. Do this on the live domain before launch.
2. **Only works when hosted** over http(s), not when opening the file locally.
3. **Nothing is stored.** Submissions exist only as emails. There is no database or dashboard in this setup.
4. Spam protection is limited to a hidden honeypot field (`_honey`). The built-in CAPTCHA is switched off (`_captcha=false`) so the AJAX flow works.
5. It depends on a third-party service. If the client needs guaranteed delivery, data retention or GDPR-grade processing, replace it.

Options to replace it:

- A form plugin if the site ends up inside WordPress (WPForms, Contact Form 7 + Flamingo, Fluent Forms).
- Your own endpoint (PHP, Node, serverless function) using SMTP or an email API (SES, SendGrid, Mailgun).
- Keep FormSubmit but add reCAPTCHA / hCaptcha.

To switch, only two places need changing: the `FORM_ENDPOINT` constant at the top of the form section in `js/script.js`, and the extra fields appended to `FormData` just below it.

---

## 3. Items to finish before or after launch

| Item | Where | Notes |
|---|---|---|
| Certifications page | `certifications.html` | Placeholder. The nav and footer links are **commented out** (`<!-- ... -->`). Add the real content, then uncomment the link in every page. |
| Broken placeholder link | `downloads.html`, near the bottom ("Company capability brochure") | Points to `downloads/linesig-pig-launcher-receiver-flyer.pdf`, which does not exist. Replace with the real corporate brochure or delete the line. |
| "Coming soon" documents | `downloads.html` and product pages | VRU (flyer, datasheet, manual), Pig valve operation manual. Replace each `<a class="dl-link disabled">` with a real link when the files exist. |
| Map | `contact.html` | A map embed block is commented out. Add a Google Maps / OpenStreetMap iframe if wanted. |
| Footer credit line | every page footer | "Site built as a static, mobile-responsive HTML/CSS/JS deliverable." Remove or replace before go-live. |
| Projects page | `projects.html` | Review the content with the client before go-live. |
| Model codes | VRU page and products page | The VRU model tag `LNS-VRU` is a working label. The VRU source document says model codes are not yet assigned. Confirm with the client. |
| File naming | `documents/Dozing Skids/` | The PDG flyer file is named `...PDM MICRO PRECISION PUMP FLYER.pdf` but is labelled PDG on the site. The Dosing folder is spelled "Dozing". Cosmetic only. |
| Venturi / Ventury | `images/scrubber-ventury.png`, `documents/Scrubber Systems/*VENTURY*` | Site text says "Venturi". The image file and PDF file names use "ventury". Visitors never see the file names. |

---

## 4. SEO, analytics and domain (left to IT by agreement)

The client's IT team owns these. Nothing here is wired up yet:

- `robots.txt` and `sitemap.xml` (not included).
- Page titles and meta descriptions exist on the pages, but review them. Some pages (the scrubber pages, for example) also carry canonical, Open Graph and JSON-LD tags that assume `https://www.linesig.com/...`. Check that every page is consistent, or strip them if your SEO plugin or tooling manages this.
- Analytics and tag manager snippets (add in `<head>` of every page, or via your CMS).
- Google Search Console / Bing Webmaster verification.
- Redirect `linesig.com` to `www.linesig.com` (or the reverse) with a 301, and force HTTPS.
- Add a favicon (`<link rel="icon">`). The site does not ship one yet.
- Cookie / privacy notice and a privacy policy page if you add analytics or keep Google Fonts (see 5).

---

## 5. Performance, security, compliance

- **Images:** several product PNGs are 1.5 to 2.3 MB each. Convert to WebP/AVIF or compress, then update the `<img>` paths. Keep the same file names if you only recompress.
- **Google Fonts** are loaded from Google's servers. For strict GDPR environments, download the three font families and self-host them, then edit the `<link>` in each page's `<head>`.
- **Caching:** serve `css/`, `js/`, `images/` and `documents/` with long cache lifetimes. If you cache hard, add a version query string (`style.css?v=2`) when you change files.
- **Security headers** worth setting at the server or CDN: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a CSP that allows `fonts.googleapis.com`, `fonts.gstatic.com` and `formsubmit.co` (remove the last if you replace the form backend).
- **PDF downloads** are large. Consider a CDN, and add `Content-Disposition` rules only if you want forced downloads.

---

## 6. Editing guide for common changes

- **Colours / fonts / spacing:** `css/style.css`, design tokens in `:root` (`--red`, `--red-dark`, `--bg`, `--bg-alt`, and so on).
- **Contact email:** search the project for `sales@linesig.com`. It appears in the footers, `contact.html` and `js/script.js`.
- **Add a product document:** drop the PDF in the matching `documents/<Product>/` folder, then add or replace an `<a class="dl-link">` on that product page and on `downloads.html`. Use URL-encoding in the `href` (`%20` for spaces, `&amp;` for `&`).
- **Add a page:** copy an existing page of the same kind, keep the header/footer blocks, and add it to the nav and footer in every file.

---

## 7. Files that should not be public

`documents/Spec Docs/` contains the original Word source documents used to write the page copy. They are internal. **Exclude this folder from the public deployment** (do not upload it to the web server), or block it in server config. Likewise do not publish `EXTRA.md` or the `.git` folder.

---

## 8. Deploying from GitHub to a WordPress host as a static site

WordPress is not required to run this site. It is plain files. "Deploying to WordPress" really means putting the files on the web hosting that runs WordPress, and having the web server serve them directly. Pick one of the three layouts below.

> Note: plugins such as Simply Static or WP2Static go the other way (they turn a WordPress site into static files). They are not needed here.

### Before you start

- A hosting account with **File Manager, SFTP or FTPS access** (cPanel, Plesk or similar), and the domain pointed at it.
- The GitHub repo containing the site.
- Decide which layout fits:
  - **A. Replace WordPress** (recommended if WordPress is not needed): the static site becomes the whole site.
  - **B. Subfolder or subdomain:** keep WordPress and serve this site from `/site/` or `site.linesig.com`.
  - **C. Static site at the root while WordPress stays elsewhere:** same as A, with WordPress moved to a subfolder first.

### Step 1: Get the files out of GitHub

1. Open the repo on GitHub, then **Code, Download ZIP**, or run `git clone <repo-url>` on a computer.
2. Delete from the copy you will upload: the `.git` folder, `EXTRA.md`, `documents/Spec Docs/`, and any `.DS_Store` files.

### Step 2: Back up first

1. In the hosting panel, back up the current `public_html` (or use the host's backup tool), and export the WordPress database if WordPress is being replaced or moved.

### Step 3: Upload

**Layout A, replace WordPress**
1. In `public_html`, remove or move the WordPress files (`wp-admin`, `wp-content`, `wp-includes`, `wp-*.php`, `index.php`, `.htaccess`).
2. Upload everything from the site folder so that `index.html` sits directly in `public_html`, next to `css/`, `js/`, `images/`, `documents/`.

**Layout B, subfolder**
1. Create `public_html/site/` (or a subdomain with its own document root).
2. Upload the site files into that folder. The site is then at `https://www.linesig.com/site/`. All links are relative, so it works from a subfolder. A subdomain is cleaner for SEO.

**Layout C**
1. Move WordPress into `public_html/blog/` (WordPress has a documented "Giving WordPress its own directory" procedure), then upload the static site to `public_html`.

Upload method: use the hosting File Manager (zip, upload, extract), or SFTP/FTPS with a client such as FileZilla.

### Step 4: Make sure `index.html` wins

On Apache hosts, a leftover WordPress `.htaccess` can send every URL to `index.php`. In layout A, delete it. If any WordPress stays in the same folder, put this at the top of `.htaccess`:

```apache
DirectoryIndex index.html index.php
```

Also check the permissions: folders `755`, files `644`.

### Step 5: Domain, HTTPS, redirects

1. Point the domain's A/CNAME records at the host.
2. Enable the free SSL certificate (Let's Encrypt in cPanel/Plesk) and turn on "Force HTTPS".
3. Add the `non-www` to `www` 301 redirect (or the reverse).

### Step 6: Test

1. Open the home page, then click every nav and dropdown item (Products and Resources), the footer links, and each download button.
2. Test the contact form: submit it once, then click the **FormSubmit activation email** that arrives at `sales@linesig.com` (see section 2). Submit again and confirm delivery.
3. Test on a phone (the mobile menu).
4. Check that `documents/Spec Docs/` and `EXTRA.md` return 404.

### Step 7 (optional): Automatic deploys from GitHub

If the host supports FTP/FTPS or SFTP, a GitHub Action can upload on every push to `main`, so updates never need manual uploads.

1. In the GitHub repo, **Settings, Secrets and variables, Actions**: add `FTP_SERVER`, `FTP_USERNAME` and `FTP_PASSWORD`. Create an FTP account limited to the web folder.
2. Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy site
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Upload via FTPS
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          server-dir: public_html/
          protocol: ftps
          exclude: |
            **/.git*
            **/.git*/**
            EXTRA.md
            documents/Spec Docs/**
            **/.DS_Store
```

3. Push to `main` and watch the run under the repo's **Actions** tab. The first run uploads everything; later runs upload only changed files.
4. Change `server-dir` to `public_html/site/` for layout B.

If the host offers **Git deployment** instead (cPanel "Git Version Control", for example), you can connect the repo there and set the deployment path to the web root.

### Rolling back

Re-upload the previous commit's files (or use GitHub: **Revert** the commit, and the Action redeploys), or restore the backup from Step 2.