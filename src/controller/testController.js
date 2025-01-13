import EmailService from "../util/EmailService.js";
import { successResponse, errorResponse } from '../util/responseUtil.js';

const testController = {
  test: async (req, res) => {
    try {
      const email = await EmailService.sendTestEmail("ruvinda.mail@gmail.com");
      if(email.success){
        return successResponse(res, "Email sent successfully", email.message, 200);
      }
      return errorResponse(res, email.message, 500);
    } catch (error) {
      return errorResponse(res, error.message, 500);
    }
  },
};

export default testController;