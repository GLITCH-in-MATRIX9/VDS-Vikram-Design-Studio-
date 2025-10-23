import { Schema, model, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entityType: 'PROJECT' | 'USER' | 'CONTENT' | 'AUTH' | 'JOB' | 'APPLICATION';
  entityId?: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  userId: {
    type: String,
    required: true,
    ref: 'AdminUser'
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
    required: true
  },
  entityType: {
    type: String,
    enum: ['PROJECT', 'USER', 'CONTENT', 'AUTH', 'JOB', 'APPLICATION'],
    required: true
  },
  entityId: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });

export const ActivityLog = model<IActivityLog>('ActivityLog', ActivityLogSchema);
