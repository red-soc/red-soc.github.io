---
title: "TOC Test 1: Long Post with Nested Sections"
categories: ["Linux & ELF", just me]
tags: [elf, linux, segments]
---

Unit tests with tiny hand-made binaries caught bugs that real programs hid. Every field is little-endian on x86, which matters when you read raw bytes from a file. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Introduction

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The linker places each section at an aligned address, and the loader maps them into memory later. Comparing two builds of the same source showed how much optimization flags change the layout. Reading the specification slowly saved me hours of guessing about reserved fields.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The linker places each section at an aligned address, and the loader maps them into memory later. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

The linker places each section at an aligned address, and the loader maps them into memory later. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The output looked right at first, but a second sample file exposed an off-by-one error.

## Reading the File Header

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The linker places each section at an aligned address, and the loader maps them into memory later.

Reading the specification slowly saved me hours of guessing about reserved fields. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

### Reading the File Header, part 1

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Every field is little-endian on x86, which matters when you read raw bytes from a file. Comparing two builds of the same source showed how much optimization flags change the layout.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

Reading the specification slowly saved me hours of guessing about reserved fields. Every field is little-endian on x86, which matters when you read raw bytes from a file. The linker places each section at an aligned address, and the loader maps them into memory later. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### Reading the File Header, part 2

The linker places each section at an aligned address, and the loader maps them into memory later. Comparing two builds of the same source showed how much optimization flags change the layout. The output looked right at first, but a second sample file exposed an off-by-one error.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Reading the specification slowly saved me hours of guessing about reserved fields. Comparing two builds of the same source showed how much optimization flags change the layout. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## Walking the Section Table

I wrote a small C program to dump the structure and compared the output with a hex editor. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The output looked right at first, but a second sample file exposed an off-by-one error.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

The output looked right at first, but a second sample file exposed an off-by-one error. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. On Windows the import address table is filled in by the loader before the program starts running.

### Walking the Section Table, part 1

The output looked right at first, but a second sample file exposed an off-by-one error. I wrote a small C program to dump the structure and compared the output with a hex editor. On Windows the import address table is filled in by the loader before the program starts running.

The linker places each section at an aligned address, and the loader maps them into memory later. Comparing two builds of the same source showed how much optimization flags change the layout.

### Walking the Section Table, part 2

Every field is little-endian on x86, which matters when you read raw bytes from a file. Unit tests with tiny hand-made binaries caught bugs that real programs hid. The output looked right at first, but a second sample file exposed an off-by-one error.

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. Reading the specification slowly saved me hours of guessing about reserved fields. The linker places each section at an aligned address, and the loader maps them into memory later.

### Walking the Section Table, part 3

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Unit tests with tiny hand-made binaries caught bugs that real programs hid. Reading the specification slowly saved me hours of guessing about reserved fields. The output looked right at first, but a second sample file exposed an off-by-one error.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

The linker places each section at an aligned address, and the loader maps them into memory later. On Windows the import address table is filled in by the loader before the program starts running.

## Symbols and Strings

The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields. The linker places each section at an aligned address, and the loader maps them into memory later.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Reading the specification slowly saved me hours of guessing about reserved fields. I wrote a small C program to dump the structure and compared the output with a hex editor. On Windows the import address table is filled in by the loader before the program starts running.

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Reading the specification slowly saved me hours of guessing about reserved fields. Unit tests with tiny hand-made binaries caught bugs that real programs hid. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

### Symbols and Strings, part 1

Every field is little-endian on x86, which matters when you read raw bytes from a file. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The linker places each section at an aligned address, and the loader maps them into memory later.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Every field is little-endian on x86, which matters when you read raw bytes from a file. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

### Symbols and Strings, part 2

I wrote a small C program to dump the structure and compared the output with a hex editor. The linker places each section at an aligned address, and the loader maps them into memory later. Every field is little-endian on x86, which matters when you read raw bytes from a file.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Comparing two builds of the same source showed how much optimization flags change the layout.

### Symbols and Strings, part 3

The output looked right at first, but a second sample file exposed an off-by-one error. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. Every field is little-endian on x86, which matters when you read raw bytes from a file. The linker places each section at an aligned address, and the loader maps them into memory later.

## Relocations

Every field is little-endian on x86, which matters when you read raw bytes from a file. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

I wrote a small C program to dump the structure and compared the output with a hex editor. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

On Windows the import address table is filled in by the loader before the program starts running. The output looked right at first, but a second sample file exposed an off-by-one error.

### Relocations, part 1

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Comparing two builds of the same source showed how much optimization flags change the layout.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

The output looked right at first, but a second sample file exposed an off-by-one error. Comparing two builds of the same source showed how much optimization flags change the layout.

### Relocations, part 2

Reading the specification slowly saved me hours of guessing about reserved fields. The output looked right at first, but a second sample file exposed an off-by-one error. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. I wrote a small C program to dump the structure and compared the output with a hex editor.

Comparing two builds of the same source showed how much optimization flags change the layout. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Reading the specification slowly saved me hours of guessing about reserved fields. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

## Dynamic Linking

The linker places each section at an aligned address, and the loader maps them into memory later. I wrote a small C program to dump the structure and compared the output with a hex editor. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file.

Unit tests with tiny hand-made binaries caught bugs that real programs hid. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

### Dynamic Linking, part 1

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The linker places each section at an aligned address, and the loader maps them into memory later.

### Dynamic Linking, part 2

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Unit tests with tiny hand-made binaries caught bugs that real programs hid. I wrote a small C program to dump the structure and compared the output with a hex editor.

## Loading and Mapping

The linker places each section at an aligned address, and the loader maps them into memory later. I wrote a small C program to dump the structure and compared the output with a hex editor.

I wrote a small C program to dump the structure and compared the output with a hex editor. The output looked right at first, but a second sample file exposed an off-by-one error. On Windows the import address table is filled in by the loader before the program starts running.

Every field is little-endian on x86, which matters when you read raw bytes from a file. The linker places each section at an aligned address, and the loader maps them into memory later.

### Loading and Mapping, part 1

On Windows the import address table is filled in by the loader before the program starts running. I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file. Comparing two builds of the same source showed how much optimization flags change the layout.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

The output looked right at first, but a second sample file exposed an off-by-one error. Comparing two builds of the same source showed how much optimization flags change the layout.

### Loading and Mapping, part 2

Comparing two builds of the same source showed how much optimization flags change the layout. On Windows the import address table is filled in by the loader before the program starts running.

The output looked right at first, but a second sample file exposed an off-by-one error. On Windows the import address table is filled in by the loader before the program starts running.

### Loading and Mapping, part 3

Unit tests with tiny hand-made binaries caught bugs that real programs hid. Every field is little-endian on x86, which matters when you read raw bytes from a file. The output looked right at first, but a second sample file exposed an off-by-one error. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields.

## Debug Information

The output looked right at first, but a second sample file exposed an off-by-one error. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. Reading the specification slowly saved me hours of guessing about reserved fields.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The output looked right at first, but a second sample file exposed an off-by-one error. On Windows the import address table is filled in by the loader before the program starts running. I wrote a small C program to dump the structure and compared the output with a hex editor.

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

### Debug Information, part 1

Unit tests with tiny hand-made binaries caught bugs that real programs hid. The output looked right at first, but a second sample file exposed an off-by-one error. The linker places each section at an aligned address, and the loader maps them into memory later. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### Debug Information, part 2

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The output looked right at first, but a second sample file exposed an off-by-one error. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

The linker places each section at an aligned address, and the loader maps them into memory later. Reading the specification slowly saved me hours of guessing about reserved fields. The output looked right at first, but a second sample file exposed an off-by-one error. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

### Debug Information, part 3

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

The linker places each section at an aligned address, and the loader maps them into memory later. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. I wrote a small C program to dump the structure and compared the output with a hex editor.

## Putting It Together

The output looked right at first, but a second sample file exposed an off-by-one error. The linker places each section at an aligned address, and the loader maps them into memory later. Every field is little-endian on x86, which matters when you read raw bytes from a file.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Every field is little-endian on x86, which matters when you read raw bytes from a file. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

Reading the specification slowly saved me hours of guessing about reserved fields. Every field is little-endian on x86, which matters when you read raw bytes from a file. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

### Putting It Together, part 1

Unit tests with tiny hand-made binaries caught bugs that real programs hid. Every field is little-endian on x86, which matters when you read raw bytes from a file. Comparing two builds of the same source showed how much optimization flags change the layout. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

Reading the specification slowly saved me hours of guessing about reserved fields. The linker places each section at an aligned address, and the loader maps them into memory later. Comparing two builds of the same source showed how much optimization flags change the layout. Every field is little-endian on x86, which matters when you read raw bytes from a file.

### Putting It Together, part 2

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The output looked right at first, but a second sample file exposed an off-by-one error. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Windows the import address table is filled in by the loader before the program starts running.

### Putting It Together, part 3

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Every field is little-endian on x86, which matters when you read raw bytes from a file. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Comparing two builds of the same source showed how much optimization flags change the layout. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Reading the specification slowly saved me hours of guessing about reserved fields.

## Conclusion

Comparing two builds of the same source showed how much optimization flags change the layout. Every field is little-endian on x86, which matters when you read raw bytes from a file.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

Every field is little-endian on x86, which matters when you read raw bytes from a file. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

Every field is little-endian on x86, which matters when you read raw bytes from a file. The output looked right at first, but a second sample file exposed an off-by-one error.
