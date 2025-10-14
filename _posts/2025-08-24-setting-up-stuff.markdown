---
layout: post
title:  "Setting up stuff!"
date:   2025-08-24 11:37:18 -0500
categories: jekyll update
---

You want to increase the font size both in the st and the dwm. But doing this causes weird gaps, you can fix this by setting this in the dwm config
{% highlight lua %}
static const int resizehints = 0;    /* 1 means respect size hints in tiled resizals */
{% endhighlight %}

---

Optional but you can change the color of the background for st terminal
Make sure to go out of dwm first, then edit the file there,
set the color to #001a33, make clean, make, cp the st bin to local bin, then startx again.

---

This is how you set up stuff right after setting up your `Neovim` `init.lua`. The first thing you need is the `xclip`, this is so that when you yank, you use the system clipboard:

{% highlight bash %}
sudo pacman -S xclip
{% endhighlight %}

Then add the following anywhere inside your `init.lua`.
{% highlight lua %}
vim.opt.clipboard = "unnamedplus"
{% endhighlight %}

Now, whenever you yank, you use the system clipboard.

---

Run this so that now git uses nvim as default editor not vim
{% highlight lua %}
git config --global core.editor "nvim"
{% endhighlight %}


---

Github needs ssh key, you need a mean to generate one in `Arch`, this is what you need:
{% highlight lua %}
sudo pacman -S openssh
{% endhighlight %}

---

To get docker running on each boot do the following
{% highlight lua %}
sudo pacman -S docker
sudo pacman -S docker-compose
sudo systemctl enable docker.service
sudo systemctl start docker.service
sudo usermod -aG docker $USER
newgrp docker
{% endhighlight %}

---

Setting up background is easy just get this

{% highlight bash %}
sudo pacman -S feh
{% endhighlight %}

Then call it in xinitrc so that it runs on boot to fill the bg
{% highlight text %}
feh --bg-fill ~/Downloads/bg.jpg &
picom &
slstatus &
exec dwm
{% endhighlight %}

Notice that picom is there too, that calls picom on boot as well

I use picom to add transparency to the st terminal this way
{% highlight bash %}
sudo pacman -S picom
picom --config ~/.config/picom/picom.conf &
{% endhighlight %}

Edit the config like so
{% highlight text %}
backend = "xrender";
fading = true
fade-delta = 4
opacity-rule = [
  "95:class_g = 'st-256color'",
];
{% endhighlight %}

