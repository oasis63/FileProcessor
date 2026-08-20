export type ToolCategory = 'PDF' | 'Image' | 'Media';

export type CatalogTool = {
  path: string;
  toolId: string;
  navTitle: string;
  h1: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  category: ToolCategory;
  related: string[];
};

export const TOOL_CATALOG: CatalogTool[] = [
  {
    path: '/compress-pdf',
    toolId: 'compress-pdf',
    navTitle: 'Compress PDF',
    h1: 'Compress PDF',
    metaTitle: 'Compress PDF Online — Free, No Signup',
    description:
      'Reduce PDF file size online with Ghostscript presets or a target size in MB. Free, no account. Files are deleted after 60 minutes.',
    keywords: ['compress pdf', 'reduce pdf size', 'pdf compressor', 'compress pdf to 2mb'],
    category: 'PDF',
    related: ['/merge-pdf', '/split-pdf', '/protect-pdf'],
  },
  {
    path: '/merge-pdf',
    toolId: 'merge-pdf',
    navTitle: 'Merge PDF',
    h1: 'Merge PDF',
    metaTitle: 'Merge PDF Files Online — Combine PDFs',
    description:
      'Combine multiple PDF files into one document. Order is preserved. Free online PDF merger with no signup.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf merger'],
    category: 'PDF',
    related: ['/split-pdf', '/compress-pdf', '/jpg-to-pdf'],
  },
  {
    path: '/split-pdf',
    toolId: 'split-pdf',
    navTitle: 'Split PDF',
    h1: 'Split PDF',
    metaTitle: 'Split PDF Online — Extract Pages',
    description:
      'Split a PDF into single-page files and download them as a ZIP. Free PDF splitter, no account required.',
    keywords: ['split pdf', 'extract pdf pages', 'pdf splitter'],
    category: 'PDF',
    related: ['/merge-pdf', '/pdf-to-jpg', '/rotate-pdf'],
  },
  {
    path: '/pdf-to-jpg',
    toolId: 'pdf-to-jpg',
    navTitle: 'PDF to JPG',
    h1: 'PDF to JPG',
    metaTitle: 'PDF to JPG Converter — Free Online',
    description:
      'Convert each PDF page to a JPEG at 150 DPI and download a ZIP of images. Free PDF to JPG converter.',
    keywords: ['pdf to jpg', 'pdf to jpeg', 'pdf to image'],
    category: 'PDF',
    related: ['/jpg-to-pdf', '/compress-pdf', '/split-pdf'],
  },
  {
    path: '/jpg-to-pdf',
    toolId: 'image-to-pdf',
    navTitle: 'JPG to PDF',
    h1: 'JPG to PDF',
    metaTitle: 'JPG to PDF — Convert Images to PDF',
    description:
      'Turn JPG, PNG, or WebP photos into a single PDF. Free image to PDF converter with no signup.',
    keywords: ['jpg to pdf', 'image to pdf', 'png to pdf', 'photos to pdf'],
    category: 'PDF',
    related: ['/pdf-to-jpg', '/merge-pdf', '/compress-image'],
  },
  {
    path: '/protect-pdf',
    toolId: 'protect-pdf',
    navTitle: 'Protect PDF',
    h1: 'Protect PDF',
    metaTitle: 'Password Protect a PDF Online',
    description:
      'Encrypt a PDF with a password using pdfcpu AES encryption. Free, processed on the server, deleted after one hour.',
    keywords: ['password protect pdf', 'encrypt pdf', 'lock pdf'],
    category: 'PDF',
    related: ['/remove-pdf-metadata', '/compress-pdf', '/merge-pdf'],
  },
  {
    path: '/rotate-pdf',
    toolId: 'rotate-pdf',
    navTitle: 'Rotate PDF',
    h1: 'Rotate PDF',
    metaTitle: 'Rotate PDF Pages 90°, 180°, or 270°',
    description:
      'Rotate every page in a PDF by 90, 180, or 270 degrees without re-rendering. Free online PDF rotator.',
    keywords: ['rotate pdf', 'turn pdf pages', 'pdf rotate 90'],
    category: 'PDF',
    related: ['/split-pdf', '/compress-pdf', '/pdf-to-jpg'],
  },
  {
    path: '/remove-pdf-metadata',
    toolId: 'remove-pdf-metadata',
    navTitle: 'Remove PDF Metadata',
    h1: 'Remove PDF Metadata',
    metaTitle: 'Remove PDF Metadata — Author & Title',
    description:
      'Strip author, title, and producer fields from a PDF before you share it. Free metadata cleaner.',
    keywords: ['remove pdf metadata', 'strip pdf metadata', 'clean pdf properties'],
    category: 'PDF',
    related: ['/protect-pdf', '/remove-image-metadata', '/compress-pdf'],
  },
  {
    path: '/compress-image',
    toolId: 'compress-image',
    navTitle: 'Compress Image',
    h1: 'Compress Image',
    metaTitle: 'Compress Image Online — JPG, PNG, WebP',
    description:
      'Shrink JPG, PNG, WebP, and HEIC files with a quality slider or a target size. Free image compressor, no account.',
    keywords: ['compress image', 'compress jpg', 'reduce photo size', 'image compressor'],
    category: 'Image',
    related: ['/resize-image', '/jpg-to-webp', '/remove-image-metadata'],
  },
  {
    path: '/resize-image',
    toolId: 'resize-image',
    navTitle: 'Resize Image',
    h1: 'Resize Image',
    metaTitle: 'Resize Image Online — Width & Height',
    description:
      'Change image width and height in pixels while keeping aspect ratio. Free online image resizer.',
    keywords: ['resize image', 'image resizer', 'change image size'],
    category: 'Image',
    related: ['/crop-image', '/compress-image', '/jpg-to-webp'],
  },
  {
    path: '/crop-image',
    toolId: 'crop-image',
    navTitle: 'Crop Image',
    h1: 'Crop Image',
    metaTitle: 'Crop Image Online — Free Photo Cropper',
    description:
      'Crop a rectangle from JPG, PNG, or WebP using width, height, and offset. Free online crop tool.',
    keywords: ['crop image', 'crop photo', 'image cropper'],
    category: 'Image',
    related: ['/resize-image', '/compress-image', '/jpg-to-pdf'],
  },
  {
    path: '/jpg-to-webp',
    toolId: 'convert-image',
    navTitle: 'JPG to WebP',
    h1: 'JPG to WebP',
    metaTitle: 'JPG to WebP Converter — Free',
    description:
      'Convert JPEG photos to WebP for smaller web images. Free JPG to WebP converter, no signup.',
    keywords: ['jpg to webp', 'convert jpg to webp', 'webp converter'],
    category: 'Image',
    related: ['/heic-to-jpg', '/compress-image', '/jpg-to-pdf'],
  },
  {
    path: '/heic-to-jpg',
    toolId: 'convert-image',
    navTitle: 'HEIC to JPG',
    h1: 'HEIC to JPG',
    metaTitle: 'HEIC to JPG — Convert iPhone Photos',
    description:
      'Convert iPhone HEIC and HEIF photos to JPEG that opens on any device. Free HEIC to JPG converter.',
    keywords: ['heic to jpg', 'heif to jpg', 'iphone heic converter'],
    category: 'Image',
    related: ['/jpg-to-webp', '/compress-image', '/remove-image-metadata'],
  },
  {
    path: '/remove-image-metadata',
    toolId: 'remove-image-metadata',
    navTitle: 'Remove Image Metadata',
    h1: 'Remove Image Metadata',
    metaTitle: 'Remove EXIF & GPS From Photos',
    description:
      'Strip EXIF, GPS, and camera tags from JPG, PNG, WebP, and HEIC before sharing. Free EXIF cleaner.',
    keywords: ['remove exif', 'strip gps from photo', 'image metadata cleaner'],
    category: 'Image',
    related: ['/compress-image', '/remove-pdf-metadata', '/heic-to-jpg'],
  },
  {
    path: '/video-to-audio',
    toolId: 'video-to-audio',
    navTitle: 'Video to Audio',
    h1: 'Video to Audio',
    metaTitle: 'Video to MP3 — Extract Audio Online',
    description:
      'Extract MP3, WAV, AAC, M4A, FLAC, or OGG from MP4, MOV, and MKV. Optional clip times. Free video to audio converter.',
    keywords: ['video to mp3', 'extract audio from video', 'mp4 to mp3', 'video to audio'],
    category: 'Media',
    related: [],
  },
];

export const INDEXABLE_PATHS = ['', '/about', '/privacy', '/terms', ...TOOL_CATALOG.map((t) => t.path)];

export function getToolByPath(path: string) {
  return TOOL_CATALOG.find((t) => t.path === path);
}

export function getRelatedTools(path: string) {
  const tool = getToolByPath(path);
  if (!tool) return [];
  return tool.related
    .map((p) => getToolByPath(p))
    .filter((t): t is CatalogTool => Boolean(t));
}
