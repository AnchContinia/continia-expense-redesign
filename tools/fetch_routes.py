"""Hent rigtig vejgeometri for ruterne i fixturedataen og forenkl den.

`mileage-map.html` har koordinaterne bagt ind statisk frem for at kalde en
routing-tjeneste ved visning: kortet må ikke afhænge af en offentlig
demo-server når siden vises frem. Prisen er at koordinaterne ellers er
ureproducerbar magi — dette script er kilden til dem.

Brug: tilføj byen i CITY og strækningen i ROUTES, kør scriptet, og indsæt
indholdet af det skrevne `routes.js` i ROUTES-objektet i `mileage-map.html`.
Scriptet skriver *ikke* i designfilen — den redigeres i hånden, så en
hånd-tunet detalje i kortet ikke bliver overskrevet.

    cd tools && python3 fetch_routes.py

Nøglen i tabellen skal matche den slug portalen udleder af bynavnet:
lowercase, æ→ae, ø→o, å→a, alt andet end a-z fjernet.
"""
import json, math, subprocess, time

# Bymidter (lat, lon). Rigtige koordinater — Aarhus og Silkeborg er dem
# der allerede står i mileage-map.html.
CITY = {
    "aarhus":      (56.1567, 10.2108),
    "silkeborg":   (56.1665,  9.5490),
    "odense":      (55.3959, 10.3883),
    "vejle":       (55.7090,  9.5357),
    "herning":     (56.1362,  8.9767),
    "kobenhavn":   (55.6761, 12.5683),
    "roskilde":    (55.6415, 12.0803),
    "aalborg":     (57.0488,  9.9217),
    "helsingor":   (56.0361, 12.6136),
    "skanderborg": (56.0388,  9.9294),
}

ROUTES = [
    ("aarhus", "odense"), ("aarhus", "vejle"), ("silkeborg", "herning"),
    ("kobenhavn", "roskilde"), ("aarhus", "aalborg"), ("kobenhavn", "helsingor"),
    ("aarhus", "skanderborg"), ("aarhus", "silkeborg"),
]


def perp(p, a, b):
    """Vinkelret afstand fra p til linjen a-b, i grader (lon skaleret til lat)."""
    k = math.cos(math.radians(a[0]))
    px, py = p[1] * k, p[0]
    ax, ay = a[1] * k, a[0]
    bx, by = b[1] * k, b[0]
    dx, dy = bx - ax, by - ay
    if dx == 0 and dy == 0:
        return math.hypot(px - ax, py - ay)
    t = max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def simplify(pts, tol):
    """Douglas-Peucker."""
    if len(pts) < 3:
        return pts[:]
    dmax, idx = 0.0, 0
    for i in range(1, len(pts) - 1):
        d = perp(pts[i], pts[0], pts[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax <= tol:
        return [pts[0], pts[-1]]
    return simplify(pts[:idx + 1], tol)[:-1] + simplify(pts[idx:], tol)


def fit(pts, target):
    """Find den tolerance der rammer ~target punkter."""
    lo, hi = 0.0, 0.05
    best = pts
    for _ in range(40):
        mid = (lo + hi) / 2
        out = simplify(pts, mid)
        if len(out) > target:
            lo = mid
        else:
            best, hi = out, mid
    return best


out, total = {}, 0
for a, b in ROUTES:
    (la, lo_), (lb, lob) = CITY[a], CITY[b]
    url = (f"https://router.project-osrm.org/route/v1/driving/"
           f"{lo_},{la};{lob},{lb}?overview=full&geometries=geojson")
    # curl frem for urllib: Pythons SSL-stak fejler mod denne host
    raw = subprocess.run(["curl", "-sS", "-m", "40", url],
                         capture_output=True, check=True).stdout
    d = json.loads(raw)
    assert d["code"] == "Ok", (a, b, d.get("code"))
    rt = d["routes"][0]
    pts = [[c[1], c[0]] for c in rt["geometry"]["coordinates"]]   # -> lat,lon
    s = fit(pts, 90)
    s = [[round(p[0], 4), round(p[1], 4)] for p in s]
    # Endepunkter skal være bymidterne, ikke nærmeste vej
    s[0], s[-1] = [round(la, 4), round(lo_, 4)], [round(lb, 4), round(lob, 4)]
    key = f"{a}-{b}"
    out[key] = s
    total += len(s)
    print(f"{key:24} {rt['distance']/1000:7.1f} km  {len(pts):5} -> {len(s):3} punkter")
    time.sleep(1.2)

print(f"\n{total} punkter i alt")
js = ",\n".join(
    "    '%s': [%s]" % (k, ",".join("[%s,%s]" % (p[0], p[1]) for p in v))
    for k, v in out.items())
open("routes.js", "w").write(js)
print("bytes:", len(js))
