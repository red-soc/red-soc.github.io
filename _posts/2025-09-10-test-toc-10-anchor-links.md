---
title: "TOC Test 10: In-Page Anchor Links"
categories: [Windows Internals, just me]
tags: [exports, iat]
---

Unit tests with tiny hand-made binaries caught bugs that real programs hid. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

Jump to [the final section](#final-section) or [the middle one](#middle-section) to test anchors.

## First Section

<figure class="img" style="margin:1.75em auto;text-align:center;display:block;width:100%;max-width:100%;box-sizing:border-box">
<img src="{{ '/assets/media/city_sunset.png' | relative_url }}" alt="image" style="display:block;margin:0 auto;max-width:100%;border-radius:8px">
</figure>


Comparing two builds of the same source showed how much optimization flags change the layout. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The linker places each section at an aligned address, and the loader maps them into memory later.

The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. I wrote a small C program to dump the structure and compared the output with a hex editor. Comparing two builds of the same source showed how much optimization flags change the layout. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.
DDQSQDDQDQ
## Middle Section

Every field is little-endian on x86, which matters when you read raw bytes from a file. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. The linker places each section at an aligned address, and the loader maps them into memory later.

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The linker places each section at an aligned address, and the loader maps them into memory later. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

A common mistake is trusting offsets from the file without checking that they stay inside the buffer. I wrote a small C program to dump the structure and compared the output with a hex editor.

### Middle Child A

I wrote a small C program to dump the structure and compared the output with a hex editor. Every field is little-endian on x86, which matters when you read raw bytes from a file. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. Reading the specification slowly saved me hours of guessing about reserved fields.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Comparing two builds of the same source showed how much optimization flags change the layout. Reading the specification slowly saved me hours of guessing about reserved fields. The linker places each section at an aligned address, and the loader maps them into memory later. On Windows the import address table is filled in by the loader before the program starts running.

### Middle Child B

On Windows the import address table is filled in by the loader before the program starts running. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The output looked right at first, but a second sample file exposed an off-by-one error.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

I wrote a small C program to dump the structure and compared the output with a hex editor. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table.

## Filler

On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The output looked right at first, but a second sample file exposed an off-by-one error.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

The linker places each section at an aligned address, and the loader maps them into memory later. A common mistake is trusting offsets from the file without checking that they stay inside the buffer. On Windows the import address table is filled in by the loader before the program starts running.

Comparing two builds of the same source showed how much optimization flags change the layout. The output looked right at first, but a second sample file exposed an off-by-one error.

Reading the specification slowly saved me hours of guessing about reserved fields. The linker places each section at an aligned address, and the loader maps them into memory later.

I wrote a small C program to dump the structure and compared the output with a hex editor. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. The linker places each section at an aligned address, and the loader maps them into memory later. Reading the specification slowly saved me hours of guessing about reserved fields.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

Unit tests with tiny hand-made binaries caught bugs that real programs hid. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first. On Windows the import address table is filled in by the loader before the program starts running.

The linker places each section at an aligned address, and the loader maps them into memory later. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. The output looked right at first, but a second sample file exposed an off-by-one error.

The linker places each section at an aligned address, and the loader maps them into memory later. Unit tests with tiny hand-made binaries caught bugs that real programs hid.

```bash
# this comment starts with a hash and must NOT become a heading
readelf -S ./app | head -20
```

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. On Windows the import address table is filled in by the loader before the program starts running. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

Reading the specification slowly saved me hours of guessing about reserved fields. The relocation table lists every place the loader must patch when the image is not mapped at its preferred base.

The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Unit tests with tiny hand-made binaries caught bugs that real programs hid. On Linux the dynamic loader resolves shared library functions lazily through the procedure linkage table. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

## Final Section

Unit tests with tiny hand-made binaries caught bugs that real programs hid. Every field is little-endian on x86, which matters when you read raw bytes from a file. The header begins at a fixed offset, so the parser reads a few bytes and validates the magic value first.

```python
## also not a heading, it lives inside a fenced block
print(hex(0x5A4D))
```

**The relocation table lists every place the loader must patch when the image is not mapped at its preferred base. Reading the specification slowly saved me hours of guessing about reserved fields.**
