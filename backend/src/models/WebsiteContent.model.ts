import { Schema, model, Document } from 'mongoose';

export interface IWebsiteContent extends Document {
  page: 'HOME' | 'ABOUT' | 'TEAM' | 'CONTACT' | 'CAREERS';
  section: string;
  title?: string;
  content: string;
  contentType: 'TEXT' | 'HTML' | 'MARKDOWN';
  isActive: boolean;
  lastModifiedBy: string;
  lastModifiedAt: Date;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>({
  page: {
    type: String,
    enum: ['HOME', 'ABOUT', 'TEAM', 'CONTACT', 'CAREERS'],
    required: true
  },
  section: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['TEXT', 'HTML', 'MARKDOWN'],
    default: 'TEXT'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastModifiedBy: {
    type: String,
    required: true,
    ref: 'AdminUser'
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

WebsiteContentSchema.index({ page: 1, section: 1 });
WebsiteContentSchema.index({ isActive: 1 });

export const WebsiteContent = model<IWebsiteContent>('WebsiteContent', WebsiteContentSchema);
