---
layout: page
title: Tags
permalink: /tags/
---

{% if site.tags.size == 0 %}
  <p class="empty-note">
    No tags yet. Add a <code>tags</code> list to a post's front matter and it will appear here automatically, for example:
    <br><br>
    <code>tags: [hypervisor, windows, kernel]</code>
  </p>
{% else %}
  <div class="tags-cloud">
    {% assign sorted_tags = site.tags | sort %}
    {% for tag in sorted_tags %}
      {% assign tag_slug = tag[0] | slugify %}
      <a class="tag-box" href="{{ '/tags/' | append: tag_slug | append: '/' | relative_url }}">
        {{ tag[0] }}<span class="tag-count">{{ tag[1].size }}</span>
      </a>
    {% endfor %}
  </div>
{% endif %}
