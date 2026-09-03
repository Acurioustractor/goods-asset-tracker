import qrcode, numpy as np, cv2, base64
from PIL import Image, ImageDraw, ImageOps
from qrcode.util import pattern_position
URL="https://www.goodsoncountry.com/"
CREAM=(251,248,241); INK=(43,42,38); TERRA=(196,92,62); TONE=(201,185,159)
def base():
    q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=1, border=0); q.add_data(URL); q.make(fit=True); return q
def protected(M,v):
    n=M.shape[0]; p=np.zeros((n,n),bool)
    for (r,c) in [(0,0),(0,n-8),(n-8,0)]: p[r:r+8,c:c+8]=True
    p[8,0:9]=True; p[0:9,8]=True; p[8,n-8:]=True; p[n-8:,8]=True; p[6,:]=True; p[:,6]=True; p[n-8,8]=True
    pos=pattern_position(v)
    for r in pos:
        for c in pos:
            if not p[r,c]: p[r-2:r+3,c-2:c+3]=True
    return p
def finder_mask(n):
    f=np.zeros((n,n),bool)
    for (r,c) in [(0,0),(0,n-7),(n-7,0)]: f[r:r+7,c:c+7]=True
    return f
def halftone(name, photo, bit=INK, tone=TONE, back=CREAM, sub=14, quiet=4, core=0.58, thresh=128):
    q=base(); M=np.array(q.get_matrix(),bool); n=M.shape[0]; prot=protected(M,q.version); fin=finder_mask(n)
    cell=3*sub; W=(n+2*quiet)*cell
    ph=ImageOps.autocontrast(ImageOps.fit(Image.open(photo).convert("L"),(n*3,n*3)),cutoff=2); P=np.array(ph)
    img=Image.new("RGB",(W,W),back); d=ImageDraw.Draw(img)
    for r in range(n):
        for c in range(n):
            x0=(c+quiet)*cell; y0=(r+quiet)*cell; b=M[r,c]
            if prot[r,c]:
                col = TERRA if (fin[r,c] and b) else bit
                if b: d.rectangle([x0,y0,x0+cell-1,y0+cell-1], fill=col)
                continue
            for i in range(3):
                for j in range(3):
                    sx=x0+j*sub; sy=y0+i*sub
                    if not (i==1 and j==1) and P[r*3+i,c*3+j]<thresh: d.rectangle([sx,sy,sx+sub-1,sy+sub-1], fill=tone)
            k=int(cell*core); o=(cell-k)//2
            d.rectangle([x0+o,y0+o,x0+o+k-1,y0+o+k-1], fill=(bit if b else back))
    img.save(f"qr/{name}.png"); return img
def eyes(name, data=INK, eye=TERRA, back=CREAM, box=24, quiet=4, dot=True):
    q=base(); M=np.array(q.get_matrix(),bool); n=M.shape[0]; fin=finder_mask(n); W=(n+2*quiet)*box
    img=Image.new("RGB",(W,W),back); d=ImageDraw.Draw(img)
    for r in range(n):
        for c in range(n):
            if not M[r,c]: continue
            x0=(c+quiet)*box; y0=(r+quiet)*box
            if fin[r,c]: d.rectangle([x0,y0,x0+box-1,y0+box-1], fill=eye)
            elif dot: d.ellipse([x0+2,y0+2,x0+box-3,y0+box-3], fill=data)
            else: d.rectangle([x0+1,y0+1,x0+box-2,y0+box-2], fill=data)
    img.save(f"qr/{name}.png"); return img
def decode(path, widths=(1400,700,420)):
    det=cv2.QRCodeDetector(); im=cv2.imread(path); out=[]
    for w in widths:
        s=cv2.resize(im,(w,int(im.shape[0]*w/im.shape[1])),interpolation=cv2.INTER_AREA); data,_,_=det.detectAndDecode(s); out.append((w,data==URL))
    return out
halftone("qr-05-halftone-bed","qr/bed.jpg")
halftone("qr-06-halftone-gamardi","qr/gamardi.jpg", tone=(150,140,128))
halftone("qr-07-halftone-bed-terracotta","qr/bed.jpg", tone=(226,170,150))
eyes("qr-08-terracotta-eyes")
for nm in ["qr-05-halftone-bed","qr-06-halftone-gamardi","qr-07-halftone-bed-terracotta","qr-08-terracotta-eyes"]: print(nm, decode(f"qr/{nm}.png"))
# print artwork, real size in mm: mark 500 wide, QR 200, caption
logo=base64.b64encode(open("qr/logo-ink.svg","rb").read()).decode()
qrb=base64.b64encode(open("qr/qr-02-ink-rounded.png","rb").read()).decode()
s=500/578.9; iw,ih=741*s,350*s; ix=(800-500)/2-81.8*s; iy=40-76.9*s
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="800mm" height="520mm" viewBox="0 0 800 520">
<rect width="800" height="520" fill="#FBF8F1"/>
<image href="data:image/svg+xml;base64,{logo}" x="{ix:.1f}" y="{iy:.1f}" width="{iw:.1f}" height="{ih:.1f}"/>
<image href="data:image/png;base64,{qrb}" x="300" y="250" width="200" height="200"/>
<text x="400" y="492" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" fill="#2B2A26">Scan for this bed's story</text>
<text x="400" y="512" text-anchor="middle" font-family="Menlo, monospace" font-size="8" fill="#6B6862">Foot-end print block, 800 x 520 mm at 1:1. Mark 500 x 182 mm. QR 200 mm with 20 mm quiet zone. Keep 60 mm clear of each sleeve seam.</text>
</svg>'''
open("qr/print-foot-end-800x520mm.svg","w").write(svg); print("print artwork written")
