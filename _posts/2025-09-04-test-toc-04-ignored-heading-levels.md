---
title: "TOC Test 4: Heading Levels the TOC Should Ignore"
categories: [Debugging, just me]
tags: [dwarf, debug-symbols]
---

Every field is little-endian on x86, which matters when you read raw bytes from a file. On Windows the import address table is filled in by the loader before the program starts running.

### A level-3 heading before any level-2 heading

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running.

# A level-1 heading inside the body (should NOT be listed)

Unit tests with tiny hand-made binaries caught bugs that real programs hid. Every field is little-endian on x86, which matters when you read raw bytes from a file.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

## Section 1

I wrote a small C program to dump the structure and compared the output with a hex editor. On Windows the import address table is filled in by the loader before the program starts running.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Comparing two builds of the same source showed how much optimization flags change the layout. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

### Subsection 1.1

On Windows the import address table is filled in by the loader before the program starts running. The linker places each section at an aligned address, and the loader maps them into memory later.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running. Reading the specification slowly saved me hours of guessing about reserved fields.

#### Level 4 under 1.1 (not listed)

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The linker places each section at an aligned address, and the loader maps them into memory later. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Comparing two builds of the same source showed how much optimization flags change the layout.

##### Level 5 (not listed)

Reading the specification slowly saved me hours of guessing about reserved fields. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

## Section 2

I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file. On Windows the import address table is filled in by the loader before the program starts running. Reading the specification slowly saved me hours of guessing about reserved fields.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

The output looked right at first, but a second sample file exposed an off-by-one error. Comparing two builds of the same source showed how much optimization flags change the layout. Every field is little-endian on x86, which matters when you read raw bytes from a file. Reading the specification slowly saved me hours of guessing about reserved fields.

### Subsection 2.1

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The output looked right at first, but a second sample file exposed an off-by-one error. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

Reading the specification slowly saved me hours of guessing about reserved fields. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

#### Level 4 under 2.1 (not listed)

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. I wrote a small C program to dump the structure and compared the output with a hex editor.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

##### Level 5 (not listed)

Comparing two builds of the same source showed how much optimization flags change the layout. Reading the specification slowly saved me hours of guessing about reserved fields. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. I wrote a small C program to dump the structure and compared the output with a hex editor.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

## Section 3

The output looked right at first, but a second sample file exposed an off-by-one error. Comparing two builds of the same source showed how much optimization flags change the layout.

Reading the specification slowly saved me hours of guessing about reserved fields. Comparing two builds of the same source showed how much optimization flags change the layout.

### Subsection 3.1

The output looked right at first, but a second sample file exposed an off-by-one error. I wrote a small C program to dump the structure and compared the output with a hex editor.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields.

#### Level 4 under 3.1 (not listed)

Reading the specification slowly saved me hours of guessing about reserved fields. I wrote a small C program to dump the structure and compared the output with a hex editor. The output looked right at first, but a second sample file exposed an off-by-one error. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

##### Level 5 (not listed)

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Reading the specification slowly saved me hours of guessing about reserved fields.

## Headings inside code and quotes

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

> ## A heading inside a blockquote (this WILL be listed: the script takes every h2 and h3)
> 
> Quoted text.

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Every field is little-endian on x86, which matters when you read raw bytes from a file.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Every field is little-endian on x86, which matters when you read raw bytes from a file. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. I wrote a small C program to dump the structure and compared the output with a hex editor.
