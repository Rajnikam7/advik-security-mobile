# Product Images

This folder should contain product images for the Products screen.

## Required Images (Optional)

If you want to use actual product images instead of icons, add the following images to this folder:

1. `gps-tracking.png` - GPS tracking security device
2. `hikvision-bullet.png` - Hikvision Smart IP Bullet camera
3. `hikvision-ptz.png` - Hikvision PTZ 10X Zoom camera
4. `cp-plus-360.png` - Cp Plus 360° 4G camera
5. `hikvision-ip.png` - Hikvision IP Camera
6. `biometric.png` - Biometric Attendance device
7. `cctv-services.png` - CCTV camera services
8. `hikvision-camera.png` - Hikvision camera
9. `led-tv.png` - LED SMART TV

## Current Implementation

The ProductsScreen currently uses icon-based placeholders with colored backgrounds. To switch to actual images:

1. Add the images to this folder
2. Update the `products` array in `ProductsScreen.js` to use `image: require('../assets/images/products/filename.png')` instead of `icon` and `iconColor`
3. Update the `renderProductCard` function to use `<Image>` component instead of icon container

## Image Specifications

- Format: PNG or JPG
- Recommended size: 200x200 pixels
- Background: Transparent or white
