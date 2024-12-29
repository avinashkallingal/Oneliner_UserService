import { UserService } from "../../application/use-case/user";
import { IUserDetails, IUserPostDetails } from "../../domain/entities/IUserDeatils";
import { IUser } from "../../domain/entities/IUser";

  interface IdObject {
    id: string;
  }
  interface userObject {
    userId: string;
  }

class UserController {
    

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async registerUser(data: IUser) {
        try {

            const result = await this.userService.registerUser(data);
            return result;

        } catch (error) {
            console.log('error in the registerUser userController -->', error);
        }
    }

    async saveUser(data: IUser) {
        try {

            const userData = await this.userService.save(data);
            return userData

        } catch (error) {
            console.log('error in the saveUser userController --> ', error);
        }
    }

    async loginUser(data:{email:string,password:string}) {
        try {
            console.log(data, '---------------------------');
            const result = await this.userService.loginUser(data);
            console.log('loginuser-----------------usercontroleler',result)
            return result;
        } catch (error) {
            console.log('error in the registerUser userController -->', error);
        }
    }

    async verifyEmail(data:{email:string}) {
        try {
            console.log(data);
            const result = await this.userService.verifyEmail(data.email);
            return result;
            // const user_data = {
            //     email: data.email,
            //     otp: '1234'
            // }
            // return { success: true, message: 'Otp is send to the Email', user_data }
        } catch (error) {
            console.log('error in the verifyEmail -->', error);
        }
    }

    async resendOtp(data: string) {
        try {
            console.log(data);
            const result = await this.userService.resendOtp(data);
            return result;
            
        } catch (error) {
            console.log('error in the verifyEmail -->', error);
        }
    }

    async resetPassword(data: {email:string,newPassword:string}) {
        try {
            console.log(data);
            const result = await this.userService.resetPassword(data.email, data.newPassword);
            return result;
        } catch (error) {

        }
    }

    async loginWithGoogle(data: {email:string,password:string}) {
        try {
            console.log(data);
            const result = await this.userService.loginWithGoogle(data);
            return result;
        } catch (error) {
            console.log('error in the loginwithgoogle userController -->', error);
        }
    }
    
    async userDataFetch(data: any) {
        try {
            console.log(data);
            const result = await this.userService.userDataFetch(data);
            return result;
        } catch (error) {
            console.log('error in the loginwithgoogle userController -->', error);
        }
    }

    async userDataFetchForInbox(data: userObject) {
        try {
            console.log(data);
            const result = await this.userService.userDataFetchForInbox(data);
            return result;
        } catch (error) {
            console.log('error in the loginwithgoogle userController -->', error);
        }
    }
    
    async contactsFetch(data: IdObject) {
        try {
            console.log(data,"contact fetch data   ",typeof(data)," this is type of contact fetch data ********");
            const result = await this.userService.contactsFetch(data);
            return result;
        } catch (error) {
            console.log('error in the loginwithgoogle userController -->', error);
        }
    }

    
    async userSearch(data: string) {
        try {
            console.log(data);
            const result = await this.userService.searchUser(data);
            return result;
        } catch (error) {
            console.log('error in the loginwithgoogle userController -->', error);
        }
    }
    
    async followUser(data: {userId:string,followId:string}) {
        try {
            console.log(data);
            const result = await this.userService.followUser(data);
            return result;
        } catch (error) {
            console.log('error in the loginwithgoogle userController -->', error);
        }
    }

    async unFollowUser(data: {userId:string,followId:string}) {
        try {
            console.log(data);
            const result = await this.userService.unFollowUser(data);
            return result;
        } catch (error) {
            console.log('error in the loginwithgoogle userController -->', error);
        }
    }


    async updateUserProfile(data: string) {
        try {
            console.log(data);
            const result = await this.userService.updateUserProfile(data);
            console.log(result, '=======')
            return result
        } catch (error) {
            console.log('Error in teh updateUserProfile userControler userService -->', error)
        }
    }
    async fetchDataForPost(data: { userIds: string[] }): Promise<{ success: boolean; message: string; data?: IUserPostDetails[] }> {
        try {
            console.log('1', data)
            const results = await Promise.all(data.userIds.map(async (userId) => {
                return this.userService.fetchUserDatasForPost(userId);
            }));

            const successfulResult = results.filter(result => result.success).map(result => result.data);

            if (successfulResult.length > 0) {
                return {
                    success: true,
                    message: "data found",
                    data: successfulResult as IUserPostDetails[]
                };
            } else {
                return {
                    success: false,
                    message: 'No data found'
                }
            }
        } catch (error) {

            console.log('error in the fetchDataForPost usercontroller -->', error);
            console.error("Error fetching user data:", error);
            throw new Error("Error occurred while fetching user data");
        }
    }

}

export const userController = new UserController();


//-----------------------------------------------------------------------------------------------------------------------------------------