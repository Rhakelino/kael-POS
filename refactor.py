import sys
import re

def process_file(filepath, component_name,  start_tag_regex, end_tags_count):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove dark classes
    content = re.sub(r'\bdark:[a-zA-Z0-9_\-/]+\s*', '', content)
    
    # Fix flex-shrink-0
    content = content.replace('flex-shrink-0', 'shrink-0')
    
    # Remove the aside block completely
    content = re.sub(r'\s*\{?/\*\s*(Side|Sidebar).*?\*/\}?\s*<aside.*?</aside>', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove the wrapper
    component_start = f"export default function {component_name}() {{\n  return ("
    
    main_match = re.search(start_tag_regex, content)
    if not main_match:
        print(f"Could not find main tag in {filepath}")
        return
        
    main_content_start = main_match.group(0)
    
    top_part = content[:content.find(f"export default function {component_name}")] + component_start + "\n    " + content[main_match.start():]
    
    end_return_idx = top_part.rfind("  );\n}")
    if end_return_idx == -1:
        end_return_idx = top_part.rfind(");")
        
    bottom_part = top_part[end_return_idx:]
    middle_part = top_part[:end_return_idx]
    
    for _ in range(end_tags_count):
        last_div = middle_part.rfind("</div>")
        if last_div != -1:
            middle_part = middle_part[:last_div] + middle_part[last_div+6:]
            
    final_content = middle_part + bottom_part
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print(f"Processed {filepath}")

# page.js
process_file('src/app/page.js', 'Dashboard', r'<main className="flex-1 flex flex-col overflow-y-auto">', 2)

# cashier/page.js - wrapper is `<div className="flex-1 flex flex-col h-full min-w-0">`
process_file('src/app/cashier/page.js', 'Cashier', r'<div className="flex-1 flex flex-col h-full min-w-0">', 2)

# products/page.js - wrapper is `<main className="flex-1 overflow-y-auto bg-background-light p-8">`
process_file('src/app/products/page.js', 'Products', r'<main className="flex-1 overflow-y-auto bg-background-light p-8">', 2)

# settings/page.js - wrapper is `<main className="flex-1 flex flex-col overflow-y-auto">`
# wait, settings outer divs are `<div className="relative flex h-screen w-full overflow-hidden...` which is 1 div
process_file('src/app/settings/page.js', 'Settings', r'<main className="flex-1 flex flex-col overflow-y-auto">', 1)

