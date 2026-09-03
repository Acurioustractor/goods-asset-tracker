import qrcode, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
URL="https://www.goodsoncountry.com/"; CREAM=(251,248,241,255); INK=(43,42,38,255); TERRA=(196,92,62,255); WHITE=(255,255,255,255); CLEAR=(0,0,0,0)
def font(sz):
    for f,i in [("/System/Library/Fonts/Helvetica.ttc",1),("/System/Library/Fonts/Supplemental/Arial Bold.ttf",0)]:
        try: return ImageFont.truetype(f, sz, index=i)
        except Exception: pass
    return ImageFont.load_default()
def finder_mask(n):
    f=np.zeros((n,n),bool)
    for (r,c) in [(0,0),(0,n-7),(n-7,0)]: f[r:r+7,c:c+7]=True
    return f
def build(name, data, eye, back, text=("Designed","on Country"), textcol=None, box=24, quiet=4, badge_frac=0.40, badge_bg=None):
    q=qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=1, border=0); q.add_data(URL); q.make(fit=True)
    M=np.array(q.get_matrix(),bool); n=M.shape[0]; fin=finder_mask(n); Wd=(n+2*quiet)*box
    img=Image.new("RGBA",(Wd,Wd),back); d=ImageDraw.Draw(img)
    for r in range(n):
        for c in range(n):
            if not M[r,c]: continue
            x0=(c+quiet)*box; y0=(r+quiet)*box
            if fin[r,c]: d.rectangle([x0,y0,x0+box-1,y0+box-1], fill=eye)
            else: d.ellipse([x0+2,y0+2,x0+box-3,y0+box-3], fill=data)
    s=int(n*box*badge_frac); cx=cy=Wd//2
    d.rounded_rectangle([cx-s//2,cy-s//2,cx+s//2,cy+s//2], radius=s//7, fill=(badge_bg or back))
    tc=textcol or data; f1=font(int(s*0.17)); 
    lines=text; hs=[d.textbbox((0,0),t,font=f1)[3] for t in lines]; gap=int(s*0.04); tot=sum(hs)+gap*(len(lines)-1); y=cy-tot//2
    for t,h in zip(lines,hs):
        w=d.textbbox((0,0),t,font=f1)[2]; d.text((cx-w//2,y),t,font=f1,fill=tc); y+=h+gap
    img.save(f"qr/{name}.png"); return img
def decode(path, invert=False, widths=(1400,700,420)):
    det=cv2.QRCodeDetector(); im=cv2.imread(path); im=(255-im) if invert else im; out=[]
    for w in widths:
        s=cv2.resize(im,(w,int(im.shape[0]*w/im.shape[1])),interpolation=cv2.INTER_AREA); dt,_,_=det.detectAndDecode(s); out.append((w,dt==URL))
    return out
build("qr-t1-terracotta-designed-on-country", TERRA, TERRA, CREAM, textcol=INK)
build("qr-t2-ink-designed-on-country", INK, INK, CREAM, textcol=INK)
build("qr-t3-white-designed-on-country", WHITE, WHITE, CLEAR, textcol=WHITE)
for nm in ["qr-t1-terracotta-designed-on-country","qr-t2-ink-designed-on-country"]:
    Image.open(f"qr/{nm}.png").convert("RGB").save(f"qr/{nm}-flat.png"); print(nm, decode(f"qr/{nm}-flat.png"))
im=Image.open("qr/qr-t3-white-designed-on-country.png"); bg=Image.new("RGBA",im.size,INK); bg.alpha_composite(im); bg.convert("RGB").save("qr/qr-t3-white-designed-on-country-on-ink.png")
print("qr-t3 white on ink (inverted):", decode("qr/qr-t3-white-designed-on-country-on-ink.png", invert=True))
