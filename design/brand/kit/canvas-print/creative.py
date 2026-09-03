import qrcode, numpy as np, cv2, math, random
from PIL import Image, ImageDraw, ImageFont
random.seed(7)
CREAM=(251,248,241,255); INK=(43,42,38,255); TERRA=(196,92,62,255); CLEAR=(0,0,0,0)
def font(sz):
    return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", sz, index=1)
def matrix(url, v=None):
    q=qrcode.QRCode(version=v, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=1, border=0); q.add_data(url); q.make(fit=(v is None)); return np.array(q.get_matrix(),bool)
def finder(n):
    f=np.zeros((n,n),bool)
    for (r,c) in [(0,0),(0,n-7),(n-7,0)]: f[r:r+7,c:c+7]=True
    return f
def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(4))
def badge(d, cx, cy, s, lines, fill, textcol):
    d.rounded_rectangle([cx-s//2,cy-s//2,cx+s//2,cy+s//2], radius=s//7, fill=fill)
    f=font(int(s*0.17)); hs=[d.textbbox((0,0),t,font=f)[3] for t in lines]; gap=int(s*0.04); y=cy-(sum(hs)+gap*(len(lines)-1))//2
    for t,h in zip(lines,hs): w=d.textbbox((0,0),t,font=f)[2]; d.text((cx-w//2,y),t,font=f,fill=textcol); y+=h+gap
def draw(name, url, style, lines=("Designed","on Country"), box=24, quiet=4, back=CREAM):
    M=matrix(url); n=M.shape[0]; F=finder(n); Wd=(n+2*quiet)*box
    img=Image.new("RGBA",(Wd,Wd),back); d=ImageDraw.Draw(img)
    for r in range(n):
        for c in range(n):
            x0=(c+quiet)*box; y0=(r+quiet)*box; cx=x0+box/2; cy=y0+box/2; t=(r+c)/(2*n)
            if F[r,c]:
                if M[r,c]: d.rectangle([x0,y0,x0+box-1,y0+box-1], fill=(TERRA if style in("gradient","chips") else INK))
                continue
            if not M[r,c]: continue
            if style=="gradient":
                d.ellipse([x0+2,y0+2,x0+box-3,y0+box-3], fill=lerp(TERRA,INK,t))
            elif style=="chips":
                k=random.randint(5,7); rot=random.random()*math.tau; rad=box*0.47
                pts=[(cx+rad*(0.82+0.18*random.random())*math.cos(rot+i*math.tau/k), cy+rad*(0.82+0.18*random.random())*math.sin(rot+i*math.tau/k)) for i in range(k)]
                d.polygon(pts, fill=INK)
            elif style=="field":
                d.ellipse([x0+2,y0+2,x0+box-3,y0+box-3], fill=INK)
    if style=="field":
        # decorative dots beyond the quiet zone, thinning outward; bigger canvas
        pad=box*10; big=Image.new("RGBA",(Wd+2*pad,Wd+2*pad),back); bd=ImageDraw.Draw(big)
        for gy in range(-10, n+2*quiet+10):
            for gx in range(-10, n+2*quiet+10):
                inside = quiet<=gx<n+quiet and quiet<=gy<n+quiet
                inquiet = 0<=gx<n+2*quiet and 0<=gy<n+2*quiet
                if inside or inquiet: continue
                dist=max(-gx, gx-(n+2*quiet-1), -gy, gy-(n+2*quiet-1)); p=max(0.0, 0.55-0.055*dist)
                if random.random()<p:
                    x=pad+gx*box; y=pad+gy*box; d2=random.choice([box-6,box-8,box-10]); bd.ellipse([x+(box-d2)/2,y+(box-d2)/2,x+(box+d2)/2,y+(box+d2)/2], fill=INK)
        big.alpha_composite(img,(pad,pad)); img=big; d=ImageDraw.Draw(img); Wd=img.size[0]
    s=int(n*box*0.40); badge(d, img.size[0]//2, img.size[1]//2, s, lines, back, INK)
    img.save(f"qr/{name}.png"); return img
def decode(path, widths=(1400,700,420)):
    det=cv2.QRCodeDetector(); im=cv2.imread(path); out=[]
    for w in widths:
        s=cv2.resize(im,(w,int(im.shape[0]*w/im.shape[1])),interpolation=cv2.INTER_AREA); dt,_,_=det.detectAndDecode(s); out.append((w,bool(dt)))
    return out
URL="https://www.goodsoncountry.com/"
draw("qr-c1-gradient", URL, "gradient")
draw("qr-c2-plastic-chips", URL, "chips")
draw("qr-c3-dot-field", URL, "field")
draw("qr-c4-bed-passport", "https://goodsoncountry.com/b/0412", "gradient", lines=("Bed 0412","Designed","on Country"))
for nm in ["qr-c1-gradient","qr-c2-plastic-chips","qr-c3-dot-field","qr-c4-bed-passport"]:
    Image.open(f"qr/{nm}.png").convert("RGB").save(f"qr/{nm}-flat.png"); print(nm, decode(f"qr/{nm}-flat.png"))
