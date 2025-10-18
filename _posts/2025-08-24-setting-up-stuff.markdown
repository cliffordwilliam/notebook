---
layout: post
title:  "Setting up stuff!"
date:   2025-08-24 11:37:18 -0500
categories: jekyll update
---

use the Install.sh file in the arch instal env

-------------

check for battery, with this

for b in /sys/class/power_supply/*; do     if grep -q "Battery" "$b/type" 2>/dev/null; then         basename "$b";     fi; done

then go out

alt + shift + Q

edit the slstatus outside

using this or whatever is your battery name is

static const struct arg args[] = {
        /* function format          argument */
        { datetime, "%s",           "%F %T" },
        { battery_state, " %s", "BAT0" },
        { battery_perc, " %s%%", "BAT0" },
};

then make clean, make, and cp the binary

make clean
make
cp slstatus ~/.local/bin/


------------------

you need some packages first, these are needed by nvim when you edit the config and npm i

the xclip is for copy paste to system clipboard, the ripgrep and fd is for telescope and fast finding, the lsp python is needed too, you can add more lsp later

sudo pacman -S xclip ripgrep fd python-lsp-server

now need to setup the nvim

just copy from github the init.lua, then go to nvim and use Lazy sync, its like npm i

---------------------

make dwm 16 and st 20 font size

its hard to see

you need to set this in the dwm, this fixes the weird gaps after you edit the text sizes
static const int resizehints = 0;    /* 1 means respect size hints in tiled resizals */

------------------

get background image from repo, should be named bg

then get this feh

sudo pacman -S feh

then might as well get picom for transparency

sudo pacman -S picom

then we need this in xinitrc

feh --bg-fill ~/Downloads/bg.jpg &
picom &
slstatus &
exec dwm

then edit the picom config like this

make this file ~/.config/picom/picom.conf 

backend = "xrender";
fading = true
fade-delta = 4
opacity-rule = [
  "95:class_g = 'st-256color'",
];

then just exit dwm and go back in again
exit as in use alt shift Q, go back in with startx

---------------------

finally can change the st color theme with catpucin

just use this in place of whatever you have in the st config

/* Terminal colors (16 first used in escape sequence) */
static const char *colorname[] = {
	/* 8 normal colors */
	"#45475A",
	"#F38BA8",
	"#A6E3A1",
	"#F9E2AF",
	"#89B4FA",
	"#F5C2E7",
	"#94E2D5",
	"#BAC2DE",

	/* 8 bright colors */
	"#585B70",
	"#F38BA8",
	"#A6E3A1",
	"#F9E2AF",
	"#89B4FA",
	"#F5C2E7",
	"#94E2D5",
	"#A6ADC8",

[256] = "#CDD6F4", /* default foreground colour */
[257] = "#1E1E2E", /* default background colour */
[258] = "#F5E0DC", /*575268*/

};


/*
 * foreground, background, cursor, reverse cursor
 */
unsigned int defaultfg = 256;
unsigned int defaultbg = 257;
unsigned int defaultcs = 258;
static unsigned int defaultrcs = 258;

---

do not forget to unmute too btw

amixer sset Master 90% unmute

---

generate ssh for github

sudo pacman -S openssh
git config --global user.name "Clifford William"
git config --global user.email ccliffordwilliam@gmail.com
git config --global init.defaultBranch main
git config --global pull.rebase false
ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub

then just set that to github as ssh

------------

do this to get docker running on each session

sudo pacman -S docker
sudo pacman -S docker-compose
sudo systemctl enable docker.service
sudo systemctl start docker.service
sudo usermod -aG docker $USER
newgrp docker

-----------

this is how we get node going

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

this should have beed added but make sure that it has this. it let each session know the nvm
~/.bashrc
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

reload the shell session
source ~/.bashrc  # or ~/.zshrc etc.

for each session you can install whichever you want and use whichever you want that you have in your arsenal
use lts to get node
nvm install --lts
nvm use --lts

node -v
npm -v

-----------

sudo pacman -s fastfetch

then add this to ~/.bashrc

fastfetch

at the very top

optional if you want to

you can also change the PSI value to this to change the prompt color to if you want

PS1='\[\033[01;32m\][\u@\h\[\033[00m\] \[\033[01;34m\]\w\[\033[01;32m\]]\$\[\033[00m\] '
