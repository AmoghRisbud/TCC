# PDF Cloud Storage Guide

## Overview
The TCC Frontend now uses external cloud storage URLs for research PDFs instead of self-hosted storage. Admins can upload PDFs to any cloud storage provider and simply paste the shareable link in the admin panel.

## Supported Cloud Storage Providers

The system accepts PDF URLs from the following trusted providers:

### Google Drive
1. Upload PDF to Google Drive
2. Right-click → Share → Copy link
3. Make sure link sharing is set to "Anyone with the link"
4. Paste URL in admin panel

**Example URL**: `https://drive.google.com/file/d/1abc123XYZ/view`

### Dropbox
1. Upload PDF to Dropbox
2. Right-click → Share → Create link
3. Copy the shareable link
4. Paste URL in admin panel

**Example URL**: `https://www.dropbox.com/s/abc123xyz/document.pdf?dl=0`

### Microsoft OneDrive
1. Upload PDF to OneDrive
2. Right-click → Share → Copy link
3. Ensure sharing permissions allow public access
4. Paste URL in admin panel

**Example URL**: `https://onedrive.live.com/view.aspx?cid=abc123&id=xyz`

### Box
1. Upload PDF to Box
2. Share → Copy shared link
3. Set permissions appropriately
4. Paste URL in admin panel

**Example URL**: `https://app.box.com/s/abc123xyz`

### AWS S3
- Use public S3 URLs or CloudFront URLs
- Ensure bucket/object permissions allow public read access

**Example URL**: `https://my-bucket.s3.amazonaws.com/path/to/document.pdf`

### Cloudinary
- Still supported for existing PDFs
- Upload via Cloudinary dashboard and use the public URL

**Example URL**: `https://res.cloudinary.com/cloud-name/raw/upload/v1234/document.pdf`

## How to Add a Research Article with PDF

1. Navigate to **Admin Panel** → **Research**
2. Click **Add New Article**
3. Fill in article details (title, authors, date, etc.)
4. In the **Research PDF Document URL** field:
   - Upload your PDF to any supported cloud storage
   - Get the shareable/public link
   - Paste it into the URL field
5. Click **Create Article**

## URL Validation

The system performs basic validation to ensure:
- URL is from a trusted cloud storage provider
- URL is properly formatted
- Content is accessible (for non-trusted providers)

Trusted providers skip detailed validation for performance.

## Best Practices

1. **Use stable URLs**: Ensure the cloud storage link won't expire
2. **Public access**: Make sure sharing settings allow anyone with the link to view
3. **Direct links**: Use direct file links when possible, not preview pages
4. **Descriptive names**: Name your PDF files descriptively before uploading

## Troubleshooting

### PDF Not Opening
- **Check sharing permissions**: Ensure the file is publicly accessible
- **Try different format**: Some providers offer multiple URL formats (e.g., Dropbox `?dl=1` for direct download)
- **Verify URL**: Make sure you copied the complete URL

### Validation Errors
- **Unsupported host**: Use one of the supported cloud storage providers
- **Invalid URL**: Check for typos or incomplete URLs
- **Access denied**: Verify file sharing permissions in your cloud storage

## Migration from Vercel Blob

If you have existing articles with Vercel Blob URLs (`/api/admin/blob/...`):

1. Download the PDFs from the old system
2. Upload them to your preferred cloud storage
3. Edit each article in the admin panel
4. Replace the old URL with the new cloud storage URL
5. Save changes

## Technical Details

### Allowed Hosts
The following domains are whitelisted in the validation system:

- `res.cloudinary.com`
- `drive.google.com`
- `docs.google.com`
- `googleapis.com`
- `dropbox.com`
- `dropboxusercontent.com`
- `onedrive.live.com`
- `1drv.ms`
- `sharepoint.com`
- `box.com`
- `s3.amazonaws.com`
- `amazonaws.com`
- `storage.googleapis.com`
- `cloudinary.com`

### Configuration

No environment variables required for cloud storage URLs. The system validates URLs based on trusted host patterns defined in:
- `app/api/admin/pdf-info/route.ts` (URL validation)
- `app/admin/research/AdminResearchManager.tsx` (admin panel validation)

## Support

For questions or issues with PDF cloud storage, please check:
1. Cloud storage provider's sharing documentation
2. Browser console for specific error messages
3. Admin panel validation feedback
