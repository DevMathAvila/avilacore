# Gera os SVGs finais da marca AvilaCore (wordmark + simbolo "Foco").
# Base: Archivo (OFL) instanciada em wdth 125 / wght 800, com espacamento proprio
# e o pingo do "i" redesenhado como quadrado elevado.
import uharfbuzz as hb, re
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
OUT='D:/03.Dev/02.avilacore/src/brand/'
C=dict(noite='#0E1624', papel='#EDEBE6', ciano='#5CC0D0', ciano_esc='#0B6477')
FONT='archivo-125-800.ttf'; f=TTFont(FONT); gs=f.getGlyphSet()
font=hb.Font(hb.Face(hb.Blob.from_file_path(FONT)))
def rnd(d): return re.sub(r'-?\d+\.\d+', lambda m: str(round(float(m.group()))), d)
def gp(g,dx,base):
    p=SVGPathPen(gs); gs[g].draw(TransformPen(p,(1,0,0,-1,dx,base))); return rnd(p.getCommands())
TRACK=-10; LIFT=40; BASE=830
buf=hb.Buffer(); buf.add_str('AvilaCore'); buf.guess_segment_properties(); hb.shape(font,buf,{'kern':True})
x=0; body=[]; dot=''
for i,(inf,pos) in enumerate(zip(buf.glyph_infos,buf.glyph_positions)):
    g=f.getGlyphName(inf.codepoint)
    if g=='i':
        body.append(f'M{x+65} {BASE}H{x+250}V{BASE-528}H{x+65}Z')
        y0=601+LIFT; s=185
        dot=f'M{x+65} {BASE-y0}H{x+250}V{BASE-y0-s}H{x+65}Z'
    else: body.append(gp(g,x,BASE))
    x+=pos.x_advance+TRACK
W=x-TRACK
body=''.join(body)
VB=f'0 0 {W} {BASE}'
def wm(fg,dotc,title='AvilaCore'):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" role="img" aria-label="{title}"><title>{title}</title><path fill="{fg}" d="{body}"/><path fill="{dotc}" d="{dot}"/></svg>\n'
open(OUT+'logo-avilacore-clara.svg','w').write(wm(C['papel'],C['ciano']))
open(OUT+'logo-avilacore-escura.svg','w').write(wm(C['noite'],C['ciano_esc']))
open(OUT+'logo-avilacore-uma-cor.svg','w').write(wm('currentColor','currentColor'))
# ---- simbolo "Foco": dois cantos de enquadramento + nucleo quadrado (grade 1000)
def foco_paths(t=100, arm=260, a=180, sq=250):
    b=1000-a
    tl=f'M{a} {a}H{a+arm}V{a+t}H{a+t}V{a+arm}H{a}Z'
    br=f'M{b} {b}H{b-arm}V{b-t}H{b-t}V{b-arm}H{b}Z'
    c=(1000-sq)/2
    core=f'M{c:g} {c:g}H{c+sq:g}V{c+sq:g}H{c:g}Z'
    return tl+br, core
# versao otica para 16-32 px, desenhada numa grade de 16 px
def foco_pixel():
    u=62.5
    def R(x,y,w,h): return f'M{x*u:g} {y*u:g}H{(x+w)*u:g}V{(y+h)*u:g}H{x*u:g}Z'
    frame=R(1,1,5,2)+R(1,3,2,3)+R(10,13,5,2)+R(13,10,2,3)
    core=R(5,5,6,6)
    return frame, core
fr,core=foco_paths()
def sym(fg,cc,bg=None,shape='rect',paths=(fr,core),title='AvilaCore'):
    bgs=''
    if bg and shape=='rect': bgs=f'<rect width="1000" height="1000" rx="220" fill="{bg}"/>'
    if bg and shape=='circle': bgs=f'<circle cx="500" cy="500" r="500" fill="{bg}"/>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-label="{title}"><title>{title}</title>{bgs}<path fill="{fg}" d="{paths[0]}"/><path fill="{cc}" d="{paths[1]}"/></svg>\n'
open(OUT+'simbolo-foco-clara.svg','w').write(sym(C['papel'],C['ciano']))
open(OUT+'simbolo-foco-escura.svg','w').write(sym(C['noite'],C['ciano_esc']))
open(OUT+'simbolo-foco-uma-cor.svg','w').write(sym('currentColor','currentColor'))
open(OUT+'simbolo-foco-app.svg','w').write(sym(C['papel'],C['ciano'],bg=C['noite']))
open(OUT+'favicon.svg','w').write(sym(C['papel'],C['ciano'],bg=C['noite'],paths=foco_pixel()))
open(OUT+'avatar-instagram.svg','w').write(sym(C['papel'],C['ciano'],bg=C['noite'],shape='circle',paths=foco_paths(a=250,arm=200,t=80,sq=200)))
print('W',W,'dot',dot)
