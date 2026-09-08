"""
Genera el CV de Ángel Serrano Domínguez en PDF, en UNA SOLA PÁGINA.

Conserva íntegro el contenido del CV original (experiencia con sus fechas,
formación, habilidades, idiomas y carnets) y añade los proyectos personales.
Para que quepa todo en una página se usa una retícula de dos columnas.

Tipografías: Lato y Montserrat, las mismas del documento original.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

FB = r"C:\Users\angel\AppData\Local\Temp\claude\C--\9d143ffb-2b51-4103-92cd-6fe017945925\scratchpad\cvfonts"
SALIDA = r"C:\dev\portfolio\public\CV-Angel-Serrano-Dominguez.pdf"

for nombre in [
    "Lato-Regular",
    "Lato-Bold",
    "Montserrat-Regular",
    "Montserrat-SemiBold",
    "Montserrat-Bold",
]:
    pdfmetrics.registerFont(TTFont(nombre, rf"{FB}\{nombre}.ttf"))

W, H = A4
MARGEN = 13 * mm
ANCHO_UTIL = W - MARGEN * 2

# Retícula de dos columnas
COL_IZQ_X = MARGEN
COL_IZQ_W = ANCHO_UTIL * 0.615
CANAL = 7 * mm
COL_DER_X = COL_IZQ_X + COL_IZQ_W + CANAL
COL_DER_W = ANCHO_UTIL - COL_IZQ_W - CANAL

TINTA = (0.10, 0.10, 0.10)
GRIS = (0.38, 0.38, 0.38)
SUAVE = (0.55, 0.55, 0.55)
LINEA = (0.82, 0.82, 0.82)

c = canvas.Canvas(SALIDA, pagesize=A4)
c.setTitle("Currículum Vitae · Ángel Serrano Domínguez")
c.setAuthor("Ángel Serrano Domínguez")
c.setSubject("Desarrollador de aplicaciones multiplataforma")
c.setKeywords("Kotlin, Flutter, React, Android, desarrollo multiplataforma")


class Columna:
    """Cursor vertical independiente para cada columna de la retícula."""

    def __init__(self, x, ancho, y):
        self.x = x
        self.ancho = ancho
        self.y = y

    # ---------------------------------------------------------------- texto
    def parrafo(self, texto, fuente="Lato-Regular", tam=8.7, alto=10.9,
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

    def seccion(self, titulo, primera=False):
        if not primera:
            self.y -= 3.6 * mm
        c.setFillColorRGB(*TINTA)
        c.setFont("Montserrat-Bold", 9.0)
        c.drawString(self.x, self.y, titulo.upper())
        self.y -= 2.5 * mm
        c.setStrokeColorRGB(*LINEA)
        c.setLineWidth(0.6)
        c.line(self.x, self.y, self.x + self.ancho, self.y)
        self.y -= 3.7 * mm

    def puesto(self, cargo, empresa, periodo):
        c.setFillColorRGB(*TINTA)
        c.setFont("Montserrat-SemiBold", 9.2)
        c.drawString(self.x, self.y, cargo)
        c.setFillColorRGB(*SUAVE)
        c.setFont("Lato-Regular", 7.2)
        c.drawRightString(self.x + self.ancho, self.y, periodo)
        self.y -= 3.5 * mm
        c.setFillColorRGB(*GRIS)
        c.setFont("Lato-Bold", 8.4)
        c.drawString(self.x, self.y, empresa)
        self.y -= 3.9 * mm

    def vineta(self, texto):
        c.setFillColorRGB(*TINTA)
        c.setFont("Lato-Regular", 8.7)
        c.drawString(self.x + 1, self.y, "·")
        self.parrafo(texto, sangria=7)

    def proyecto(self, nombre, tecnologias, descripcion):
        c.setFillColorRGB(*TINTA)
        c.setFont("Montserrat-SemiBold", 9.0)
        c.drawString(self.x, self.y, nombre)
        ancho = pdfmetrics.stringWidth(nombre, "Montserrat-SemiBold", 9.0)
        c.setFillColorRGB(*SUAVE)
        c.setFont("Lato-Regular", 7)
        c.drawString(self.x + ancho + 6, self.y, tecnologias)
        self.y -= 3.5 * mm
        self.parrafo(descripcion, tam=8.5, alto=10.5, col=GRIS)
        self.y -= 1.1 * mm

    def bloque(self, titulo, contenido):
        c.setFillColorRGB(*TINTA)
        c.setFont("Montserrat-SemiBold", 8.7)
        c.drawString(self.x, self.y, titulo)
        self.y -= 3.4 * mm
        self.parrafo(contenido, tam=8.5, alto=10.5, col=GRIS)
        self.y -= 1.3 * mm


# ═══════════════════════════════════════════════════════════ CABECERA ═════
y = H - 15 * mm
c.setFillColorRGB(*TINTA)
c.setFont("Montserrat-Bold", 20)
c.drawString(MARGEN, y, "ÁNGEL SERRANO DOMÍNGUEZ")
y -= 6.6 * mm

c.setFillColorRGB(*GRIS)
c.setFont("Montserrat-SemiBold", 9.6)
c.drawString(MARGEN, y, "Desarrollador de aplicaciones multiplataforma")
y -= 5.2 * mm

y -= 0.6 * mm

c.setStrokeColorRGB(*TINTA)
c.setLineWidth(1.0)
c.line(MARGEN, y, MARGEN + ANCHO_UTIL, y)
y -= 6.2 * mm

izq = Columna(COL_IZQ_X, COL_IZQ_W, y)
der = Columna(COL_DER_X, COL_DER_W, y)

# ═════════════════════════════════════════════════════ COLUMNA IZQUIERDA ══
izq.seccion("Perfil", primera=True)
izq.parrafo(
    "Técnico informático con formación en desarrollo de aplicaciones multiplataforma. "
    "Vengo del hardware —análisis y diagnóstico de equipos, reparación, recuperación de "
    "datos, instalación de sistemas y elaboración de informes— y de ahí pasé al software. "
    "Desarrollo aplicaciones Android nativas con Kotlin, multiplataforma con Flutter y web "
    "con React, llevándolas de principio a fin: interfaz, lógica, persistencia y publicación. "
    "Cuento además con experiencia en almacén: verificación de pedidos, control de inventario "
    "y paletización."
)

izq.seccion("Experiencia profesional")

izq.puesto("Desarrollador con IA · Prácticas", "Adapta Business Consulting",
           "Abril — Junio 2026")
izq.vineta(
    "Creación del proyecto GPS Trackia: SaaS multi-tenant para la gestión de dispositivos "
    "de geolocalización de vehículos."
)
izq.y -= 1.6 * mm

izq.puesto("Técnico informático · Prácticas", "D.A.I Software", "Abril — Junio 2023")
izq.vineta("Reparación de equipos antiguos y recuperación de archivos de discos duros.")
izq.vineta("Instalación y configuración de sistemas operativos.")
izq.vineta("Testeo de aplicaciones y elaboración de informes.")
izq.y -= 1.6 * mm

izq.puesto("Mozo de almacén", "Cofares", "Mayo — Julio 2024")
izq.vineta(
    "Verificación de pedidos con pistola, identificación por código de producto y paletizado."
)
izq.y -= 1.6 * mm

izq.puesto("Mozo de almacén", "Suman Social", "Días sueltos, 2025")
izq.vineta("17 de junio: checkeo de inventario general.")
izq.vineta("25 al 27 de junio: limpieza de productos.")
izq.vineta("11 de julio: descarga de productos electrónicos y paletización.")
izq.vineta("11 al 14 de agosto: verificación de dispositivos y paletización.")

izq.seccion("Proyectos personales")
izq.parrafo(
    "Aplicaciones desarrolladas por cuenta propia con fines de aprendizaje y uso personal. "
    "No son productos comercializados ni publicados en tiendas de aplicaciones.",
    tam=8.2, alto=10.0, col=SUAVE,
)
izq.y -= 1.4 * mm

PROYECTOS = [
    ("Hannah's Wallet", "Flutter · SQLCipher · Riverpod",
     "Control de gastos y presupuestos sobre arquitectura limpia. Base cifrada con clave "
     "derivada por PBKDF2 y custodiada en el almacén seguro del sistema, bloqueo biométrico "
     "y backends separados para móvil y navegador. 16.000 líneas y 13 suites de test."),
    ("InfoMap", "React · TypeScript · Leaflet",
     "Mapa con GPS que muestra los lugares del entorno con datos de OpenStreetMap y resúmenes "
     "de Wikipedia. Cacheo por teselas en IndexedDB para funcionar sin conexión."),
    ("Sangría", "React · Vite · PWA",
     "Calendario de seguimiento menstrual con control de píldora y predicción a partir del "
     "historial. Instalable y sin servidor."),
    ("Nervio Vago", "Flutter · Provider",
     "Rutina diaria de quince ejercicios en tres bloques, con seguimiento de rachas y "
     "notificaciones locales programadas por zona horaria."),
    ("Sehati", "Flutter · i18n · RTL",
     "Seguimiento de una dieta pautada en español y árabe, con inversión completa de la "
     "dirección de lectura."),
    ("RotateBooth", "JavaScript · Canvas · PWA",
     "Gira varias fotos del carrete a la vez en iPhone. Modo sin pérdida que reescribe solo "
     "la etiqueta de orientación EXIF. Sin dependencias externas."),
    ("WeightTracker", "Kotlin · Jetpack Compose",
     "Seguimiento de peso con gráfica de evolución dibujada sobre Canvas y comparador de "
     "fotos entre dos fechas."),
    ("SaludDiaria", "Kotlin · Compose · DataStore",
     "Rutina de ejercicios terapéuticos con dos programas y progreso que se reinicia solo "
     "cada día. MVVM sobre flujos reactivos."),
]
for p in PROYECTOS:
    izq.proyecto(*p)

# ══════════════════════════════════════════════════════ COLUMNA DERECHA ═══
der.seccion("Contacto", primera=True)
for etiqueta, valor in [
    ("Ubicación", "Guadalajara, España"),
    ("Teléfono", "601 42 31 29"),
    ("Correo", "angelsd7704@gmail.com"),
    ("Portfolio", "portfolio-angel-serrano.vercel.app"),
    ("GitHub", "github.com/AngelSerranoD"),
    ("LinkedIn", "linkedin.com/in/ángel-serrano-domínguez"),
]:
    c.setFillColorRGB(*SUAVE)
    c.setFont("Lato-Regular", 7.2)
    c.drawString(der.x, der.y, etiqueta)
    der.y -= 3.5 * mm
    der.parrafo(valor, tam=8.2, alto=10, col=TINTA)
    der.y -= 0.7 * mm

der.seccion("Formación")
der.puesto("Grado Superior · DAM", "IES Brianda de Mendoza", "2024 — 2026")
der.parrafo("Desarrollo de Aplicaciones Multiplataforma. Guadalajara.",
            tam=8.3, alto=10.2, col=GRIS)
der.y -= 2 * mm
der.puesto("Grado Medio · SMR", "IES Arcipreste de Hita", "2021 — 2023")
der.parrafo("Sistemas Microinformáticos y Redes. Guadalajara.",
            tam=8.3, alto=10.2, col=GRIS)

der.seccion("Competencias técnicas")
der.bloque("Desarrollo móvil", "Kotlin · Jetpack Compose · Flutter · Dart · Material Design")
der.bloque("Desarrollo web", "React · TypeScript · JavaScript · Vite · Tailwind CSS · HTML y CSS")
der.bloque("Datos y persistencia", "SQLite · SQLCipher · Room · DataStore · IndexedDB · Firebase")
der.bloque("Herramientas", "Git y GitHub · Android Studio · Vercel · PWA · Notificaciones locales")
der.bloque("Sistemas", "Diagnóstico y reparación de equipos · Instalación y configuración de sistemas operativos · Redes")

der.seccion("Habilidades")
der.parrafo(
    "Diagnóstico y resolución de problemas · Asertividad · Dinamismo · Proactividad · "
    "Trabajo en equipo",
    tam=8.5, alto=10.5, col=GRIS,
)

der.seccion("Idiomas")
der.parrafo("Español (nativo) · Inglés (avanzado)", tam=8.5, alto=10.5, col=GRIS)

der.seccion("Carnets en vigor")
c.setFillColorRGB(*TINTA)
c.setFont("Montserrat-SemiBold", 8.7)
c.drawString(der.x, der.y, "Carretillero")
c.setFillColorRGB(*SUAVE)
c.setFont("Lato-Regular", 7)
c.drawRightString(der.x + der.ancho, der.y, "27/01/2024 — 27/01/2029")
der.y -= 3.4 * mm
der.parrafo(
    "Carretilla frontal contrapesada · Traspaleta eléctrica · Apiladora eléctrica · "
    "Carretilla retráctil · Recogepedidos",
    tam=8.3, alto=10.2, col=GRIS,
)

c.save()

# Comprobación: el requisito es una única página.
from pypdf import PdfReader

n = len(PdfReader(SALIDA).pages)
sobra_izq = round(izq.y / mm, 1)
sobra_der = round(der.y / mm, 1)
print(f"PDF generado: {SALIDA}")
print(f"páginas: {n}  ({'CORRECTO' if n == 1 else 'ERROR: debe ser 1'})")
print(f"margen inferior restante — izquierda: {sobra_izq} mm · derecha: {sobra_der} mm")
