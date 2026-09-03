import qrcode, numpy as np, cv2
from PIL import Image, ImageDraw, ImageOps
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import CircleModuleDrawer, RoundedModuleDrawer, GappedSquareModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
URL="https://www.goodsoncountry.com/"
CREAM=(251,248,241); INK=(43,42,38); TERRA=(196,92,62); SAGE=(221,226,210)
def base(ec=qrcode.constants.ERROR_CORRECT_H):
    q=qrcode.QRCode(error_correction=ec, box_size=1, border=0); q.add_data(URL); q.make(fit=True); return q
def centre_badge(size, bg=CREAM):
    mark=Image.open("qr/mark-ink.png").convert("RGBA")
    badge=Image.new("RGBA",(size,size),(0,0,0,0)); d=ImageDraw.Draw(badge)
    d.rounded_rectangle([0,0,size-1,size-1], radius=size//6, fill=bg+(255,))
    m=mark.copy(); m.thumbnail((int(size*0.78), int(size*0.78)))
    badge.paste(m, ((size-m.width)//2,(size-m.height)//2), m); return badge
def styled(name, drawer, front, back, badge=True):
    q=base(); q.box_size=24; q.border=4
    kw=dict(image_factory=StyledPilImage, module_drawer=drawer, color_mask=SolidFillColorMask(back_color=back, front_color=front))
    if badge:
        b=centre_badge(360, bg=back); b.save("qr/_badge.png"); kw["embeded_image_path"]="qr/_badge.png"
    img=q.make_image(**kw).convert("RGB"); img.save(f"qr/{name}.png"); return img
def halftone(name, photo, bit_color=INK, tone_color=TERRA, back=CREAM, sub=14, quiet=4):
    q=base(); M=np.array(q.get_matrix(),dtype=bool); n=M.shape[0]; v=q.version
    prot=np.zeros((n,n),bool)
    for (r,c) in [(0,0),(0,n-8),(n-8,0)]: prot[r:r+8,c:c+8]=True
    prot[8,0:9]=True; prot[0:9,8]=True; prot[8,n-8:]=True; prot[n-8:,8]=True
    prot[6,:]=True; prot[:,6]=True; prot[n-8,8]=True
    from qrcode.util import pattern_position
    pos=pattern_position(v)
    for r in pos:
        for c in pos:
            if prot[r,c]: continue
            prot[r-2:r+3,c-2:c+3]=True
    cell=3*sub; W=(n+2*quiet)*cell
    ph=Image.open(photo).convert("L"); ph=ImageOps.fit(ph,(n*3,n*3)); ph=ImageOps.autocontrast(ph,cutoff=2)
    P=np.array(ph); 
    img=Image.new("RGB",(W,W),back); d=ImageDraw.Draw(img)
    for r in range(n):
        for c in range(n):
            x0=(c+quiet)*cell; y0=(r+quiet)*cell; bit=M[r,c]
            if prot[r,c]:
                if bit: d.rectangle([x0,y0,x0+cell-1,y0+cell-1], fill=bit_color)
                continue
            for i in range(3):
                for j in range(3):
                    sx=x0+j*sub; sy=y0+i*sub
                    if i==1 and j==1:
                        pad=-int(sub*0.15)
                        d.rectangle([sx+pad,sy+pad,sx+sub-1-pad,sy+sub-1-pad], fill=(bit_color if bit else back))
                    else:
                        if P[r*3+i,c*3+j] < 118: d.rectangle([sx,sy,sx+sub-1,sy+sub-1], fill=tone_color)
    img.save(f"qr/{name}.png"); return img
def decode(path, widths=(1400,700,420)):
    det=cv2.QRCodeDetector(); im=cv2.imread(path); out=[]
    for w in widths:
        h=int(im.shape[0]*w/im.shape[1]); s=cv2.resize(im,(w,h),interpolation=cv2.INTER_AREA)
        data,_,_=det.detectAndDecode(s); out.append((w, data==URL))
    return out
styled("qr-01-terracotta-dots", CircleModuleDrawer(), TERRA, CREAM)
styled("qr-02-ink-rounded", RoundedModuleDrawer(), INK, CREAM)
styled("qr-03-cream-on-ink", CircleModuleDrawer(), CREAM, INK)
styled("qr-04-plain-ink", GappedSquareModuleDrawer(size_ratio=0.9), INK, CREAM, badge=False)
halftone("qr-05-halftone-bed", "qr/bed.jpg")
halftone("qr-06-halftone-gamardi", "qr/gamardi.jpg", bit_color=INK, tone_color=(120,110,100))
for nm in ["qr-01-terracotta-dots","qr-02-ink-rounded","qr-03-cream-on-ink","qr-04-plain-ink","qr-05-halftone-bed","qr-06-halftone-gamardi"]:
    print(nm, decode(f"qr/{nm}.png"))
print("version", base().version, "modules", len(base().get_matrix()))
