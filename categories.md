---
layout: page
title: Categories
permalink: /categories/
---

{% if site.categories.size == 0 %}
  <p class="empty-note">
    No categories yet. Add a <code>categories</code> list to a post's front matter and it will appear here automatically, for example:
    <br><br>
    <code>categories: [Windows Internals, Anti-Cheat]</code>
  </p>
{% else %}
  <div class="cat-card">
    {% assign sorted_cats = site.categories | sort %}
    {% for category in sorted_cats %}
      {% assign cat_name = category | first %}
      {% assign cat_posts = category | last %}
      {% assign first_post = cat_posts | first %}
      {% comment %} only top-level categories (first entry of a post's categories list) {% endcomment %}
      {% if cat_name == first_post.categories[0] %}
        {% assign subs = '' | split: '' %}
        {% for post in cat_posts %}
          {% assign second = post.categories[1] %}
          {% if second %}{% assign subs = subs | push: second %}{% endif %}
        {% endfor %}
        {% assign subs = subs | uniq | sort %}
        {% assign subs_size = subs | size %}
        {% assign cat_slug = cat_name | slugify %}
        {% assign cat_url = '/categories/' | append: cat_slug | append: '/' | relative_url %}
        {% capture count_text %}{% if subs_size > 0 %}{{ subs_size }} categor{% if subs_size > 1 %}ies{% else %}y{% endif %}, {% endif %}{{ cat_posts | size }} post{% if cat_posts.size > 1 %}s{% endif %}{% endcapture %}

        {% if subs_size > 0 %}
          <details class="cat-group" open>
            <summary class="cat-row">
              <svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2.2 2.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
              <a class="cat-name" href="{{ cat_url }}">{{ cat_name }}</a>
              <span class="cat-count">{{ count_text }}</span>
              <svg class="cat-chevron" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </summary>
            <ul class="cat-sub">
              {% for sub in subs %}
                {% assign sub_count = 0 %}
                {% for post in cat_posts %}{% if post.categories[1] == sub %}{% assign sub_count = sub_count | plus: 1 %}{% endif %}{% endfor %}
                {% assign sub_slug = sub | slugify %}
                <li>
                  <svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2.2 2.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
                  <a class="cat-name" href="{{ '/categories/' | append: sub_slug | append: '/' | relative_url }}">{{ sub }}</a>
                  <span class="cat-count">{{ sub_count }} post{% if sub_count > 1 %}s{% endif %}</span>
                </li>
              {% endfor %}
            </ul>
          </details>
        {% else %}
          <div class="cat-group">
            <div class="cat-row">
              <svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2.2 2.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
              <a class="cat-name" href="{{ cat_url }}">{{ cat_name }}</a>
              <span class="cat-count">{{ count_text }}</span>
            </div>
          </div>
        {% endif %}
      {% endif %}
    {% endfor %}
  </div>
{% endif %}
