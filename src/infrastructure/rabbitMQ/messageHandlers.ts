import { PassThrough } from "stream";
import { AdminController } from "../../interface/controller/adminController";
import { userController } from "../../interface/controller/userController";
import rabbitMQClient from "./client";

export default class MessageHandlers {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response;

    switch (operation) {
      case "register_user":
        console.log("Handling operation:", operation);
        // console.log("hi i am avinash")
        // response="hi its response avinash"
        response = await userController.registerUser(data);
        break;
      case "save_user":
        console.log("Handling user save");
        response = await userController.saveUser(data);
        break;
      case "user_login":
        console.log("Handling operation :", operation);
        response = await userController.loginUser(data);
        break;
      case "google_login":
        console.log("Handling operation :", operation);
        response = await userController.loginWithGoogle(data);
        break;
      case "verify_email":
        console.log("Handling operation : ", operation);
        response = await userController.verifyEmail(data);
        break;
      case "resend_otp":
        console.log("Handling operation :", operation);
        response = await userController.resendOtp(data);
        break;
      case "reset_password":
        console.log("Handling operation :", operation);
        response = await userController.resetPassword(data);
        break;
      case "admin_login":
        console.log("Handling operation", operation);
        console.log(data, " data in admin login message handler");
        response = await AdminController.login(data);
        break;
      case "user_list":
        console.log("Handling operation :", operation);
        response = await AdminController.userList();
        break;
      case "block_user":
        console.log("Handling operation :", operation);
        response = await AdminController.changeStatus(data);
        break;
      case "user_data":
        console.log("Handling operation :", operation);
        response = await userController.userDataFetch(data);
        break;
        
        case "fetch-user-for-inbox":
        console.log("Handling operation :", operation);
        response = await userController.userDataFetchForInbox(data);
        break;
        case "contacts_fetch":
        console.log("Handling operation :", operation);
        response = await userController.contactsFetch(data);
        break;
        case "follow_user":
          console.log("Handling operation :", operation);
          response = await userController.followUser(data);
          break;
          case "unFollow_user":
          console.log("Handling operation :", operation);
          response = await userController.unFollowUser(data);
          break;
      case "update-UserData":
        console.log("Handling operation", operation);
        response = await userController.updateUserProfile(data);
        break;
      case "get-user-deatils-for-post":
        console.log("Handling operation : ", operation);
        console.log(data);
        response = await userController.fetchDataForPost(data);
        break;

      default:
        response = { error: "Operation not supported" };
        break;
    }

    console.log("Response in message handler:", response);
    await rabbitMQClient.produce(response, correlationId, replyTo);
  }
}

//----------------------------------------------------------------------------------------------------------------------------------
