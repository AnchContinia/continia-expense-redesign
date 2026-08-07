#!/usr/bin/env python3
"""Klargør en frisk Claude Design-eksport til dette repos mappestruktur.

En eksport antager at HTML-filen ligger side om side med sine afhængigheder.
Her ligger den et niveau nede (mobile/, desktop/, design-system/), så hver
relativ sti skal have '../' foran. Scriptet gør præcis to ting pr. fil:

  1. sætter '../' foran hver relativ afhængighed
  2. indsætter tilbage-linket til galleriet lige efter <body>

Begge er idempotente — det er harmløst at køre scriptet igen.

Kør fra repo-roden:   python3 tools/prepare.py
"""

import os
import re
import sys

DS = "_ds/contina-3-0-front-end-814650ee-2a72-4f6d-8e32-c05a21c81842"

# Afhængigheder pr. fil, som de ser ud i en frisk eksport.
TARGETS = {
    "design-system/expense-design-system.html": [
        '"./support.js"',
        f'"{DS}',
    ],
    "mobile/expense-mobile.html": [
        '"./support.js"',
        '"./image-slot.js"',
        '"./ios-frame.jsx"',
        '"mileage-map.html"',
        '"assets/',
        f'"{DS}',
    ],
    "desktop/expense-portal.html": [
        '"./support.js"',
        '"./image-slot.js"',
        '"./browser-window.jsx"',
        '"assets/',
        f'"{DS}',
    ],
}

MARKER = "Tilbage til galleriet"

BACK_LINK = (
    '<a href="../index.html" aria-label="Tilbage til galleriet"'
    ' style="position:fixed;left:16px;bottom:16px;z-index:2147483647;display:inline-flex;'
    "align-items:center;box-sizing:border-box;margin:0;padding:9px 14px;border-radius:999px;"
    "background:#052975;color:#8ff8ff;"
    "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;"
    "font-size:13px;font-weight:600;font-style:normal;line-height:1;letter-spacing:0;"
    "text-decoration:none;text-transform:none;text-align:left;"
    "border:1px solid rgba(143,248,255,0.35);box-shadow:0 4px 14px rgba(5,41,117,0.35);"
    'white-space:nowrap;opacity:0.94;">&#8592;&#160;Galleri</a>'
)


def prefix_for(token):
    """'"./x"' -> '"../x"'   og   '"_ds/x"' -> '"../_ds/x"'"""
    return '"../' + (token[3:] if token.startswith('"./') else token[1:])


def process(path, tokens):
    if not os.path.exists(path):
        print(f"  ! mangler: {path}")
        return False

    with open(path, encoding="utf-8") as fh:
        src = fh.read()

    out = src
    changes = []

    # 1 — sti-præfikser
    for token in tokens:
        new = prefix_for(token)
        already = out.count(new)
        pending = out.count(token) - already
        if pending > 0:
            out = out.replace(token, new)
            changes.append(f"{pending}x {token[:44]} -> ../")
        elif already == 0:
            print(f"  ! hverken '{token[:44]}' eller rettet udgave fundet i {path}")

    # 2 — tilbage-link
    if MARKER in out:
        pass  # allerede indsat
    else:
        n = out.count("<body>")
        if n != 1:
            print(f"  ! forventede ét <body> i {path}, fandt {n} — link ikke indsat")
        else:
            out = out.replace("<body>", "<body>\n" + BACK_LINK, 1)
            changes.append("tilbage-link indsat")

    if out == src:
        print(f"  = {path} (intet at gøre)")
        return True

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(out)
    for line in changes:
        print(f"  + {line}")
    print(f"  ✓ {path} opdateret")
    return True


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    print(f"Klargør eksport i {root}\n")

    ok = True
    for path, tokens in TARGETS.items():
        print(path)
        ok = process(path, tokens) and ok
        print()

    # Sanity: alt hvad filerne peger på skal findes på disken.
    print("Verificerer at alle stier findes:")
    missing = 0
    for path in TARGETS:
        body = re.sub(
            r"base64,[A-Za-z0-9+/=]+", "base64,X", open(path, encoding="utf-8").read()
        )
        base = os.path.dirname(path)
        for ref in sorted(set(re.findall(r'(?:src|href|from)\s*=\s*"([^"]+)"', body))):
            if ref.startswith(("data:", "http", "#", "{{")):
                continue
            resolved = os.path.normpath(os.path.join(base, ref))
            if not os.path.exists(resolved):
                print(f"  ✗ {path}: {ref} -> {resolved} findes ikke")
                missing += 1
    print("  ✓ alle stier findes" if not missing else f"  {missing} manglende")

    sys.exit(0 if ok and not missing else 1)


if __name__ == "__main__":
    main()
