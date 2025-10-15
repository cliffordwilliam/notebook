---
layout: post
title:  "Studying Vim Motions"
date:   2025-08-24 11:37:18 -0500
categories: jekyll update
---

The first thing to understand is that you can enter insert mode in many different ways
You can press `i`, that puts you in insert mode before the cursor.
You can press `a`, that puts you after
You can press `A`, that puts you at end of line
You can press `I`, that puts you at start of line

Notice how its just `i` and `a` and both have capital variants.

To navigate faster, you can use `w` and `b`.
`w` goes forward 1 word
`b` goes back 1 word
`e` same like `w` but you end up at end of word, not start
`$` to jump to end of line
`0` to jump to start of line
`^` to jump to start of line that is not empty text

here try it out
    this is an indented text, use `0` and `^` to see the differences.

there is a mini teleport feature that works in 1 line scope only
you can press `f` and then the target you want to go to

cycle target by pressing `;` or `,` keys
`;` takes you forwards
`,` takes you backwards

here try it in the following text

this is a exclamation amrk !, here is another one !, one more !

Notice how by default `f` alone teleports you forward, capital teleports you back!

Finally, understand that these commands can take number argument
so say you wanna move 3 to the right?
`3l`
so the pattern is number first, then action you want to do
say you want to find `!` but the 2nd occurence? `2f!`

The way to learn is to just work like in VSCode but as I work when I wanna do something I have to think what is the fast vim way to do it?

With that said this is the end of the vim motion note ever, there is no point in taking down notes, just do and find my own way to write fast.

Maybe watch others on youtube who works in Vim and see how they use it and steal that.

Think about it, you know Python, JS, Java, TS, but do you ever take note?? No right? You just keep building and it just gets stuck in your head.

