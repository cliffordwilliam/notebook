---
layout: post
title:  "Setting up stuff!"
date:   2025-08-24 11:37:18 -0500
categories: jekyll update
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

