import os
import re

src_dir = r'c:\Users\Administrator\WorkBuddy\20260417135352\drama-writer\src'
for dp, dn, fn in os.walk(src_dir):
    for file in fn:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(dp, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            new_content = content
            # Replace orange with blue
            new_content = re.sub(r'orange-(\d+)', r'blue-\1', new_content)
            # Replace amber with cyan
            new_content = re.sub(r'amber-(\d+)', r'cyan-\1', new_content)
            # Replace text-orange with text-blue
            new_content = re.sub(r'text-orange', 'text-blue', new_content)
            # Replace text-amber with text-cyan
            new_content = re.sub(r'text-amber', 'text-cyan', new_content)
            if content != new_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated: {filepath}')
print('Done')
