export function detectSimpleFace(videoElement, canvasElement) {
  if (!videoElement || !canvasElement) {
    return null;
  }
  if (videoElement.readyState !== 4) {
    return null;
  }
  if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
    return null;
  }

  try {
    const ctx = canvasElement.getContext("2d");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const data = imageData.data;

    const width = canvasElement.width;
    const height = canvasElement.height;
    const totalPixels = width * height;

    let totalFacePixels = 0;
    let faceMinX = width;
    let faceMaxX = 0;
    let faceMinY = height;
    let faceMaxY = 0;

    const faceMap = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const totalIntensity = r + g + b;
        const avgColor = totalIntensity / 3;

        const hasColorVariation = Math.abs(r - avgColor) > 5 || Math.abs(g - avgColor) > 5 || Math.abs(b - avgColor) > 5;
        const hasSufficientBrightness = avgColor > 40;
        const isSignificantPixel = totalIntensity >= 30 && totalIntensity <= 750 && (hasColorVariation || hasSufficientBrightness);

        if (isSignificantPixel) {
          totalFacePixels++;
          faceMap.push({ x, y });
          if (x < faceMinX) faceMinX = x;
          if (x > faceMaxX) faceMaxX = x;
          if (y < faceMinY) faceMinY = y;
          if (y > faceMaxY) faceMaxY = y;
        }
      }
    }

    const facePercentage = (totalFacePixels / totalPixels) * 100;
    const hasFullFace = facePercentage > 2;

    let faceBounds = null;

    if (hasFullFace && faceMap.length > 0) {
      const centerX = (faceMinX + faceMaxX) / 2;
      const centerY = (faceMinY + faceMaxY) / 2;
      
      const denseFacePixels = faceMap.filter(p => {
        const distX = Math.abs(p.x - centerX);
        const distY = Math.abs(p.y - centerY);
        return distX < (faceMaxX - faceMinX) * 0.4 && distY < (faceMaxY - faceMinY) * 0.4;
      });

      if (denseFacePixels.length > 0) {
        let denseMinX = width;
        let denseMaxX = 0;
        let denseMinY = height;
        let denseMaxY = 0;

        denseFacePixels.forEach(p => {
          if (p.x < denseMinX) denseMinX = p.x;
          if (p.x > denseMaxX) denseMaxX = p.x;
          if (p.y < denseMinY) denseMinY = p.y;
          if (p.y > denseMaxY) denseMaxY = p.y;
        });

        const padding = 40;
        faceBounds = {
          x: Math.max(0, denseMinX - padding),
          y: Math.max(0, denseMinY - padding),
          width: Math.min(width, denseMaxX - denseMinX + padding * 2),
          height: Math.min(height, denseMaxY - denseMinY + padding * 2)
        };
      }
    }

    console.log("Face Detection:", {
      totalFacePixels,
      facePercentage: facePercentage.toFixed(2),
      hasFullFace,
      faceBounds
    });

    return {
      hasFullFace: hasFullFace,
      progress: hasFullFace ? 100 : 0,
      faceBounds: faceBounds
    };
  } catch (error) {
    console.error("Face detection error:", error);
    return null;
  }
}

// Function that captures the face
export async function captureFaceOnlyWithBgRemoval(videoElement, canvasElement, faceBounds) {
  if (!videoElement || !canvasElement || !faceBounds) return null;
  if (videoElement.readyState !== 4) return null;
  if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) return null;

  try {
    const ctx = canvasElement.getContext("2d");
    
    const scaleX = videoElement.videoWidth / 480;
    const scaleY = videoElement.videoHeight / 360;
    
    const sourceX = faceBounds.x * scaleX;
    const sourceY = faceBounds.y * scaleY;
    const sourceWidth = faceBounds.width * scaleX;
    const sourceHeight = faceBounds.height * scaleY;
    
    const padding = 20;
    const paddedX = Math.max(0, sourceX - padding);
    const paddedY = Math.max(0, sourceY - padding);
    const paddedWidth = Math.min(videoElement.videoWidth - paddedX, sourceWidth + padding * 2);
    const paddedHeight = Math.min(videoElement.videoHeight - paddedY, sourceHeight + padding * 2);
    
    canvasElement.width = 300;
    canvasElement.height = 300;
    
    ctx.translate(canvasElement.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      videoElement,
      videoElement.videoWidth - paddedX - paddedWidth,
      paddedY,
      paddedWidth,
      paddedHeight,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    return canvasElement.toDataURL("image/jpeg", 0.7);
  } catch (error) {
    console.error("Face capture error:", error);
    return null;
  }
}
