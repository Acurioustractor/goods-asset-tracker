exec(open('qr/v10.py').read().split('halftone("qr-09')[0])
halftone("qr-12-halftone-illustration-v10","qr/ill.jpg", core=0.7, thresh=110, tone=(196,92,62), sub=8)
halftone("qr-13-halftone-leg-v10","qr/leg.jpg", core=0.7, thresh=100, tone=(196,92,62), sub=8)
for nm in ["qr-12-halftone-illustration-v10","qr-13-halftone-leg-v10"]: print(nm, decode(f"qr/{nm}.png", widths=(1600,900,520)))
