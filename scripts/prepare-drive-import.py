from pathlib import Path
import hashlib,json,re,zipfile
root=Path(__file__).resolve().parents[1]
source=root/'V2'
archive=next(root.glob('V2-*.zip'))
with zipfile.ZipFile(archive) as z:
 entries=[n for n in z.namelist() if not n.endswith('/') and not n.startswith('__MACOSX/')]
 assert len(entries)==30, 'Unexpected archive inventory'
 for n in entries:
  p=source/Path(n).name
  assert p.is_file() and hashlib.sha256(p.read_bytes()).digest()==hashlib.sha256(z.read(n)).digest(), f'Archive mismatch: {n}'
def norm(name):
 s=Path(name).stem.lower();s=re.sub(r'\s*\(\d+\)','',s);s=s.replace('_process_profile','');return s.replace('_','-').strip()
def plain(s):
 return re.sub(r'\s+',' ',re.sub(r'[*`]', '',s)).strip()
files=[]
for p in sorted(source.iterdir()):
 if p.suffix.lower() not in ['.md','.jpeg','.jpg','.png']: continue
 digest=hashlib.sha256(p.read_bytes()).hexdigest()
 slug=norm(p.name)
 if p.name=='gear_milling.jpeg':slug='gear-hobbing'
 key=f'content/drive-v2/{slug}/{digest[:16]}{p.suffix.lower()}'
 files.append(dict(source=p.name,key=key,sha256=digest,size=p.stat().st_size,slug=slug,contentType='text/markdown; charset=utf-8' if p.suffix=='.md' else 'image/jpeg' if p.suffix.lower() in ['.jpeg','.jpg'] else 'image/png'))
profiles=[]
for f in files:
 if not f['source'].endswith('.md'):continue
 s=(source/f['source']).read_text().strip()
 if s.startswith('```markdown') and s.endswith('```'):s=s[len('```markdown'):].strip()[:-3].strip()
 name=f['slug'].replace('-',' ').title()
 definition=re.search(r'\*\*Definition:\*\*\s*(.+)',s)
 assert definition, f['source']
 desc=plain(definition[1])
 group='Grinding & Finishing' if any(w in f['slug'] for w in ['grinding','honing','filing']) else 'Sheet Cutting' if 'blanking' in f['slug'] else 'Sawing' if 'sawing' in f['slug'] else 'Machining'
 material_words=['steel','aluminum','aluminium','brass','bronze','titanium','cast iron','plastics','composites','superalloys']
 materials=[m.title() for m in material_words if re.search(r'\b'+m+r'\b',s,re.I)]
 features=[m.title() for m in ['keyways','splines','slots','threads','bores','holes','gears','flatness','surface finish','profiles'] if re.search(r'\b'+m+r'\b',s,re.I)]
 images=[dict(key=a['key'],title=f'{name} diagram'+(f' {i+1}' if i else ''),source=a['source']) for i,a in enumerate([a for a in files if a['slug']==f['slug'] and a['contentType'].startswith('image/')])]
 profiles.append(dict(slug=f['slug'],name=name,family='Subtractive Manufacturing',group=group,summary=desc[:157].rsplit(' ',1)[0]+'…' if len(desc)>160 else desc,description=desc,characteristics=[],features=features,materials=materials,applications=[],accent='#ef691e',icon=name[0],status='Imported',related=[],sourceKey=f['key'],sourceFile=f['source'],images=images))
for p in profiles:p['related']=[q['slug'] for q in profiles if q['group']==p['group'] and q['slug']!=p['slug']][:4]
assert len(profiles)==15 and len({p['slug'] for p in profiles})==15
manifest=dict(version=1,sourceFolder='1jFHhz_Aobd6HXS97at0X2RucahVxaDbx',files=files,profiles=profiles)
(root/'lib/generated/drive-catalog.json').write_text(json.dumps(profiles,indent=2)+'\n')
(root/'imports/drive-v2/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(root/'imports/drive-v2/README.md').write_text('''# Drive V2 import

15 Markdown profiles and 15 JPEG files verified byte-for-byte against the supplied ZIP.

- All 30 originals preserved under content/drive-v2/ in R2, with content-hash filenames.
- gear_milling.jpeg matched to Gear Hobbing after reading the title in the image.
- Both centerless grinding illustrations retained.
- Circular Sawing has no supplied image.
- Profiles are labelled Imported, not independently verified.
- Manifest records original filenames, SHA-256 digests, object keys, sizes, and matches.

Run scripts/prepare-drive-import.py to regenerate the catalog. Run node --env-file=.env.local scripts/upload-drive.mjs to upload and verify the originals. Existing objects are not overwritten.
''')
print(f'Prepared {len(profiles)} profiles and {len(files)} original files; {sum(f["size"] for f in files)/1024/1024:.1f} MiB.')
