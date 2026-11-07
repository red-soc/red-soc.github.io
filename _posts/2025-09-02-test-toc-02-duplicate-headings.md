---
title: "TOC Test 2: Duplicate Heading Titles"
categories: [Low-Level Basics, just me]
tags: [loader, memory]
---

I wrote a small C program to dump the structure and compared the output with a hex editor. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

## ELF

### Overview

The linker places each section at an aligned address, and the loader maps them into memory later. Comparing two builds of the same source showed how much optimization flags change the layout. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

Comparing two builds of the same source showed how much optimization flags change the layout. I wrote a small C program to dump the structure and compared the output with a hex editor. The linker places each section at an aligned address, and the loader maps them into memory later. The output looked right at first, but a second sample file exposed an off-by-one error.

### Example

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The output looked right at first, but a second sample file exposed an off-by-one error.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

I wrote a small C program to dump the structure and compared the output with a hex editor. Comparing two builds of the same source showed how much optimization flags change the layout. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The linker places each section at an aligned address, and the loader maps them into memory later.

### Notes

Unit tests with tiny hand-made binaries caught bugs that real programs hid. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Comparing two builds of the same source showed how much optimization flags change the layout.

The output looked right at first, but a second sample file exposed an off-by-one error. On Windows the import address table is filled in by the loader before the program starts running.

## PE

### Overview

Comparing two builds of the same source showed how much optimization flags change the layout. The output looked right at first, but a second sample file exposed an off-by-one error. I wrote a small C program to dump the structure and compared the output with a hex editor.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Comparing two builds of the same source showed how much optimization flags change the layout. On Windows the import address table is filled in by the loader before the program starts running. The output looked right at first, but a second sample file exposed an off-by-one error. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### Example

Every field is little-endian on x86, which matters when you read raw bytes from a file. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The linker places each section at an aligned address, and the loader maps them into memory later.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

Reading the specification slowly saved me hours of guessing about reserved fields. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### Notes

The linker places each section at an aligned address, and the loader maps them into memory later. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. On Windows the import address table is filled in by the loader before the program starts running.

The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields.

## Mach-O

### Overview

Unit tests with tiny hand-made binaries caught bugs that real programs hid. Every field is little-endian on x86, which matters when you read raw bytes from a file. On Windows the import address table is filled in by the loader before the program starts running. Reading the specification slowly saved me hours of guessing about reserved fields.

The output looked right at first, but a second sample file exposed an off-by-one error. The linker places each section at an aligned address, and the loader maps them into memory later.

### Example

I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Unit tests with tiny hand-made binaries caught bugs that real programs hid. The output looked right at first, but a second sample file exposed an off-by-one error. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### Notes

Unit tests with tiny hand-made binaries caught bugs that real programs hid. The linker places each section at an aligned address, and the loader maps them into memory later. The output looked right at first, but a second sample file exposed an off-by-one error.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

The output looked right at first, but a second sample file exposed an off-by-one error. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Overview

Comparing two builds of the same source showed how much optimization flags change the layout. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. On Windows the import address table is filled in by the loader before the program starts running.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The linker places each section at an aligned address, and the loader maps them into memory later.

## Notes

On Windows the import address table is filled in by the loader before the program starts running. The output looked right at first, but a second sample file exposed an off-by-one error.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Every field is little-endian on x86, which matters when you read raw bytes from a file. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Windows the import address table is filled in by the loader before the program starts running.
