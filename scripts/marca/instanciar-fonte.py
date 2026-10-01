from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import sys
wd=float(sys.argv[1]); wg=float(sys.argv[2])
f=TTFont('../fontpkg/package/files/archivo-latin-wdth-normal.woff2')
i=instantiateVariableFont(f,{'wdth':wd,'wght':wg})
i.flavor=None
i.save(f'archivo-{int(wd)}-{int(wg)}.ttf')
