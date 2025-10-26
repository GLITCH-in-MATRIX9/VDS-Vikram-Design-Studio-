import { IAdminUser } from "../models/AdminUser.model";

declare global {
  namespace Express {
    interface Request {
      user?: IAdminUser;
    }
  }
}
