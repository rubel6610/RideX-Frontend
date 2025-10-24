# CompreFace Setup Guide

## What is CompreFace?

CompreFace is a free and open-source face recognition system that provides face detection, verification, and recognition capabilities through a REST API.

## Installation Options

### Option 1: Docker (Recommended)

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop

2. Run CompreFace with Docker Compose:

```bash
curl -L https://github.com/exadel-inc/CompreFace/raw/master/docker-compose.yml -o docker-compose.yml
docker-compose up -d
```

3. Access CompreFace UI at http://localhost:8000

### Option 2: Manual Installation

Follow the official guide: https://github.com/exadel-inc/CompreFace

## Configuration Steps

### 1. Create Application and API Key

1. Open http://localhost:8000 in your browser
2. Sign up for a new account
3. Create a new application (e.g., "RideX Face Verification")
4. Create a new service (select "Recognition Service")
5. Copy the API Key

### 2. Update Environment Variables

Edit `.env.local` file:

```env
NEXT_PUBLIC_COMPREFACE_API_URL=http://localhost:8000
NEXT_PUBLIC_COMPREFACE_API_KEY=your-api-key-here
```

Replace `your-api-key-here` with the API key from step 1.

### 3. Test the Integration

1. Start your Next.js application
2. Click "Verify your identity" checkbox
3. Allow camera access
4. Face detection should now work with CompreFace

## Features Implemented

- Real-time face detection
- Pose estimation (left, right, front)
- Face alignment calculation
- Face coverage percentage
- Age and gender detection (optional)
- Facial landmarks detection

## API Endpoints Used

- `/api/v1/detection/detect` - Face detection with pose estimation
- Face plugins: age, gender, pose, landmarks

## Troubleshooting

### Issue: API Key not working

- Ensure the API key is correctly copied from CompreFace UI
- Check that the service type is "Recognition Service"
- Verify the API URL is correct

### Issue: Connection refused

- Make sure CompreFace is running: `docker-compose ps`
- Check if port 8000 is available
- Restart CompreFace: `docker-compose restart`

### Issue: Slow detection

- Detection runs every 1 second to avoid overwhelming the API
- Ensure CompreFace has sufficient resources (at least 4GB RAM)
- Consider using GPU acceleration for better performance

## Performance Optimization

- Detection interval: 1000ms (adjustable in FaceVerificationModal.jsx)
- Image quality: 70% JPEG compression
- Face plugins: Only essential plugins enabled
- Detection threshold: 0.8 (adjustable in comprefaceConfig.js)

## Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- Consider using HTTPS for production deployments
- Implement rate limiting for API calls

## Resources

- CompreFace GitHub: https://github.com/exadel-inc/CompreFace
- Documentation: https://github.com/exadel-inc/CompreFace/tree/master/docs
- API Reference: https://github.com/exadel-inc/CompreFace/blob/master/docs/Rest-API-description.md
