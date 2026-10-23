---
layout: page
title: Projects
permalink: /projects/
---

{%- comment -%}
  Cards come from _data/projects.json - add, edit, reorder and delete projects with
      python tools/_Apps/Site_Manager/Site_Manager.py   (Projects tab)
  The page look (columns, image height, default picture, date position, alignment ...) is set in
      python tools/_Apps/Site_Conf/Site_Conf.py   (Projects section)  and saved in _config.yml > appearance > projects.
  Editing this file by hand is not needed.
{%- endcomment -%}
{%- assign ps = site.data.projects.settings -%}
{%- assign ap = site.appearance.projects -%}
{%- assign cols = ap.columns | default: ps.columns | default: "auto" -%}
{%- assign img_h = ap.image_height | default: ps.image_height | default: 170 -%}
{%- assign img_fit = ap.image_fit | default: ps.image_fit | default: "cover" -%}
{%- assign show_images = true -%}{%- if ap.show_images == false -%}{%- assign show_images = false -%}{%- elsif ap.show_images == nil and ps.show_images == false -%}{%- assign show_images = false -%}{%- endif -%}
{%- assign show_status = true -%}{%- if ap.show_status == false -%}{%- assign show_status = false -%}{%- elsif ap.show_status == nil and ps.show_status == false -%}{%- assign show_status = false -%}{%- endif -%}
{%- assign show_tags = true -%}{%- if ap.show_tags == false -%}{%- assign show_tags = false -%}{%- elsif ap.show_tags == nil and ps.show_tags == false -%}{%- assign show_tags = false -%}{%- endif -%}
{%- assign show_date = true -%}{%- if ap.show_date == false -%}{%- assign show_date = false -%}{%- elsif ap.show_date == nil and ps.show_date == false -%}{%- assign show_date = false -%}{%- endif -%}
{%- assign default_art = true -%}{%- if ap.default_art == false -%}{%- assign default_art = false -%}{%- endif -%}
{%- if ps.intro and ps.intro != "" -%}
<p class="project-intro">{{ ps.intro | escape }}</p>
{%- endif -%}
<div class="project-grid cols-{{ cols }}" style="--proj-img-h: {{ img_h }}px; --proj-img-fit: {{ img_fit }};">
{%- assign any_img = false -%}
{%- for p in site.data.projects.items -%}{%- unless p.hidden -%}{%- if p.image and p.image != "" -%}{%- assign any_img = true -%}{%- endif -%}{%- endunless -%}{%- endfor -%}
{%- for p in site.data.projects.items -%}
{%- unless p.hidden -%}
{%- assign art_style = p.art_style | default: "" -%}
{%- assign art_bg = p.art_bg | default: "" -%}
{%- assign art_fit = p.art_fit | default: "" -%}
{%- assign art_deco = p.art_deco | default: "" -%}
{%- assign art_draw = p.art_draw | default: "" -%}
{%- assign art_label = p.art_label | default: "" -%}
{%- assign draw_here = default_art -%}{%- if art_draw == "on" -%}{%- assign draw_here = true -%}{%- elsif art_draw == "off" -%}{%- assign draw_here = false -%}{%- endif -%}
<div class="project-card{% if p.highlight or p.highlight == nil and p.featured %} is-featured{% endif %}" data-idx="{{ forloop.index0 | modulo: 5 }}"{% if art_style != "" %} data-art="{{ art_style | escape }}"{% endif %}{% if art_bg != "" %} data-artbg="{{ art_bg | escape }}"{% endif %}{% if art_deco != "" %} data-artdeco="{{ art_deco | escape }}"{% endif %}{% if art_draw != "" %} data-artdraw="{{ art_draw | escape }}"{% endif %}{% if art_label != "" %} data-artlabel="{{ art_label | escape }}"{% endif %}{% if p.art_color and p.art_color != "" %} data-artown="1"{% endif %}{% assign card_style = "" %}{% if p.art_color and p.art_color != "" %}{% capture card_style %}--art-c: {{ p.art_color | escape }};{% endcapture %}{% endif %}{% if art_fit == "cover" or art_fit == "contain" %}{% capture card_style %}{{ card_style }}--proj-img-fit: {{ art_fit }};{% endcapture %}{% endif %}{% if card_style != "" %} style="{{ card_style }}"{% endif %}>
{%- if show_images and p.image and p.image != "" -%}
{%- assign c0 = p.image | slice: 0 -%}
<div class="project-thumb"><img src="{% if c0 == '/' %}{{ p.image | relative_url }}{% else %}{{ p.image }}{% endif %}" alt="{{ p.image_alt | default: p.title | escape }}" loading="lazy"{% if p.image_pos != "" or p.image_zoom and p.image_zoom != "" %} style="{% if p.image_pos and p.image_pos != "" %}object-position: {{ p.image_pos | escape }};{% endif %}{% if p.image_zoom and p.image_zoom != "" %}transform: scale({{ p.image_zoom | escape }}); transform-origin: {{ p.image_pos | default: "50% 50%" | escape }};{% endif %}"{% endif %}></div>
{%- elsif show_images and art_draw == "" and ap.default_image and ap.default_image != "" -%}
{%- assign d0 = ap.default_image | slice: 0 -%}
<div class="project-thumb"><img src="{% if d0 == '/' %}{{ ap.default_image | relative_url }}{% else %}{{ ap.default_image }}{% endif %}" alt="{{ p.title | escape }}" loading="lazy"></div>
{%- elsif show_images and draw_here -%}
{%- assign art_text = p.art_text | default: ap.art_default_text | default: p.title -%}
{%- assign art_sub = p.art_subtitle | default: ap.art_default_sub -%}
<div class="project-thumb is-art">{% include project-art.html text=art_text sub=art_sub alt=p.title %}</div>
{%- elsif show_images and any_img -%}
<div class="project-thumb is-empty" aria-hidden="true"></div>
{%- else -%}
<div class="project-thumb is-none" aria-hidden="true"></div>
{%- endif -%}
<h3>{{ p.title | escape }}</h3>
<div class="project-meta">
{%- if p.featured -%}<span class="project-status status-featured">Featured</span>{%- endif -%}
{%- if p.status and p.status != "" and show_status -%}<span class="project-status status-{{ p.status | slugify }}">{{ p.status | escape }}</span>{%- endif -%}
{%- if p.date and p.date != "" and show_date -%}<span class="project-date">{{ p.date | escape }}</span>{%- endif -%}
</div>
<div class="project-desc">{{ p.description | markdownify }}
{%- if p.note and p.note != "" -%}
<p class="project-note">{{ p.note | escape }}</p>
{%- endif -%}
</div>
<div class="project-tags">
{%- if p.tags.size > 0 and show_tags -%}{% for t in p.tags %}<span>{{ t | escape }}</span>{% endfor %}{%- endif -%}
</div>
<div class="project-links">
{%- if p.links.size > 0 -%}
{%- for l in p.links -%}
{%- assign u0 = l.url | slice: 0 -%}
<a class="project-link" href="{% if u0 == '/' %}{{ l.url | relative_url }}{% else %}{{ l.url }}{% endif %}"{% if l.new_tab %} target="_blank" rel="noopener noreferrer"{% endif %}>{{ l.label | escape }} &rarr;</a>
{%- endfor -%}
{%- endif -%}
</div>
</div>
{%- endunless -%}
{%- endfor -%}
</div>
