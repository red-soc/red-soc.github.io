---
title: "TOC Test 7: No Headings (no TOC expected)"
categories: [Low-Level Basics, just me]
tags: [c]
---

I wrote a small C program to dump the structure and compared the output with a hex editor. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Windows the import address table is filled in by the loader before the program starts running. Every field is little-endian on x86, which matters when you read raw bytes from a file.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

The linker places each section at an aligned address, and the loader maps them into memory later. Unit tests with tiny hand-made binaries caught bugs that real programs hid. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

Unit tests with tiny hand-made binaries caught bugs that real programs hid. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The linker places each section at an aligned address, and the loader maps them into memory later.

The output looked right at first, but a second sample file exposed an off-by-one error. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

On Windows the import address table is filled in by the loader before the program starts running. The output looked right at first, but a second sample file exposed an off-by-one error. Unit tests with tiny hand-made binaries caught bugs that real programs hid. The linker places each section at an aligned address, and the loader maps them into memory later.

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The linker places each section at an aligned address, and the loader maps them into memory later.

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Windows the import address table is filled in by the loader before the program starts running. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

The linker places each section at an aligned address, and the loader maps them into memory later. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running.
