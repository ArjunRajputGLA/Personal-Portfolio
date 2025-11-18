# 📸 Adding Your Profile Photo

## Current Setup

The portfolio currently displays your initials "AR" as a placeholder. To add your actual profile photo:

## Option 1: Replace the Existing Photo File

1. **Rename your photo** to exactly: `arjun singh rajput.jpg`
2. **Move it to the `public` folder** (it's already there!)
3. **Update the About component**:

### Edit `components/About.tsx`

Find lines 38-42 and replace:

```typescript
<div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
  <div className="text-6xl font-bold text-purple-600">AR</div>
</div>
```

With:

```typescript
<div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
  <img
    src="/arjun singh rajput.jpg"
    alt="Arjun Singh Rajput"
    className="w-full h-full object-cover"
  />
</div>
```

## Option 2: Use a Different Filename

If you want to use a different filename:

1. **Place your photo** in the `public` folder (e.g., `profile.jpg`)
2. **Update the src path** in the code above to match your filename:
   ```typescript
   src="/profile.jpg"
   ```

## Image Recommendations

### Best Practices:
- **Format**: JPG or PNG
- **Size**: 800x800 pixels (square) or larger
- **File Size**: Under 500KB for optimal loading
- **Background**: Professional or clean background
- **Quality**: High resolution, well-lit

### Image Optimization Tips:
1. Use tools like [TinyPNG](https://tinypng.com/) to compress images
2. Crop to square aspect ratio before uploading
3. Ensure good lighting and clear focus
4. Professional attire recommended

## Alternative: Use Next.js Image Component (Advanced)

For better optimization, you can use Next.js Image component:

1. **Add the import** at the top of `components/About.tsx`:
```typescript
import Image from 'next/image';
```

2. **Replace the div** with:
```typescript
<div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900">
  <Image
    src="/arjun singh rajput.jpg"
    alt="Arjun Singh Rajput"
    fill
    className="object-cover"
    priority
  />
</div>
```

3. **Update `next.config.js`** if using external images:
```javascript
module.exports = {
  images: {
    domains: ['your-image-domain.com'], // if using external URLs
  },
}
```

## Troubleshooting

### Photo Not Showing?
1. ✅ Check file is in `public` folder
2. ✅ Check filename matches exactly (case-sensitive)
3. ✅ Refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. ✅ Clear Next.js cache: Delete `.next` folder and restart server

### Photo Looks Distorted?
- Use `object-cover` for crop-to-fit
- Use `object-contain` to show full image with padding
- Ensure source image is square or close to square

### File Size Too Large?
1. Compress using online tools
2. Resize to 1000x1000px maximum
3. Convert to WebP format for better compression

## Current File Location

Your current profile photo is located at:
```
c:\Users\Asus\Desktop\Personal Portfolio\arjun singh rajput.jpg
```

Simply update the About component as shown above to display it!

---

**Need help?** Check the main [CUSTOMIZATION.md](./CUSTOMIZATION.md) file for more details.
