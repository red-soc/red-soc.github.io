---
title: "TOC Test 3: Special Characters and Long Titles"
categories: [Tooling, just me]
tags: [tools, gcc, dwarf]
---

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Every field is little-endian on x86, which matters when you read raw bytes from a file.

## What is `e_shoff` and why does it matter?

Comparing two builds of the same source showed how much optimization flags change the layout. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. I wrote a small C program to dump the structure and compared the output with a hex editor. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

```c
uint32_t off = hdr->e_shoff;
if (off > size) return -1;
```

Every field is little-endian on x86, which matters when you read raw bytes from a file. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The linker places each section at an aligned address, and the loader maps them into memory later. On Windows the import address table is filled in by the loader before the program starts running.

## Tools & Techniques: gcc, clang (and MSVC)

Reading the specification slowly saved me hours of guessing about reserved fields. The linker places each section at an aligned address, and the loader maps them into memory later.

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

### C/C++ names: `std::vector<int>` vs. arrays

On Windows the import address table is filled in by the loader before the program starts running. The linker places each section at an aligned address, and the loader maps them into memory later.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Windows the import address table is filled in by the loader before the program starts running. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Every field is little-endian on x86, which matters when you read raw bytes from a file.

### 50% faster? Maybe - it's "complicated"

Comparing two builds of the same source showed how much optimization flags change the layout. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

On Windows the import address table is filled in by the loader before the program starts running. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

## Unicode check: naïve résumé, 日本語, Ελληνικά

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. On Windows the import address table is filled in by the loader before the program starts running.

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. On Windows the import address table is filled in by the loader before the program starts running. I wrote a small C program to dump the structure and compared the output with a hex editor. Comparing two builds of the same source showed how much optimization flags change the layout.

## Emoji heading 🚀 and symbols # @ $ ^

Every field is little-endian on x86, which matters when you read raw bytes from a file. On Windows the import address table is filled in by the loader before the program starts running. Unit tests with tiny hand-made binaries caught bugs that real programs hid. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The output looked right at first, but a second sample file exposed an off-by-one error.

## A very long heading that goes on and on to check how the contents panel truncates, wraps, or overflows when a title is far too long for the sidebar width

Comparing two builds of the same source showed how much optimization flags change the layout. The output looked right at first, but a second sample file exposed an off-by-one error. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. Reading the specification slowly saved me hours of guessing about reserved fields.

```makefile
all: app
app: main.o
	gcc -o app main.o
```

Reading the specification slowly saved me hours of guessing about reserved fields. The output looked right at first, but a second sample file exposed an off-by-one error.

### Custom id heading {#my-custom-id}

Reading the specification slowly saved me hours of guessing about reserved fields. I wrote a small C program to dump the structure and compared the output with a hex editor. Comparing two builds of the same source showed how much optimization flags change the layout.

Comparing two builds of the same source showed how much optimization flags change the layout. On Windows the import address table is filled in by the loader before the program starts running. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

##    Heading with    irregular     spacing   

Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

The output looked right at first, but a second sample file exposed an off-by-one error. Reading the specification slowly saved me hours of guessing about reserved fields. Every field is little-endian on x86, which matters when you read raw bytes from a file. A common mistake is trusting offsets from the file without checking that they stay inside the buffer.

## 123 Numeric start

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. Every field is little-endian on x86, which matters when you read raw bytes from a file. The output looked right at first, but a second sample file exposed an off-by-one error.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

Every field is little-endian on x86, which matters when you read raw bytes from a file. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The linker places each section at an aligned address, and the loader maps them into memory later.

## Trailing punctuation...

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. Comparing two builds of the same source showed how much optimization flags change the layout. On Windows the import address table is filled in by the loader before the program starts running. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file.
