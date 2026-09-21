"""
Genera el CV de Ángel Serrano Domínguez en PDF, en UNA SOLA PÁGINA.

Formato orientado a puestos de desarrollo junior: una sola columna en orden
cronológico inverso (legible por los filtros ATS), competencias técnicas
arriba y los proyectos sustituidos por el enlace al portfolio.

Tipografías: Lato y Montserrat, las mismas del documento original.
No se versionan (son 2,4 MB de binarios con licencia OFL): la primera
ejecución las descarga del repositorio oficial de Google Fonts a
scripts/fonts/, que está en .gitignore.

Uso:  python scripts/generar-cv.py
Escribe public/CV-Angel-Serrano-Dominguez.pdf, que es el que sirve la web.
"""

import os
import urllib.request

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

AQUI = os.path.dirname(os.path.abspath(__file__))
FB = os.environ.get("CV_FUENTES", os.path.join(AQUI, "fonts"))
SALIDA = os.path.join(AQUI, "..", "public", "CV-Angel-Serrano-Dominguez.pdf")

PORTFOLIO = "https://portfolio-bay-alpha-63.vercel.app"
GITHUB = "https://github.com/AngelSerranoD"
LINKEDIN = "https://www.linkedin.com/in/%C3%A1ngel-serrano-dom%C3%ADnguez-01497a29a/"

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

c = canvas.Canvas(SALIDA, pagesize=A4)
c.setTitle("Currículum Vitae · Ángel Serrano Domínguez")
c.setAuthor("Ángel Serrano Domínguez")
c.setSubject("Desarrollador de aplicaciones multiplataforma")
c.setKeywords("Kotlin, Jetpack Compose, Flutter, React, TypeScript, Android, "
              "desarrollo multiplataforma")


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


# ═══════════════════════════════════════════════════════════ CABECERA ═════
tx = MARGEN
y = H - 15 * mm
c.setFillColorRGB(*TINTA)
c.setFont("Montserrat-Bold", 20)
c.drawString(tx, y, "ÁNGEL SERRANO DOMÍNGUEZ")
y -= 6.6 * mm

c.setFillColorRGB(*GRIS)
c.setFont("Montserrat-SemiBold", 9.6)
c.drawString(tx, y, "Desarrollador de aplicaciones multiplataforma")
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


linea_contacto(y, [("Barcelona, España", None),
                   ("601 42 31 29", "tel:+34601423129"),
                   ("angelsd7704@gmail.com", "mailto:angelsd7704@gmail.com")])
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

# ═══════════════════════════════════════════════════════════ CUERPO ═══════
col.seccion("Perfil")
col.parrafo(
    "Desarrollador de aplicaciones multiplataforma (Grado Superior DAM, 2026) con base "
    "técnica en hardware y sistemas. Desarrollo aplicaciones Android nativas con Kotlin y "
    "Jetpack Compose, multiplataforma con Flutter y web con React y TypeScript, y las llevo "
    "de principio a fin: interfaz, lógica, persistencia, pruebas y publicación. En mis "
    "prácticas desarrollé GPS Trackia, un SaaS multi-tenant de geolocalización de vehículos. "
    "Busco incorporarme a un equipo de desarrollo donde aportar desde el primer día."
)

col.seccion("Competencias técnicas")
col.fila("Desarrollo móvil", "Kotlin · Jetpack Compose · Flutter · Dart · Material Design")
col.fila("Desarrollo web", "React · TypeScript · JavaScript · Vite · Tailwind CSS · HTML y CSS")
col.fila("Datos y persistencia", "SQLite · SQLCipher · Room · DataStore · IndexedDB · Firebase")
col.fila("Herramientas", "Git y GitHub · Android Studio · Vercel · PWA · Notificaciones locales")
col.fila("Sistemas", "Diagnóstico y reparación de equipos · Instalación y configuración "
                     "de sistemas operativos · Redes")

col.seccion("Experiencia profesional")
col.puesto("Desarrollador con IA · Prácticas", "Adapta Business Consulting",
           "Abril — Junio 2026")
col.vineta(
    "Creación del proyecto GPS Trackia: SaaS multi-tenant para la gestión de dispositivos "
    "de geolocalización de vehículos."
)
col.y -= 3.2 * mm

col.puesto("Técnico informático · Prácticas", "D.A.I Software", "Abril — Junio 2023")
col.vineta("Reparación de equipos antiguos y recuperación de archivos de discos duros.")
col.vineta("Instalación y configuración de sistemas operativos.")
col.vineta("Testeo de aplicaciones y elaboración de informes.")
col.y -= 3.2 * mm

col.puesto("Mozo de almacén", "Cofares (mayo — julio 2024) · Suman Social (días sueltos, 2025)",
           "2024 — 2025")
col.vineta(
    "Verificación de pedidos con pistola, control de inventario, verificación de "
    "dispositivos y paletización."
)

col.seccion("Proyectos")
col.parrafo(
    "Aplicaciones Android (Kotlin), Flutter y web (React) desarrolladas por cuenta propia. "
    "Cada una con demo interactiva, descripción técnica y código fuente en mi portfolio:",
    col=GRIS,
)
col.y -= 0.8 * mm
c.setFillColorRGB(*TINTA)
c.setFont("Montserrat-SemiBold", 9.4)
c.drawString(col.x, col.y, texto_portfolio)
enlace(PORTFOLIO, col.x, col.y, texto_portfolio, "Montserrat-SemiBold", 9.4)
col.y -= 4.2 * mm

col.seccion("Formación")
col.puesto("Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
           "IES Brianda de Mendoza · Guadalajara", "2024 — 2026")
col.y -= 1.4 * mm
col.puesto("Técnico en Sistemas Microinformáticos y Redes (SMR)",
           "IES Arcipreste de Hita · Guadalajara", "2021 — 2023")

# Idiomas, habilidades y carnet en tres columnas, para cerrar la página
col.y -= 0.6 * mm
fin_y = col.y
ancho3 = (ANCHO_UTIL - 2 * 7 * mm) / 3
bloques = [
    ("Idiomas", "Español (nativo) · Inglés (avanzado)"),
    ("Habilidades", "Resolución de problemas · Proactividad · Trabajo en equipo · "
                    "Asertividad · Dinamismo"),
    ("Carnet de carretillero", "En vigor hasta el 27/01/2029"),
]
minimo = fin_y
for i, (titulo, texto) in enumerate(bloques):
    b = Columna(MARGEN + i * (ancho3 + 7 * mm), ancho3, fin_y)
    b.seccion(titulo)
    b.parrafo(texto, tam=8.7, alto=11, col=GRIS)
    minimo = min(minimo, b.y)
col.y = minimo

c.save()

# Comprobación: el requisito es una única página.
from pypdf import PdfReader

n = len(PdfReader(SALIDA).pages)
print(f"PDF generado: {os.path.normpath(SALIDA)}")
print(f"páginas: {n}  ({'CORRECTO' if n == 1 else 'ERROR: debe ser 1'})")
print(f"margen inferior restante: {round(col.y / mm, 1)} mm")
