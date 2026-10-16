"""
Genera la textura de los botones de la estética de menú voxel.
Copyright (c) 2026 Ángel Serrano Domínguez. Todos los derechos reservados.

Es un mosaico de 16x16 píxeles grises con un poco de ruido, que el CSS repite
a 32 px con image-rendering: pixelated. La semilla es fija para que al
regenerarla salga el mismo archivo.
"""
import random
from pathlib import Path

from PIL import Image

BASE = 0x6F
RUIDO = 8
DESTINO = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'mc' / 'boton.png'


def main():
    random.seed(1)
    img = Image.new('RGB', (16, 16))
    for y in range(16):
        for x in range(16):
            v = BASE + random.randint(-RUIDO, RUIDO)
            img.putpixel((x, y), (v, v, v))
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    img.save(DESTINO, optimize=True)
    print(f'{DESTINO} ({DESTINO.stat().st_size} B)')


if __name__ == '__main__':
    main()
