"""
Genera public/og-image.png (1200x630), la imagen que se ve al compartir el
portfolio, con la estética de menú voxel.
Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

Fondo: un recorte de la tira del panorama (public/panorama/panorama.webp).
Texto: Monocraft (src/assets/fuentes/*.woff2, convertida a TTF en memoria),
sobre un panel negro al 70 % para que se lea. El número de proyectos se
cuenta de src/data/projects, así que no se queda anticuado.

Uso: python -P scripts/generar-og-image.py
"""
import io
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / 'public' / 'og-image.png'
PANORAMA = RAIZ / 'public' / 'panorama' / 'panorama.webp'
FUENTES = RAIZ / 'src' / 'assets' / 'fuentes'
PROYECTOS = RAIZ / 'src' / 'data' / 'projects'

ANCHO, ALTO = 1200, 630
# Zona de la tira que se recorta (px sobre el original de 3840x1024).
RECORTE_X, RECORTE_Y = 1300, 180

TEXTO = (224, 224, 224)
SUAVE = (189, 189, 189)
AMARILLO = (255, 255, 160)
SOMBRA = (56, 56, 56)


def fuente(peso, tam):
    """Carga Monocraft desde el woff2 del sitio, sin escribir archivos."""
    ttf = TTFont(FUENTES / f'monocraft-{peso}.woff2')
    ttf.flavor = None
    memoria = io.BytesIO()
    ttf.save(memoria)
    memoria.seek(0)
    return ImageFont.truetype(memoria, tam)


def texto(dib, xy, cadena, fnt, color):
    """Texto con la sombra dura de 4 px del menú del juego."""
    x, y = xy
    dib.text((x + 4, y + 4), cadena, font=fnt, fill=SOMBRA)
    dib.text((x, y), cadena, font=fnt, fill=color)


def main():
    n_proyectos = len(list(PROYECTOS.glob('*.js')))

    fondo = Image.open(PANORAMA).convert('RGB')
    fondo = fondo.crop((RECORTE_X, RECORTE_Y, RECORTE_X + ANCHO, RECORTE_Y + ALTO))

    # Panel negro al 70 %, con el borde negro de 4 px de los botones.
    capa = Image.new('RGBA', (ANCHO, ALTO), (0, 0, 0, 0))
    dc = ImageDraw.Draw(capa)
    dc.rectangle((60, 60, ANCHO - 60, ALTO - 60), fill=(0, 0, 0, 179))
    dc.rectangle((60, 60, ANCHO - 60, ALTO - 60), outline=(0, 0, 0, 255), width=4)
    img = Image.alpha_composite(fondo.convert('RGBA'), capa).convert('RGB')
    d = ImageDraw.Draw(img)

    x = 110
    texto(d, (x, 100), 'DESARROLLADOR MULTIPLATAFORMA', fuente(400, 22), SUAVE)
    nombre = fuente(700, 76)
    texto(d, (x, 160), 'Ángel Serrano', nombre, TEXTO)
    texto(d, (x, 250), 'Domínguez', nombre, AMARILLO)
    d.rectangle((x, 360, ANCHO - 110, 363), fill=(80, 80, 80))
    texto(d, (x, 392), 'Apps Android, Flutter y web de principio a fin', fuente(400, 26), TEXTO)

    # Etiquetas de tecnología, como los botones del menú.
    peq = fuente(400, 20)
    cx = x
    for etiqueta in ('Kotlin', 'Flutter', 'React', 'TypeScript'):
        ancho = int(d.textlength(etiqueta, font=peq)) + 36
        d.rectangle((cx, 460, cx + ancho, 502), fill=(111, 111, 111), outline=(0, 0, 0), width=3)
        texto(d, (cx + 18, 470), etiqueta, peq, TEXTO)
        cx += ancho + 14

    cuenta = f'{n_proyectos} proyectos'
    ancho_c = int(d.textlength(cuenta, font=peq))
    texto(d, (ANCHO - 110 - ancho_c, 470), cuenta, peq, AMARILLO)
    texto(d, (x, 530), 'aserrano.dev', fuente(400, 20), SUAVE)

    # Paleta reducida: el panorama es pixel art y así pesa mucho menos.
    img.quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(
        SALIDA, optimize=True
    )
    print(f'{SALIDA} · {SALIDA.stat().st_size / 1024:.0f} kB · {n_proyectos} proyectos')


if __name__ == '__main__':
    main()
