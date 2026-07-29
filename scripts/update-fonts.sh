set -eo pipefail

# To fonts directory
cd src/assets/fonts

# Clean up
rm -f *.ttf *.otf

# LXGW NeoXiHei Screen Full
curl -#fLO https://github.com/lxgw/LxgwNeoXiZhi-Screen/releases/latest/download/LXGWNeoXiHeiScreenFull.ttf

# Noto Color Emoji
curl -#fLO https://github.com/googlefonts/noto-emoji/raw/refs/heads/main/fonts/NotoColorEmoji_WindowsCompatible.ttf

# Spaceport 2006
curl -#fL -o tmp.zip https://dl.dafont.com/dl/?f=spaceport_2006
unzip tmp.zip
rm tmp.zip

# Back to origin working directory
cd -
