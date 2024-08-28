import { Request } from "express";
import { IUser } from "../models/user.model";

declare global {
  namespace Express {  // Capitalize 'Express'
    interface Request {
      user?: IUser;
    }
  }
}
