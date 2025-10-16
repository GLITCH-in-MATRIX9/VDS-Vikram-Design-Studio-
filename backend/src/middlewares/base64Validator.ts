import { Request, Response, NextFunction } from 'express';
import { isBase64Image, getBase64ImageSize } from '../utils/imageProcessor';

/**
 * Middleware to validate and clean base64 content in request body
 */
export const validateBase64Content = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if request has sections data
    if (req.body.sections) {
      let sections = req.body.sections;
      
      // Parse sections if it's a string
      if (typeof sections === 'string') {
        try {
          sections = JSON.parse(sections);
        } catch (error) {
          return res.status(400).json({ 
            message: 'Invalid sections format',
            error: 'Sections must be valid JSON'
          });
        }
      }

      // Validate each section
      if (Array.isArray(sections)) {
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          
          if (section.type === 'image' && section.content) {
            // Check if content is base64
            if (isBase64Image(section.content)) {
              const size = getBase64ImageSize(section.content);
              const maxSize = 5 * 1024 * 1024; // 5MB
              
              if (size > maxSize) {
                return res.status(400).json({
                  message: 'Image too large',
                  error: `Base64 image size (${Math.round(size / 1024 / 1024)}MB) exceeds maximum allowed size (5MB)`,
                  sectionIndex: i
                });
              }
              
              // Log the conversion attempt
              console.log(`🔄 Base64 image detected in section ${i}, size: ${Math.round(size / 1024)}KB`);
            }
          }
        }
        
        // Update the parsed sections back to the request body
        req.body.sections = sections;
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Base64 validation error:', error);
    return res.status(500).json({
      message: 'Base64 validation failed',
      error: 'Internal server error during validation'
    });
  }
};

/**
 * Middleware to clean large base64 content from response
 * Note: After migration, this middleware is no longer needed as images are now Cloudinary URLs
 */
export const cleanBase64Response = (req: Request, res: Response, next: NextFunction) => {
  // No longer needed after migration - images are now Cloudinary URLs
  next();
};



