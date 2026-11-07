---
title: "TOC Test 8: Forty Sections (panel scrolling)"
categories: [Windows Internals, just me]
tags: [pe, windows, dll]
---

Reading the specification slowly saved me hours of guessing about reserved fields. Every field is little-endian on x86, which matters when you read raw bytes from a file.

## Step 1: Relocate exports

Comparing two builds of the same source showed how much optimization flags change the layout. Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Step 2: Patch strings

Reading the specification slowly saved me hours of guessing about reserved fields. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Step 3: Relocate sections

The output looked right at first, but a second sample file exposed an off-by-one error. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Step 4: Compare segments

On Windows the import address table is filled in by the loader before the program starts running. I wrote a small C program to dump the structure and compared the output with a hex editor. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. Comparing two builds of the same source showed how much optimization flags change the layout.

### Detail for step 4

Every field is little-endian on x86, which matters when you read raw bytes from a file. I wrote a small C program to dump the structure and compared the output with a hex editor.

## Step 5: Dump symbols

On Windows the import address table is filled in by the loader before the program starts running. The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

## Step 6: Resolve pointers

Reading the specification slowly saved me hours of guessing about reserved fields. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The linker places each section at an aligned address, and the loader maps them into memory later. Every field is little-endian on x86, which matters when you read raw bytes from a file.

## Step 7: Map sections

Comparing two builds of the same source showed how much optimization flags change the layout. I wrote a small C program to dump the structure and compared the output with a hex editor.

## Step 8: Relocate pointers

I wrote a small C program to dump the structure and compared the output with a hex editor. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Every field is little-endian on x86, which matters when you read raw bytes from a file.

### Detail for step 8

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The output looked right at first, but a second sample file exposed an off-by-one error. The linker places each section at an aligned address, and the loader maps them into memory later. Every field is little-endian on x86, which matters when you read raw bytes from a file.

## Step 9: Patch sections

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Windows the import address table is filled in by the loader before the program starts running.

## Step 10: Relocate headers

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields. Comparing two builds of the same source showed how much optimization flags change the layout.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

## Step 11: Patch headers

On Windows the import address table is filled in by the loader before the program starts running. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

## Step 12: Map imports

On Windows the import address table is filled in by the loader before the program starts running. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### Detail for step 12

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Reading the specification slowly saved me hours of guessing about reserved fields. I wrote a small C program to dump the structure and compared the output with a hex editor.

## Step 13: Dump exports

Every field is little-endian on x86, which matters when you read raw bytes from a file. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

## Step 14: Dump pointers

I wrote a small C program to dump the structure and compared the output with a hex editor. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The linker places each section at an aligned address, and the loader maps them into memory later. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Step 15: Compare pointers

The linker places each section at an aligned address, and the loader maps them into memory later. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

## Step 16: Compare sections

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The output looked right at first, but a second sample file exposed an off-by-one error. Every field is little-endian on x86, which matters when you read raw bytes from a file. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### Detail for step 16

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. Reading the specification slowly saved me hours of guessing about reserved fields. On Windows the import address table is filled in by the loader before the program starts running. Every field is little-endian on x86, which matters when you read raw bytes from a file.

## Step 17: Resolve strings

The linker places each section at an aligned address, and the loader maps them into memory later. The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields. On Windows the import address table is filled in by the loader before the program starts running.

## Step 18: Relocate strings

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

## Step 19: Parse exports

On Windows the import address table is filled in by the loader before the program starts running. Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Step 20: Compare imports

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Windows the import address table is filled in by the loader before the program starts running.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

### Detail for step 20

Reading the specification slowly saved me hours of guessing about reserved fields. The output looked right at first, but a second sample file exposed an off-by-one error. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Step 21: Validate exports

Reading the specification slowly saved me hours of guessing about reserved fields. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Step 22: Patch imports

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. Unit tests with tiny hand-made binaries caught bugs that real programs hid. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Step 23: Patch strings

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running.

## Step 24: Validate imports

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. On Windows the import address table is filled in by the loader before the program starts running. The output looked right at first, but a second sample file exposed an off-by-one error.

### Detail for step 24

I wrote a small C program to dump the structure and compared the output with a hex editor. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Step 25: Resolve exports

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. I wrote a small C program to dump the structure and compared the output with a hex editor.

## Step 26: Relocate pointers

Reading the specification slowly saved me hours of guessing about reserved fields. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

## Step 27: Map strings

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

## Step 28: Map strings

The output looked right at first, but a second sample file exposed an off-by-one error. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

### Detail for step 28

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. I wrote a small C program to dump the structure and compared the output with a hex editor.

## Step 29: Patch sections

Every field is little-endian on x86, which matters when you read raw bytes from a file. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

## Step 30: Relocate segments

Comparing two builds of the same source showed how much optimization flags change the layout. I wrote a small C program to dump the structure and compared the output with a hex editor. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running.

## Step 31: Dump symbols

I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file. The linker places each section at an aligned address, and the loader maps them into memory later.

## Step 32: Parse sections

The linker places each section at an aligned address, and the loader maps them into memory later. Unit tests with tiny hand-made binaries caught bugs that real programs hid. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

### Detail for step 32

Comparing two builds of the same source showed how much optimization flags change the layout. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Step 33: Dump symbols

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The linker places each section at an aligned address, and the loader maps them into memory later. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

## Step 34: Compare imports

Comparing two builds of the same source showed how much optimization flags change the layout. I wrote a small C program to dump the structure and compared the output with a hex editor. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Step 35: Patch symbols

I wrote a small C program to dump the structure and compared the output with a hex editor. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Step 36: Dump headers

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. I wrote a small C program to dump the structure and compared the output with a hex editor. The linker places each section at an aligned address, and the loader maps them into memory later.

### Detail for step 36

On Windows the import address table is filled in by the loader before the program starts running. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Step 37: Validate symbols

On Windows the import address table is filled in by the loader before the program starts running. Unit tests with tiny hand-made binaries caught bugs that real programs hid. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

## Step 38: Parse exports

The output looked right at first, but a second sample file exposed an off-by-one error. Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Windows the import address table is filled in by the loader before the program starts running. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

## Step 39: Parse sections

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The linker places each section at an aligned address, and the loader maps them into memory later.

## Step 40: Compare pointers

On Windows the import address table is filled in by the loader before the program starts running. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. I wrote a small C program to dump the structure and compared the output with a hex editor.

```makefile
all: app
app: main.o   
	gcc -o app main.o
```

### Detail for step 40

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running.
