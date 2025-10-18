---
layout: post
title:  "Setting up stuff!"
date:   2025-08-24 11:37:18 -0500
categories: jekyll update
---

Use the `Install.sh` file in the Arch install environment.

---

## 1. Check for Battery

Run this command to find your battery device:

{% highlight bash %}
for b in /sys/class/power_supply/*; do
    if grep -q "Battery" "$b/type" 2>/dev/null; then
        basename "$b";
    fi;
done
{% endhighlight %}

Then exit with `Alt + Shift + Q`


---

## 2. Edit `slstatus`

Edit `slstatus` using your battery name:

{% highlight c %}
static const struct arg args[] = {
    /* function format          argument */
    { datetime, "%s",           "%F %T" },
    { battery_state, " %s", "BAT0" },
    { battery_perc, " %s%%", "BAT0" },
};
{% endhighlight %}

Compile and install:

{% highlight bash %}
make clean
make
cp slstatus ~/.local/bin/
{% endhighlight %}

---

## 3. Install Required Packages for Neovim

These packages are needed for editing configs and using `npm`:

- `xclip` for system clipboard copy/paste
- `ripgrep` and `fd` for Telescope and fast searching
- `python-lsp-server` for Python LSP support

Install them with:

{% highlight bash %}
sudo pacman -S xclip ripgrep fd python-lsp-server
{% endhighlight %}

Set up Neovim by copying `init.lua` from GitHub, then open Neovim and run Lazy sync (similar to `npm i`).

---

## 4. Font Size Adjustments

Set DWM to 16 and ST to 20 font size (easier to read).  

Fix weird gaps after resizing in DWM:

{% highlight c %}
static const int resizehints = 0;    /* 1 means respect size hints in tiled resizals */
{% endhighlight %}

---

## 5. Background and Transparency

1. Get background image from repo (should be named `bg`).  
2. Install `feh` for wallpapers:

{% highlight bash %}
sudo pacman -S feh
{% endhighlight %}

3. Optionally install `picom` for transparency:

{% highlight bash %}
sudo pacman -S picom
{% endhighlight %}

4. Add the following to `~/.xinitrc`:

{% highlight bash %}
feh --bg-fill ~/Downloads/bg.jpg &
picom &
slstatus &
exec dwm
{% endhighlight %}

5. Create Picom config `~/.config/picom/picom.conf`:

{% highlight ini %}
backend = "xrender";
fading = true
fade-delta = 4
opacity-rule = [
  "95:class_g = 'st-256color'",
];
{% endhighlight %}

Exit DWM (`Alt + Shift + Q`) and restart with `startx`.

---

## 6. Change ST Color Theme (Catppuccin)

Replace the colors in your ST config:

{% highlight c %}
/* Terminal colors (16 first used in escape sequence) */
static const char *colorname[] = {
    /* 8 normal colors */
    "#45475A", "#F38BA8", "#A6E3A1", "#F9E2AF",
    "#89B4FA", "#F5C2E7", "#94E2D5", "#BAC2DE",

    /* 8 bright colors */
    "#585B70", "#F38BA8", "#A6E3A1", "#F9E2AF",
    "#89B4FA", "#F5C2E7", "#94E2D5", "#A6ADC8",

    [256] = "#CDD6F4", /* default foreground colour */
    [257] = "#1E1E2E", /* default background colour */
    [258] = "#F5E0DC", /*575268*/
};

/* foreground, background, cursor, reverse cursor */
unsigned int defaultfg = 256;
unsigned int defaultbg = 257;
unsigned int defaultcs = 258;
static unsigned int defaultrcs = 258;
{% endhighlight %}

---

## 7. Unmute System Audio

{% highlight bash %}
amixer sset Master 90% unmute
{% endhighlight %}

---

## 8. Generate SSH Key for GitHub

{% highlight bash %}
sudo pacman -S openssh
git config --global user.name "Clifford William"
git config --global user.email ccliffordwilliam@gmail.com
git config --global init.defaultBranch main
git config --global pull.rebase false
ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub
{% endhighlight %}

Add the generated key to GitHub.

---

## 9. Set Up Docker

{% highlight bash %}
sudo pacman -S docker
sudo pacman -S docker-compose
sudo systemctl enable docker.service
sudo systemctl start docker.service
sudo usermod -aG docker $USER
newgrp docker
{% endhighlight %}

---

## 10. Install Node via NVM

{% highlight bash %}
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
{% endhighlight %}

Ensure your shell knows NVM (add to `~/.bashrc` or `~/.zshrc`):

{% highlight bash %}
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
{% endhighlight %}

Reload shell:

{% highlight bash %}
source ~/.bashrc  # or ~/.zshrc
{% endhighlight %}

Install Node LTS:

{% highlight bash %}
nvm install --lts
nvm use --lts

node -v
npm -v
{% endhighlight %}

---

## 11. Install Fastfetch

{% highlight bash %}
sudo pacman -S fastfetch
{% endhighlight %}

Add to `~/.bashrc` at the top:

{% highlight bash %}
fastfetch
{% endhighlight %}

Optional: Change prompt color by adding:

{% highlight bash %}
PS1='\[\033[01;32m\][\u@\h\[\033[00m\] \[\033[01;34m\]\w\[\033[01;32m\]]\$\[\033[00m\] '
{% endhighlight %}

---

## 12. Update Arch System

Re-run the `Install.sh` and follow this guide from top to bottom.  
**Note:** Disks will be wiped, so backup important data externally or via Git remote.
