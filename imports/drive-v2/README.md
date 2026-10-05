# Drive V2 import

15 Markdown profiles and 15 JPEG files verified byte-for-byte against the supplied ZIP.

- All 30 originals preserved under content/drive-v2/ in R2, with content-hash filenames.
- gear_milling.jpeg matched to Gear Hobbing after reading the title in the image.
- Both centerless grinding illustrations retained.
- Circular Sawing has no supplied image.
- Profiles are labelled Imported, not independently verified.
- Manifest records original filenames, SHA-256 digests, object keys, sizes, and matches.

Run scripts/prepare-drive-import.py to regenerate the catalog. Run node --env-file=.env.local scripts/upload-drive.mjs to upload and verify the originals. Existing objects are not overwritten.
