import re

with open('rental_source.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Title & Meta
content = content.replace('Gibbs Edu Tech — Institutional Rental & Proposal Portal (Confidential)', 'Gibbs Edu Tech — Institutional Proposal Portal (Confidential)')
content = content.replace('Confidential institutional infrastructure rental and program framework', 'Confidential institutional program framework')

# 2. Header Links
content = re.sub(r'<li><a href="#rental-tiers">.*?</a></li>\s*', '', content)
content = re.sub(r'<li><a href="#rental-tiers"><i class="fas fa-coins"></i> Volume-Based Rental Tiers</a></li>\s*', '', content)

# 3. Pricing
amount_pattern = r'<div class="pricing-central-amount">.*?</div>'
amount_replacement = '<div class="pricing-central-amount">\n                    <span class="pricing-value-big" style="font-size:2rem;">Custom Pricing</span>\n                </div>'
content = re.sub(amount_pattern, amount_replacement, content, flags=re.DOTALL)

note_pattern = r'<i class="fas fa-info-circle"></i> ₹15,000 per student \(exclusive of GST\)\.'
note_replacement = '<i class="fas fa-info-circle"></i> Pricing is customized per institution.'
content = content.replace(note_pattern, note_replacement)

# 4. Remove Rental Tiers Section
tier_pattern = r'<!-- ===================== 4\. VOLUME-BASED INFRASTRUCTURE RENTAL TIERS ===================== -->\s*<section id="rental-tiers".*?</section>\s*'
content = re.sub(tier_pattern, '', content, flags=re.DOTALL)

# 5. Footer
content = content.replace('Confidential Institutional Infrastructure Rental & Partnership Framework', 'Confidential Institutional Partnership Framework')

with open('rental_source.html', 'w', encoding='utf-8') as f:
    f.write(content)
