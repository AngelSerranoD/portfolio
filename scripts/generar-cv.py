"""
Genera el CV de Ángel Serrano Domínguez en PDF, en UNA SOLA PÁGINA.

Dos idiomas con la misma maqueta: español e inglés. El contenido de cada uno
vive en TEXTOS, así que al tocar uno es fácil mantener el otro al día.

Formato orientado a puestos de desarrollo junior: una sola columna en orden
cronológico inverso (legible por los filtros ATS), competencias técnicas
arriba y los proyectos sustituidos por el enlace al portfolio.

Tipografías: Lato y Montserrat, las mismas del documento original.
No se versionan (son 2,4 MB de binarios con licencia OFL): la primera
ejecución las descarga del repositorio oficial de Google Fonts a
scripts/fonts/, que está en .gitignore.

Uso:  python scripts/generar-cv.py            los dos idiomas
      python scripts/generar-cv.py es         solo uno
Escribe public/CV-Angel-Serrano-Dominguez.pdf, que es el que sirve la web,
y public/CV-Angel-Serrano-Dominguez-EN.pdf con la versión en inglés.
"""

import os
import sys
import urllib.request

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

AQUI = os.path.dirname(os.path.abspath(__file__))
FB = os.environ.get("CV_FUENTES", os.path.join(AQUI, "fonts"))
PUBLIC = os.path.join(AQUI, "..", "public")

PORTFOLIO = "https://aserrano.dev"
GITHUB = "https://github.com/AngelSerranoD"
LINKEDIN = "https://www.linkedin.com/in/%C3%A1ngel-serrano-dom%C3%ADnguez-01497a29a/"
TELEFONO = "601 42 31 29"
CORREO = "angelsd7704@gmail.com"

GOOGLE_FONTS = "https://raw.githubusercontent.com/google/fonts/main/ofl"
MONTSERRAT = {"Montserrat-Regular": 400, "Montserrat-SemiBold": 600, "Montserrat-Bold": 700}


def asegurar_fuentes():
    """Descarga las fuentes que falten en FB. Solo pide red la primera vez."""
    os.makedirs(FB, exist_ok=True)
    for nombre in ("Lato-Regular", "Lato-Bold"):
        ruta = os.path.join(FB, f"{nombre}.ttf")
        if not os.path.exists(ruta):
            urllib.request.urlretrieve(f"{GOOGLE_FONTS}/lato/{nombre}.ttf", ruta)

    if all(os.path.exists(os.path.join(FB, f"{n}.ttf")) for n in MONTSERRAT):
        return
    # Montserrat solo se publica como fuente variable: se sacan los tres pesos.
    from fontTools.ttLib import TTFont as FontToolsFont
    from fontTools.varLib import instancer

    variable = os.path.join(FB, "Montserrat-variable.ttf")
    urllib.request.urlretrieve(f"{GOOGLE_FONTS}/montserrat/Montserrat%5Bwght%5D.ttf", variable)
    for nombre, peso in MONTSERRAT.items():
        instancer.instantiateVariableFont(FontToolsFont(variable), {"wght": peso}).save(
            os.path.join(FB, f"{nombre}.ttf")
        )
    os.remove(variable)


asegurar_fuentes()

for nombre in [
    "Lato-Regular",
    "Lato-Bold",
    "Montserrat-Regular",
    "Montserrat-SemiBold",
    "Montserrat-Bold",
]:
    pdfmetrics.registerFont(TTFont(nombre, os.path.join(FB, f"{nombre}.ttf")))

W, H = A4
MARGEN = 15 * mm
ANCHO_UTIL = W - MARGEN * 2

TINTA = (0.10, 0.10, 0.10)
GRIS = (0.38, 0.38, 0.38)
SUAVE = (0.55, 0.55, 0.55)
LINEA = (0.82, 0.82, 0.82)

# ═════════════════════════════════════════════════════════════ CONTENIDO ══
TEXTOS = {
    "es": {
        "salida": "CV-Angel-Serrano-Dominguez.pdf",
        "titulo_pdf": "Currículum Vitae · Ángel Serrano Domínguez",
        "asunto": "Desarrollador de aplicaciones multiplataforma",
        "palabras_clave": ("Kotlin, Jetpack Compose, Flutter, React, TypeScript, Android, "
                           "desarrollo multiplataforma"),
        "rol": "Desarrollador de aplicaciones multiplataforma",
        "ubicacion": "Barcelona, España",
        "s_perfil": "Perfil",
        "perfil":
            "Desarrollador de aplicaciones multiplataforma (Grado Superior DAM, 2026) con base "
            "técnica en hardware y sistemas. Desarrollo aplicaciones Android nativas con Kotlin "
            "y Jetpack Compose, multiplataforma con Flutter y web con React y TypeScript, y las "
            "llevo de principio a fin: interfaz, lógica, persistencia, pruebas y publicación. En "
            "mis prácticas desarrollé GPS Trackia, un SaaS multi-tenant de geolocalización de "
            "vehículos. Busco incorporarme a un equipo de desarrollo donde aportar desde el "
            "primer día.",
        "s_competencias": "Competencias técnicas",
        "competencias": [
            ("Desarrollo móvil", "Kotlin · Jetpack Compose · Flutter · Dart · Material Design"),
            ("Desarrollo web", "React · TypeScript · JavaScript · Vite · Tailwind CSS · HTML y CSS"),
            ("Datos y persistencia", "SQLite · SQLCipher · Room · DataStore · IndexedDB · Firebase"),
            ("Herramientas", "Git y GitHub · Android Studio · Vercel · PWA · Notificaciones locales"),
            ("Sistemas", "Diagnóstico y reparación de equipos · Instalación y configuración "
                         "de sistemas operativos · Redes"),
        ],
        "s_experiencia": "Experiencia profesional",
        "experiencia": [
            ("Desarrollador con IA · Prácticas", "Adapta Business Consulting",
             "Abril — Junio 2026",
             ["Creación del proyecto GPS Trackia: SaaS multi-tenant para la gestión de "
              "dispositivos de geolocalización de vehículos."]),
            ("Técnico informático · Prácticas", "D.A.I Software", "Abril — Junio 2023",
             ["Reparación de equipos antiguos y recuperación de archivos de discos duros.",
              "Instalación y configuración de sistemas operativos.",
              "Testeo de aplicaciones y elaboración de informes."]),
            ("Mozo de almacén",
             "Cofares (mayo — julio 2024) · Suman Social (días sueltos, 2025)", "2024 — 2025",
             ["Verificación de pedidos con pistola, control de inventario, verificación de "
              "dispositivos y paletización."]),
        ],
        "s_proyectos": "Proyectos",
        "proyectos":
            "Aplicaciones Android (Kotlin), Flutter y web (React) desarrolladas por cuenta "
            "propia. Cada una con demo interactiva, descripción técnica y código fuente en mi "
            "portfolio:",
        "s_formacion": "Formación",
        "formacion": [
            ("Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
             "IES Brianda de Mendoza · Guadalajara", "2024 — 2026"),
            ("Técnico en Sistemas Microinformáticos y Redes (SMR)",
             "IES Arcipreste de Hita · Guadalajara", "2021 — 2023"),
        ],
        "cierre": [
            ("Idiomas", "Español (nativo) · Inglés (avanzado)"),
            ("Habilidades", "Resolución de problemas · Proactividad · Trabajo en equipo · "
                            "Asertividad · Dinamismo"),
            ("Carnet de carretillero", "En vigor hasta el 27/01/2029"),
        ],
    },
    "en": {
        "salida": "CV-Angel-Serrano-Dominguez-EN.pdf",
        "titulo_pdf": "Resume · Ángel Serrano Domínguez",
        "asunto": "Cross-platform application developer",
        "palabras_clave": ("Kotlin, Jetpack Compose, Flutter, React, TypeScript, Android, "
                           "cross-platform development"),
        "rol": "Cross-platform application developer",
        "ubicacion": "Barcelona, Spain",
        "s_perfil": "Profile",
        "perfil":
            "Cross-platform application developer (Higher National Diploma in Multiplatform "
            "Application Development, 2026) with a technical background in hardware and "
            "systems. I build native Android apps with Kotlin and Jetpack Compose, "
            "cross-platform apps with Flutter and web apps with React and TypeScript, and take "
            "them end to end: interface, logic, persistence, testing and release. During my "
            "internship I built GPS Trackia, a multi-tenant SaaS for vehicle geolocation. "
            "Looking to join a development team where I can contribute from day one.",
        "s_competencias": "Technical skills",
        "competencias": [
            ("Mobile development", "Kotlin · Jetpack Compose · Flutter · Dart · Material Design"),
            ("Web development", "React · TypeScript · JavaScript · Vite · Tailwind CSS · HTML & CSS"),
            ("Data & persistence", "SQLite · SQLCipher · Room · DataStore · IndexedDB · Firebase"),
            ("Tools", "Git & GitHub · Android Studio · Vercel · PWA · Local notifications"),
            ("Systems", "Hardware diagnostics and repair · Operating system installation and "
                        "configuration · Networking"),
        ],
        "s_experiencia": "Experience",
        "experiencia": [
            ("AI Developer · Internship", "Adapta Business Consulting", "April — June 2026",
             ["Built GPS Trackia: a multi-tenant SaaS platform for managing vehicle "
              "geolocation devices."]),
            ("IT Technician · Internship", "D.A.I Software", "April — June 2023",
             ["Repaired legacy computers and recovered files from hard drives.",
              "Installed and configured operating systems.",
              "Tested applications and wrote technical reports."]),
            ("Warehouse operative",
             "Cofares (May — July 2024) · Suman Social (occasional days, 2025)", "2024 — 2025",
             ["Order verification with a barcode scanner, stock control, device checks and "
              "palletising."]),
        ],
        "s_proyectos": "Projects",
        "proyectos":
            "Android (Kotlin), Flutter and web (React) applications built on my own. Each one "
            "with an interactive demo, a technical write-up and its source code in my portfolio:",
        "s_formacion": "Education",
        "formacion": [
            ("Higher National Diploma in Multiplatform Application Development (EQF 5)",
             "IES Brianda de Mendoza · Guadalajara, Spain", "2024 — 2026"),
            ("Vocational Diploma in Microcomputer Systems and Networks (EQF 4)",
             "IES Arcipreste de Hita · Guadalajara, Spain", "2021 — 2023"),
        ],
        "cierre": [
            ("Languages", "Spanish (native) · English (advanced)"),
            ("Soft skills", "Problem solving · Proactivity · Teamwork · Assertiveness · Drive"),
            ("Forklift licence", "Valid until 27/01/2029"),
        ],
    },
}

c = None  # lienzo activo; lo fija construir()


def enlace(url, x, y, texto, fuente, tam):
    """Hace clicable el texto ya dibujado en (x, y)."""
    ancho = pdfmetrics.stringWidth(texto, fuente, tam)
    c.linkURL(url, (x, y - 2, x + ancho, y + tam), relative=0, thickness=0)
    return ancho


class Columna:
    """Cursor vertical sobre el ancho útil de la página."""

    def __init__(self, x, ancho, y):
        self.x = x
        self.ancho = ancho
        self.y = y

    def parrafo(self, texto, fuente="Lato-Regular", tam=8.9, alto=11.4,
                col=TINTA, sangria=0):
        c.setFillColorRGB(*col)
        c.setFont(fuente, tam)
        disponible = self.ancho - sangria
        linea = ""
        for palabra in texto.split():
            prueba = f"{linea} {palabra}".strip()
            if pdfmetrics.stringWidth(prueba, fuente, tam) <= disponible:
                linea = prueba
            else:
                c.drawString(self.x + sangria, self.y, linea)
                self.y -= alto
                linea = palabra
        if linea:
            c.drawString(self.x + sangria, self.y, linea)
            self.y -= alto

    def seccion(self, titulo):
        self.y -= 6.6 * mm
        c.setFillColorRGB(*TINTA)
        c.setFont("Montserrat-Bold", 9.0)
        c.drawString(self.x, self.y, titulo.upper())
        self.y -= 2.5 * mm
        c.setStrokeColorRGB(*LINEA)
        c.setLineWidth(0.6)
        c.line(self.x, self.y, self.x + self.ancho, self.y)
        self.y -= 4.4 * mm

    def puesto(self, cargo, empresa, periodo):
        c.setFillColorRGB(*TINTA)
        c.setFont("Montserrat-SemiBold", 9.4)
        c.drawString(self.x, self.y, cargo)
        c.setFillColorRGB(*SUAVE)
        c.setFont("Lato-Regular", 7.6)
        c.drawRightString(self.x + self.ancho, self.y, periodo)
        self.y -= 3.7 * mm
        c.setFillColorRGB(*GRIS)
        c.setFont("Lato-Bold", 8.6)
        c.drawString(self.x, self.y, empresa)
        self.y -= 4.2 * mm

    def vineta(self, texto):
        c.setFillColorRGB(*TINTA)
        c.setFont("Lato-Regular", 8.9)
        c.drawString(self.x + 1, self.y, "·")
        self.parrafo(texto, sangria=7)

    def fila(self, etiqueta, contenido, ancho_etiqueta=40 * mm):
        """Etiqueta a la izquierda y contenido a la derecha, en la misma línea."""
        c.setFillColorRGB(*TINTA)
        c.setFont("Montserrat-SemiBold", 8.7)
        c.drawString(self.x, self.y, etiqueta)
        self.parrafo(contenido, tam=8.7, alto=11, col=GRIS, sangria=ancho_etiqueta)
        self.y -= 1.0 * mm


def construir(idioma):
    """Dibuja el CV del idioma indicado y devuelve (ruta, milímetros sobrantes)."""
    global c
    t = TEXTOS[idioma]
    salida = os.path.join(PUBLIC, t["salida"])

    c = canvas.Canvas(salida, pagesize=A4)
    c.setTitle(t["titulo_pdf"])
    c.setAuthor("Ángel Serrano Domínguez")
    c.setSubject(t["asunto"])
    c.setKeywords(t["palabras_clave"])

    # ═══════════════════════════════════════════════════════ CABECERA ═════
    tx = MARGEN
    y = H - 15 * mm
    c.setFillColorRGB(*TINTA)
    c.setFont("Montserrat-Bold", 20)
    c.drawString(tx, y, "ÁNGEL SERRANO DOMÍNGUEZ")
    y -= 6.6 * mm

    c.setFillColorRGB(*GRIS)
    c.setFont("Montserrat-SemiBold", 9.6)
    c.drawString(tx, y, t["rol"])
    y -= 7.4 * mm

    def linea_contacto(y, piezas):
        """Dibuja en una línea piezas (texto, url|None) separadas por puntos medios."""
        x = tx
        for i, (texto, url) in enumerate(piezas):
            if i:
                c.setFillColorRGB(*SUAVE)
                c.setFont("Lato-Regular", 8.4)
                c.drawString(x, y, "  ·  ")
                x += pdfmetrics.stringWidth("  ·  ", "Lato-Regular", 8.4)
            c.setFillColorRGB(*TINTA)
            c.setFont("Lato-Regular", 8.4)
            c.drawString(x, y, texto)
            if url:
                x += enlace(url, x, y, texto, "Lato-Regular", 8.4)
            else:
                x += pdfmetrics.stringWidth(texto, "Lato-Regular", 8.4)

    linea_contacto(y, [(t["ubicacion"], None),
                       (TELEFONO, "tel:+34" + TELEFONO.replace(" ", "")),
                       (CORREO, f"mailto:{CORREO}")])
    y -= 4.6 * mm
    linea_contacto(y, [("github.com/AngelSerranoD", GITHUB),
                       ("linkedin.com/in/ángel-serrano-domínguez", LINKEDIN)])
    y -= 5.6 * mm

    # El portfolio, destacado: es donde están todos los proyectos
    c.setFillColorRGB(*SUAVE)
    c.setFont("Lato-Regular", 7.6)
    c.drawString(tx, y, "PORTFOLIO")
    px = tx + pdfmetrics.stringWidth("PORTFOLIO", "Lato-Regular", 7.6) + 5
    c.setFillColorRGB(*TINTA)
    c.setFont("Montserrat-SemiBold", 9.2)
    texto_portfolio = PORTFOLIO.removeprefix("https://")
    c.drawString(px, y, texto_portfolio)
    enlace(PORTFOLIO, px, y, texto_portfolio, "Montserrat-SemiBold", 9.2)

    y -= 5.2 * mm
    c.setStrokeColorRGB(*TINTA)
    c.setLineWidth(1.0)
    c.line(MARGEN, y, MARGEN + ANCHO_UTIL, y)
    y -= 1.0 * mm

    col = Columna(MARGEN, ANCHO_UTIL, y)

    # ═══════════════════════════════════════════════════════ CUERPO ═══════
    col.seccion(t["s_perfil"])
    col.parrafo(t["perfil"])

    col.seccion(t["s_competencias"])
    for etiqueta, contenido in t["competencias"]:
        col.fila(etiqueta, contenido)

    col.seccion(t["s_experiencia"])
    for i, (cargo, empresa, periodo, vinetas) in enumerate(t["experiencia"]):
        if i:
            col.y -= 3.2 * mm
        col.puesto(cargo, empresa, periodo)
        for v in vinetas:
            col.vineta(v)

    col.seccion(t["s_proyectos"])
    col.parrafo(t["proyectos"], col=GRIS)
    col.y -= 0.8 * mm
    c.setFillColorRGB(*TINTA)
    c.setFont("Montserrat-SemiBold", 9.4)
    c.drawString(col.x, col.y, texto_portfolio)
    enlace(PORTFOLIO, col.x, col.y, texto_portfolio, "Montserrat-SemiBold", 9.4)
    col.y -= 4.2 * mm

    col.seccion(t["s_formacion"])
    for i, (titulo, centro, periodo) in enumerate(t["formacion"]):
        if i:
            col.y -= 1.4 * mm
        col.puesto(titulo, centro, periodo)

    # Idiomas, habilidades y carnet en tres columnas, para cerrar la página
    col.y -= 0.6 * mm
    fin_y = col.y
    ancho3 = (ANCHO_UTIL - 2 * 7 * mm) / 3
    minimo = fin_y
    for i, (titulo, texto) in enumerate(t["cierre"]):
        b = Columna(MARGEN + i * (ancho3 + 7 * mm), ancho3, fin_y)
        b.seccion(titulo)
        b.parrafo(texto, tam=8.7, alto=11, col=GRIS)
        minimo = min(minimo, b.y)

    c.save()
    return salida, minimo / mm


# Comprobación: el requisito es una única página.
from pypdf import PdfReader

idiomas = sys.argv[1:] or list(TEXTOS)
for idioma in idiomas:
    ruta, sobra = construir(idioma)
    n = len(PdfReader(ruta).pages)
    print(f"[{idioma}] {os.path.normpath(ruta)}")
    print(f"      páginas: {n}  ({'CORRECTO' if n == 1 else 'ERROR: debe ser 1'})"
          f" · margen inferior restante: {round(sobra, 1)} mm")
