import qrcode, numpy as np, cv2, base64
from PIL import Image, ImageDraw, ImageOps
from qrcode.util import pattern_position
URL="https://www.goodsoncountry.com/"; WHITE=(255,255,255,255); CLEAR=(0,0,0,0); INK=(43,42,38)
def base(v=None):
    q=qrcode.QRCode(version=v, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=1, border=0); q.add_data(URL); q.make(fit=(v is None)); return q
def finder_mask(n):
    f=np.zeros((n,n),bool)
    for (r,c) in [(0,0),(0,n-7),(n-7,0)]: f[r:r+7,c:c+7]=True
    return f
def protected(M,v):
    n=M.shape[0]; p=np.zeros((n,n),bool)
    for (r,c) in [(0,0),(0,n-8),(n-8,0)]: p[r:r+8,c:c+8]=True
    p[8,0:9]=True; p[0:9,8]=True; p[8,n-8:]=True; p[n-8:,8]=True; p[6,:]=True; p[:,6]=True; p[n-8,8]=True
    pos=pattern_position(v)
    for r in pos:
        for c in pos:
            if not p[r,c]: p[r-2:r+3,c-2:c+3]=True
    return p
def dots_white(name, box=24, quiet=4, badge=True):
    q=base(); M=np.array(q.get_matrix(),bool); n=M.shape[0]; fin=finder_mask(n); Wd=(n+2*quiet)*box
    img=Image.new("RGBA",(Wd,Wd),CLEAR); d=ImageDraw.Draw(img)
    for r in range(n):
        for c in range(n):
            if not M[r,c]: continue
            x0=(c+quiet)*box; y0=(r+quiet)*box
            if fin[r,c]: d.rectangle([x0,y0,x0+box-1,y0+box-1], fill=WHITE)
            else: d.ellipse([x0+2,y0+2,x0+box-3,y0+box-3], fill=WHITE)
    if badge:
        s=int(n*box*0.30); cx=cy=Wd//2
        d.rounded_rectangle([cx-s//2-quiet*2,cy-s//2-quiet*2,cx+s//2+quiet*2,cy+s//2+quiet*2], radius=s//6, fill=CLEAR)
        m=Image.open("qr/mark-white.png").convert("RGBA"); m.thumbnail((int(s*0.9),int(s*0.9))); img.paste(m,(cx-m.width//2,cy-m.height//2),m)
    img.save(f"qr/{name}.png"); return img
def halftone_white(name, photo, v=10, sub=8, quiet=4, core=0.7, thresh=100, tone_alpha=150):
    q=base(v); M=np.array(q.get_matrix(),bool); n=M.shape[0]; prot=protected(M,q.version); cell=3*sub; Wd=(n+2*quiet)*cell
    ph=ImageOps.autocontrast(ImageOps.fit(Image.open(photo).convert("L"),(n*3,n*3)),cutoff=2); P=np.array(ph)
    img=Image.new("RGBA",(Wd,Wd),CLEAR); d=ImageDraw.Draw(img); tone=(255,255,255,tone_alpha)
    for r in range(n):
        for c in range(n):
            x0=(c+quiet)*cell; y0=(r+quiet)*cell; b=M[r,c]
            if prot[r,c]:
                if b: d.rectangle([x0,y0,x0+cell-1,y0+cell-1], fill=WHITE)
                continue
            for i in range(3):
                for j in range(3):
                    if not (i==1 and j==1) and P[r*3+i,c*3+j]<thresh: d.rectangle([x0+j*sub,y0+i*sub,x0+j*sub+sub-1,y0+i*sub+sub-1], fill=tone)
            k=int(cell*core); o=(cell-k)//2
            d.rectangle([x0+o,y0+o,x0+o+k-1,y0+o+k-1], fill=(WHITE if b else CLEAR))
    img.save(f"qr/{name}.png"); return img
def on_ink(name):
    im=Image.open(f"qr/{name}.png").convert("RGBA"); bg=Image.new("RGBA",im.size,INK+(255,)); bg.alpha_composite(im); out=bg.convert("RGB"); out.save(f"qr/{name}-on-ink.png"); return out
def decode_inverted(path, widths=(1400,700,420)):
    det=cv2.QRCodeDetector(); im=cv2.imread(path); im=255-im; res=[]
    for w in widths:
        s=cv2.resize(im,(w,int(im.shape[0]*w/im.shape[1])),interpolation=cv2.INTER_AREA); data,_,_=det.detectAndDecode(s); res.append((w,data==URL))
    return res
dots_white("qr-w1-white-dots-mark"); dots_white("qr-w2-white-dots", badge=False)
halftone_white("qr-w3-white-xleg","qr/leg.jpg", thresh=100); halftone_white("qr-w4-white-illustration","qr/ill.jpg", thresh=110)
for nm in ["qr-w1-white-dots-mark","qr-w2-white-dots","qr-w3-white-xleg","qr-w4-white-illustration"]:
    on_ink(nm); print(nm, "inverted-decode on ink:", decode_inverted(f"qr/{nm}-on-ink.png"))
# white print block on transparent, 1:1 mm
logo=base64.b64encode(open("qr/logo-white.svg","rb").read()).decode(); qrb=base64.b64encode(open("qr/qr-w1-white-dots-mark.png","rb").read()).decode()
s=500/578.9; iw,ih=741*s,350*s; ix=(800-500)/2-81.8*s; iy=40-76.9*s
for bg,nm in [("none","print-foot-end-white-transparent"),("#2B2A26","print-foot-end-white-on-ink-preview")]:
    rect = "" if bg=="none" else f'<rect width="800" height="520" fill="{bg}"/>'
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="800mm" height="520mm" viewBox="0 0 800 520">{rect}
<image href="data:image/svg+xml;base64,{logo}" x="{ix:.1f}" y="{iy:.1f}" width="{iw:.1f}" height="{ih:.1f}"/>
<image href="data:image/png;base64,{qrb}" x="300" y="250" width="200" height="200"/>
<text x="400" y="492" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" fill="#FFFFFF">Scan for this bed's story</text></svg>'''
    open(f"qr/{nm}.svg","w").write(svg)
print("svgs written")
