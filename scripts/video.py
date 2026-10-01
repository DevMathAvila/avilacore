"""
Prepara um video para o site: previa curta, versao completa em 720p e capa.

Uso:
  python scripts/video.py <arquivo-original> <slug> [--inicio=9] [--duracao=8] [--capa=13] [--vertical]

Gera, sem audio e sem os metadados do drone (que incluem GPS e numero de serie):
  public/videos/<slug>-previa.mp4   trecho curto e leve, para tocar nas molduras
  public/videos/<slug>.mp4          video inteiro em 720p, para a pagina do trabalho
  src/assets/trabalhos/<slug>.jpg   capa (quadro do segundo indicado em --capa)

Precisa do ffmpeg: no PATH (winget install Gyan.FFmpeg) ou pelo pacote
imageio-ffmpeg (pip install imageio-ffmpeg).

Video com mais de ~10 MB na versao completa nao deve ir para o repositorio:
suba no YouTube ou no Vimeo e use `formato: video-externo` na ficha.
"""
import shutil
import subprocess
import sys
from pathlib import Path


def achar_ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg nao encontrado. Instale com: winget install Gyan.FFmpeg  (ou pip install imageio-ffmpeg)")


args = [a for a in sys.argv[1:] if not a.startswith("--")]
opcoes = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
vertical = "--vertical" in sys.argv
if len(args) < 2:
    sys.exit(__doc__)

origem, slug = args[0], args[1]
inicio, duracao, capa = opcoes.get("inicio", "0"), opcoes.get("duracao", "8"), opcoes.get("capa", "1")
previa_tam, completo_tam, capa_tam = ("540:960", "720:1280", "1080:1920") if vertical else ("960:540", "1280:720", "1920:1080")

ff = achar_ffmpeg()
Path("public/videos").mkdir(parents=True, exist_ok=True)
Path("src/assets/trabalhos").mkdir(parents=True, exist_ok=True)
comum = ["-map", "0:v:0", "-an", "-map_metadata", "-1", "-map_chapters", "-1", "-c:v", "libx264", "-profile:v", "high",
         "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-preset", "slow"]
base = [ff, "-hide_banner", "-loglevel", "error", "-y"]

subprocess.run(base + ["-ss", inicio, "-t", duracao, "-i", origem] + comum +
               ["-vf", f"scale={previa_tam}:flags=lanczos", "-crf", "27", "-maxrate", "1400k", "-bufsize", "2800k",
                f"public/videos/{slug}-previa.mp4"], check=True)
subprocess.run(base + ["-i", origem] + comum +
               ["-vf", f"scale={completo_tam}:flags=lanczos", "-crf", "26", "-maxrate", "1700k", "-bufsize", "3400k",
                f"public/videos/{slug}.mp4"], check=True)
subprocess.run(base + ["-ss", capa, "-i", origem, "-map_metadata", "-1", "-frames:v", "1",
                       "-vf", f"scale={capa_tam}:flags=lanczos", "-q:v", "2", f"src/assets/trabalhos/{slug}.jpg"], check=True)

for arquivo in (f"public/videos/{slug}-previa.mp4", f"public/videos/{slug}.mp4", f"src/assets/trabalhos/{slug}.jpg"):
    print(f"{Path(arquivo).stat().st_size / 1_048_576:6.2f} MB  {arquivo}")
