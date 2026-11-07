---
title: "TOC Test 5: Exactly Two Headings (minimum for a TOC)"
categories: [Low-Level Basics, just me]
tags: [hex, endianness]
---

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. I wrote a small C program to dump the structure and compared the output with a hex editor. On Windows the import address table is filled in by the loader before the program starts running.

## First heading

The linker places each section at an aligned address, and the loader maps them into memory later. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. I wrote a small C program to dump the structure and compared the output with a hex editor. On Windows the import address table is filled in by the loader before the program starts running.

I wrote a small C program to dump the structure and compared the output with a hex editor. The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields.

Comparing two builds of the same source showed how much optimization flags change the layout. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Second heading

The linker places each section at an aligned address, and the loader maps them into memory later. I wrote a small C program to dump the structure and compared the output with a hex editor. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

I wrote a small C program to dump the structure and compared the output with a hex editor. On Windows the import address table is filled in by the loader before the program starts running. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

The linker places each section at an aligned address, and the loader maps them into memory later. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.
