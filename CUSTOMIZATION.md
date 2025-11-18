# 🎨 Customization Guide - ArjunRajput.ai Portfolio

This guide will help you customize your portfolio to match your preferences and keep it updated.

## 📝 Content Updates

### 1. Personal Information

**Location**: `components/About.tsx`, `components/Contact.tsx`

#### Update About Section:
```typescript
// components/About.tsx (lines 67-90)
- Change bio text to your own story
- Update location: "Mathura, Uttar Pradesh" → "Your City, State"
- Update fun fact to something personal
```

#### Update Contact Information:
```typescript
// components/Contact.tsx (lines 34-53)
{
  label: 'Email',
  value: 'your.email@domain.com',  // Change this
  link: 'mailto:your.email@domain.com',
},
{
  label: 'Phone',
  value: '+91 XXXXXXXXXX',  // Change this
  link: 'tel:+91XXXXXXXXXX',
},
{
  label: 'Location',
  value: 'Your City, State, Pincode',  // Change this
}
```

---

### 2. Social Media Links

**Location**: `components/Contact.tsx` (lines 55-71)

```typescript
const socialLinks = [
  {
    icon: Linkedin,
    name: 'LinkedIn',
    link: 'https://linkedin.com/in/your-profile',  // Add your LinkedIn
  },
  {
    icon: Github,
    name: 'GitHub',
    link: 'https://github.com/your-username',  // Add your GitHub
  },
  {
    icon: Code2,
    name: 'LeetCode',
    link: 'https://leetcode.com/your-username',  // Add your LeetCode
  },
];
```

---

### 3. Projects

**Location**: `components/Projects.tsx` (lines 12-88)

#### Add/Edit Projects:
```typescript
{
  title: 'Your Project Name',
  subtitle: 'Project Tagline',
  description: 'Detailed description of what the project does',
  category: 'Tech Category • Type',
  tech: ['Tech1', 'Tech2', 'Tech3'],
  icon: YourIcon,  // Import from lucide-react
  color: 'from-purple-500 to-pink-500',  // Gradient colors
  featured: false,  // Set to true for National Winner badge
  link: 'https://your-project-link.com',  // Add actual link
}
```

#### Available Icons:
```typescript
import { 
  Award, Zap, ShoppingCart, Gamepad2, FileText, 
  GraduationCap, FolderOpen, Shield, Rocket, Target 
} from 'lucide-react';
```

---

### 4. Skills

**Location**: `components/Skills.tsx` (lines 14-62)

#### Add/Edit Skill Categories:
```typescript
{
  title: 'Your Skill Category',
  icon: YourIcon,
  skills: ['Skill1', 'Skill2', 'Skill3'],
  color: 'purple',  // Available: purple, blue, green, pink, indigo, yellow, orange, cyan
}
```

---

### 5. Experience & Education

**Location**: `components/Experience.tsx` (lines 12-87)

#### Add New Experience:
```typescript
{
  type: 'work',  // or 'education'
  title: 'Your Job Title',
  organization: 'Company/University Name',
  location: 'City, State',
  period: 'Month Year – Month Year',
  description: [
    'Achievement or responsibility 1',
    'Achievement or responsibility 2',
  ],
  icon: Briefcase,  // or GraduationCap
  color: 'purple',  // Choose from available colors
}
```

---

### 6. Achievements

**Location**: `components/Achievements.tsx` (lines 26-84)

#### Add/Edit Achievements:
```typescript
{
  icon: Trophy,
  title: 'Achievement Title',
  subtitle: 'Achievement Subtitle',
  description: 'Detailed description',
  color: 'from-yellow-500 to-orange-500',
  stats: 'Achievement Stat',
  link: 'optional-link.com',  // Optional
}
```

---

## 🎨 Design Customization

### 1. Color Scheme

**Location**: `tailwind.config.js` and component files

#### Change Primary Colors:
```javascript
// Current: Purple & Blue gradient
// Find and replace in components:
'from-purple-600 to-blue-600' → 'from-your-color-600 to-your-color-600'
'text-purple-600' → 'text-your-color-600'
'bg-purple-600' → 'bg-your-color-600'
```

#### Popular Color Combinations:
- 🔵 Blue & Cyan: `from-blue-600 to-cyan-600`
- 🟢 Green & Emerald: `from-green-600 to-emerald-600`
- 🔴 Red & Orange: `from-red-600 to-orange-600`
- 🟣 Purple & Pink: `from-purple-600 to-pink-600`
- 🟠 Orange & Yellow: `from-orange-600 to-yellow-600`

---

### 2. Font Changes

**Location**: `app/layout.tsx`

#### Change Font:
```typescript
// Current: Inter
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// Options:
// - Poppins, Roboto, Open Sans, Montserrat, Lato
// - DM Sans, Space Grotesk, Plus Jakarta Sans

// Example with Poppins:
import { Poppins } from "next/font/google";
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"] 
});
```

---

### 3. Background Style

**Location**: `app/page.tsx` (line 38)

#### Current Style (Light & Modern):
```typescript
className="relative min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"
```

#### Alternative: Solid Background
```typescript
className="relative min-h-screen bg-white dark:bg-gray-900"
```

#### Alternative: Futuristic Dark
```typescript
className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black"
```

---

### 4. Animation Speed

**Location**: Component files with `transition` props

#### Make Animations Faster:
```typescript
// Change duration values
transition={{ duration: 0.6 }} → transition={{ duration: 0.3 }}
```

#### Disable Animations:
```typescript
// Remove or comment out motion components
<motion.div> → <div>
// Remove animate, initial, transition props
```

---

### 5. Section Spacing

**Location**: All component files

```typescript
// Current spacing
className="py-20 px-4"

// More compact
className="py-12 px-4"

// More spacious
className="py-32 px-4"
```

---

## 📱 Resume & Images

### 1. Update Resume

1. Replace `public/Arjun Resume.pdf` with your resume
2. Rename your file to `Arjun Resume.pdf` OR
3. Update the path in `components/Navigation.tsx` (line 40):
   ```typescript
   link.href = '/Your-Resume-Name.pdf';
   ```

### 2. Update Profile Photo

1. Replace `public/arjun singh rajput.jpg` with your photo
2. Rename your file to `arjun singh rajput.jpg` OR
3. Update the path in `components/About.tsx` (line 43):
   ```typescript
   src="/your-photo-name.jpg"
   ```

**Recommended Image Specs**:
- Profile Photo: Square (800x800px minimum)
- Format: JPG or PNG
- Size: Under 500KB for fast loading

---

## 🔧 Advanced Customization

### 1. Add New Section

1. Create new component: `components/YourSection.tsx`
2. Follow existing component structure
3. Import and add to `app/page.tsx`:
   ```typescript
   import YourSection from '@/components/YourSection';
   // ... in return statement
   <YourSection />
   ```
4. Add navigation link in `components/Navigation.tsx`

### 2. Modify Navigation

**Location**: `components/Navigation.tsx` (lines 24-32)

```typescript
const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Your Section', href: '#your-section' },  // Add new link
  // ... other links
];
```

### 3. Contact Form Backend

The contact form currently shows a success animation. To make it functional:

1. **Option 1: Formspree**
   ```typescript
   // components/Contact.tsx
   <form action="https://formspree.io/f/your-form-id" method="POST">
   ```

2. **Option 2: Netlify Forms**
   ```typescript
   <form name="contact" method="POST" data-netlify="true">
   ```

3. **Option 3: Custom API Route**
   - Create `app/api/contact/route.ts`
   - Implement email sending logic
   - Update form submission handler

---

## 🎯 Quick Customization Checklist

Before deploying, update:

- [ ] Personal info (name, email, phone, location)
- [ ] Social media links (LinkedIn, GitHub, LeetCode)
- [ ] All project links and descriptions
- [ ] Skills to match your expertise
- [ ] Work experience and education
- [ ] Achievements and stats
- [ ] Profile photo
- [ ] Resume PDF
- [ ] Color scheme (if desired)
- [ ] Meta tags in `app/layout.tsx`

---

## 💡 Tips for Best Results

1. **Keep It Updated**: Regularly add new projects and achievements
2. **High-Quality Images**: Use professional photos and project screenshots
3. **Accurate Links**: Test all external links before deploying
4. **Mobile Testing**: Check on different devices and screen sizes
5. **Performance**: Keep animations smooth, optimize images
6. **Consistency**: Maintain consistent tone and style throughout

---

## 🆘 Need Help?

Common customization issues:

1. **Component Not Updating**: Clear `.next` folder and rebuild
2. **Styling Issues**: Check Tailwind CSS classes are correct
3. **Image Not Loading**: Verify image path and file exists in `public/`
4. **Link Not Working**: Check `href` values match section `id`s

---

**Happy Customizing! 🎨**

Make this portfolio truly yours and showcase your unique journey! 🚀
