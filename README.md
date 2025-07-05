# comtuber
## Cloning
```sh
git clone https://github.com/New9c/comtuber
cd comtuber
```

Works best on chromium, least amount of lag.

## Running:
```sh
mkdir imgs
```
Add these expressions to `imgs`:
```
imgs/
├── BRB.png
├── b_smirk.png
├── b_talking.png
├── b_uhh.png (Optional)
├── confused.png
├── cry.png
├── default.png
├── haha.png
├── hard_think.png
├── mad.png
├── mhm.png
├── mourn.png
├── _.png
├── sadge.png
├── sad.png
├── satisfied.png
├── sleep.png
├── smirk.png
├── stunned.png
├── talking.png
├── tri_.png
├── uhh.png (Optional)
├── welp.png
├── wow.png
└── yawn.png
```
All it really is is binding a type of facial feature to a face, so you can modify it in the js script.
Then run:
```sh
cd /path/to/comtuber
python -m http.server <port_number>
```
`port_number` can be 8000, 7777 or something else, defaults to 8000 if not filled.
Open chromium at `localhost:<port_number>` to check it out.

## Problems:
- Too jumpy, either very static or the complete opposite.
- One expression can mean many things

