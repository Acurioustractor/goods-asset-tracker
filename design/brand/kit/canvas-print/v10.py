exec(open('qr/make2.py').read().split('halftone("qr-05')[0])
def base10():
    q=qrcode.QRCode(version=10, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=1, border=0); q.add_data(URL); q.make(fit=False); return q
base=base10
halftone("qr-09-halftone-bed-v10","qr/bed.jpg", core=0.7, thresh=80, tone=(214,200,178), sub=8)
halftone("qr-10-halftone-gamardi-v10","qr/gamardi.jpg", core=0.7, thresh=85, tone=(196,92,62), sub=8)
halftone("qr-11-halftone-gamardi-v10-sand","qr/gamardi.jpg", core=0.7, thresh=85, tone=(190,172,140), sub=8)
for nm in ["qr-09-halftone-bed-v10","qr-10-halftone-gamardi-v10","qr-11-halftone-gamardi-v10-sand"]: print(nm, decode(f"qr/{nm}.png", widths=(1600,900,520)))
print("modules", len(base().get_matrix()))
