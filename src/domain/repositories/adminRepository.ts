import bcrtpt from 'bcrypt';
import { User } from '../../model/userModel';
import { IUser } from '../entities/IUser';

export interface userInterface {   
    username: string;
    email: string;
    about?:string;
    password: string;
    gender?: string;
    language?:string;
    profilePicture?: string;
    followers?: string[];
    followings?: string[];
    isOnline?:boolean;
    isAdmin?: boolean;
    desc?: string;
    isBlocked?:boolean;
    created_at?: Date;
}

export class AdminRepositoty {

    async checkAdmin(email: string, password: string) {
        try {
            const admin_data = await User.findOne({ email:email }).exec();
            console.log(email," email from client ",admin_data," admin data from db")
            if (!admin_data) {
                return { success: false, message: "Incorrect Email Address or Password" };
            }

            if (!admin_data.isAdmin) {
                return { success: false, message: "You are not authorized" };
            }

            const passwordMatch = await bcrtpt.compare(password, admin_data.password);

            if (!passwordMatch) {
                return { success: false, message: "Incorrect Email Address or Password" };

            }

            return { success: true, message: "logged in succesful",admin_data };

        } catch (error) {
            const err = error as Error;
            console.log("Error checking admin :", err);
            throw new Error(`Error checking admin:${err.message}`);
        }
    }

    async userList() {
        try {
            const userData = await User.find({ isAdmin: false }).sort({ _id: -1 });
            return userData;
        } catch (error) {
            const err = error as Error;
            console.log("Error user listing admin :", err);
            throw new Error(`Error user listing admin :${err.message}`);
        }
    }

    async changeStatus(email: string, isBlocked: boolean): Promise<{ success: boolean; message: string; blocked?:boolean; user_data?:IUser}> {
        try {
            // Find the user by email
            const userData = await User.findOne({ email });
            console.log(email," email coming to admin repo")
          

            if (!userData) {
                return { success: false, message: 'User not found' };
            }

            // Toggle the isBlocked status
            
            
            const updated = await User.updateOne({ email: email }, { $set: { isBlocked: !userData.isBlocked } });
            console.log(updated," updated db response in admin repo")
            console.log('Matched:', updated.matchedCount, 'Modified:', updated.modifiedCount);

            if (updated.modifiedCount == 1) {
                const userDataNew = await User.findOne({ email });
                if (!userDataNew) {
                    return { success: false, message: 'Error fetching updated user data' };
                  }
                
                return { success: true, message: 'Status of the user is changed',blocked:!userData.isBlocked,user_data:userDataNew};
            } else {
                return { success: false, message: 'Something went wrong. Try again later' };
            }


        } catch (error) {
            console.error("Error user status change admin:", error);
            const err = error as Error;
            return { success: false, message: `Error updating user status: ${err.message}` };
        }
    }

}