---
title: "TOC Test 9: Short Sections and a Tiny Last Section"
categories: ["macOS & Mach-O", just me]
tags: [macos, mach-o]
---

The output looked right at first, but a second sample file exposed an off-by-one error.

## Short section 1

<figure class="video" style="margin:1.75em auto;text-align:center;display:block;width:100%;max-width:100%;box-sizing:border-box">
<video controls preload="metadata" style="width:100%;max-width:100%;border-radius:8px;display:block;margin:0 auto">
<source src="{{ '/assets/media/red.mp4' | relative_url }}">
</video>
</figure>


Every field is little-endian on x86, which matters when you read raw bytes from a file.

## Short section 2

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

## Short section 3

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Short section 4

Unit tests with tiny hand-made binaries caught bugs that real programs hid.

## Short section 5

Unit tests with tiny hand-made binaries caught bugs that real programs hid.

## Short section 6

I wrote a small C program to dump the structure and compared the output with a hex editor.

## Very last section (page ends before this reaches the top)

Tiny.
