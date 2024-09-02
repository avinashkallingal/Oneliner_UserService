import { PassThrough } from "stream";
import { AdminController } from "../../interface/controller/adminController";
import { userController } from "../../interface/controller/userController";
import rabbitMQClient from './client'

export default class MessageHandlers {
    static async handle(operation: string, data: any, correlationId: string, replyTo: string) {
        let response;

        switch (operation) {
            case 'register_user':
                console.log('Handling operation:', operation); 
                // console.log("hi i am avinash")
                // response="hi its response avinash"
                response = await userController.registerUser(data);
                break;
            case 'save_user':
                console.log('Handling user save');
                response = await userController.saveUser(data);
                break;
            case 'user_login':
                console.log('Handling operation :', operation);
                response = await userController.loginUser(data);
                break;
            case 'verify_email':
                console.log('Handling operation : ', operation);
                response = await userController.verifyEmail(data);
                break;
            case 'resend_otp':
                console.log('Handling operation :', operation);
                response = await userController.resendOtp(data);
                break;
            case 'reset_password':
                console.log('Handling operation :', operation);
                response = await userController.resetPassword(data);
                break;         
            default:
                response = { error: 'Operation not supported' };
                break;
        }

        console.log('Response in message handler:', response);
        await rabbitMQClient.produce(response, correlationId, replyTo);
    }
}

//----------------------------------------------------------------------------------------------------------------------------------