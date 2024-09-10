import { IUser } from "../../domain/entities/IUser";
import { UserRepository } from "../../domain/repositories/userRepository";
import { generateOtp } from "../../utils/generateOTP";
import { sendOtpEmail } from "../../utils/emialVerification";
import { fetchFileFromS3, uploadFileToS3 } from "../../infrastructure/s3/s3Actions";



interface user {
    email: string,
    password: string
}

export class UserService {

    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async registerUser(userData: IUser): Promise<any> {
        try {
            const existingUser = await this.userRepo.findEmail(userData.email);
            console.log(existingUser, 'user found');

            if (existingUser) {
                return { success: false, message: "Email already exists" };
            } else {
                const otp = generateOtp();
                console.log("this is generated otp", otp);
                console.log(userData)
                await sendOtpEmail(userData.email, otp);

                return { message: "Verify the otp to complete registration", success: true, otp, user_data: userData };
            }

        } catch (error) {

        }
    }

    async save(userData: IUser): Promise<any> {
        try {
            console.log(userData, '------------------------------------------------userService')
            const result = await this.userRepo.saveUser(userData);
            if (result) {
                return { success: true, message: 'Account created successfully', user_data: result };
            }
            else {
                return { success: false, message: 'someting went worng try again later' };
            }
        } catch (error) {

        }
    }

    async loginUser(data: user): Promise<any> {
        try {
            console.log(data, '------------------------------loginUser in userService');
            const result = await this.userRepo.checkUser(data.email, data.password);
            return result;
        } catch (error) {

        }
    }

    async verifyEmail(email: string): Promise<any> {
        try {
            const user = await this.userRepo.findEmail(email);
            console.log(user, 'user service in email verification');
            if (user) {
                const otp = generateOtp();
                await sendOtpEmail(email, otp);
                const user_data = {
                    email,
                    otp
                }
                return { success: true, message: 'Otp is send to the Email', user_data };
            } else {
                return { success: false, message: 'No user found, Register first' };
            }
        } catch (error) {

        }
    }

    //
    async resendOtp(email: string): Promise<any> {
        try {
            // const user = await this.userRepo.findEmail(email);
            console.log("user service in resend otp");
            console.log(email,"email got in user usecase")
          
                const otp = generateOtp();
                console.log(otp,"new otp generated by otp function")
                await sendOtpEmail(email, otp);
                const user_data = {
                    email,
                    otp
                }
                console.log(user_data,"email and otp in userservice user usecase")
                return { success: true,otp:otp, message: 'Otp is send to the Email', user_data };
           
        } catch (error) {

        }
    }
    //

    async resetPassword(email: string, password: string): Promise<any> {
        try {
            let user = await this.userRepo.resetPassword(email, password);
            console.log(user);
            return user;
        } catch (error) {

        }
    }

    async loginWithGoogle(data: any): Promise<any> {
        try {
            const email = data.decoded.email;
            const username = data.decoded.name;
            let user = await this.userRepo.findEmail(email);
            if (!user) {
                user = await this.userRepo.saveUser({
                    email,
                    username,
                    password: 'defaultpassword',
                } as IUser)
            }
            console.log(user.isBlocked);
            if (user.isBlocked) {
                console.log('isblocked----------------if')
                return { success: false, message: 'You have been blocked by the admin', user_data: user };
            } else {
                console.log('isblocked----------------else')
                return { success: true, message: 'Logged in successful', user_data: user };
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error logging in with Google: ${error.message}`);
            }
            throw error;
        }
    }
    
     async userDataFetch(email: string): Promise<any> {
        try {
            let user = await this.userRepo.findEmail(email);
            if(user){
                return { success: true, message: 'Got user data', user_data: user };
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error userdata fetch: ${error.message}`);
            }
            throw error;
        }
    }

    async updateUserProfile(data: any): Promise<{ success: boolean; message: string; avatarUrl?: string }> {
        try {
            console.log(data, 'data in application user.ts');
            let profile_pic: string = ''
            if (data.image) {
                const buffer = Buffer.isBuffer(data.image.buffer) ? data.image.buffer : Buffer.from(data.image.buffer);
                const key = await uploadFileToS3(buffer, data.image.originalname);
                profile_pic = await fetchFileFromS3(key, 604800);
            }
            console.log(profile_pic, '------------------')
            data.image = profile_pic||undefined
            const updateUser = await this.userRepo.updateUserProfile(data);
            console.log(updateUser, '-----------')
            if (!updateUser) {
                console.log('if')
                return { success: false, message: 'Profile is uptoDate' }
            }
            console.log('outside if')
            return { success: true, message: 'updated success', avatarUrl: profile_pic };
        } catch (error) {
            console.log('Error in updateUserProfile in application user userService');
            return { success: false, message: 'internal server error' };
        }
    }


}

