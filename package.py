#!/usr/bin/python
import re
css_tag_regex = "<link[ \n\r]+type=[\"\']text/css[\"\'][ \n\r]+rel=[\"\']stylesheet[\"\'][ \n\r]+href=[\"\']tool\.css[\"\'][ \n\r]*/>"
js_tag_regex = "<script[ \n\r]+src=[\"\']tool\.js[\"\'][ \n\r]*></script>"
html_input = open("src/tool.html", "r", 1)
html_string = html_input.read()
html_input.close()
css_input = open("build/tool.min.css", "r", 1)
css_string = "<style>" + css_input.read() + "</style>"
css_input.close()
css_injected_string = re.sub(css_tag_regex, css_string, html_string)
js_input = open("build/tool.min.js", "r", 1)
js_string = "<script>"+js_input.read()+ "</script>"
js_input.close()
js_injected_string = re.sub(js_tag_regex, js_string, css_injected_string)
output_file = open("build/index.html", "w")
output_file.write(js_injected_string)
output_file.close()